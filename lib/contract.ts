import * as StellarSdk from "@stellar/stellar-sdk";
import { rpc, config, CONTRACT_ID } from "./stellar";

export interface ReviewResult {
  txHash: string;
  stellarExpertUrl: string;
}

export interface OnChainReview {
  wine_id: number;
  score: number;
  ia_notes: string;
  tx_hash: string;
  ledger: number;
  timestamp: number;
}

export async function buildLeaveReviewTx(
  sourceAddress: string,
  wineId: number,
  score: number,
  iaNotes: string
): Promise<string> {
  const account = await rpc.getAccount(sourceAddress);
  const contract = new StellarSdk.Contract(CONTRACT_ID);

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: "100000",
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(
      contract.call(
        "dejar_resena",
        StellarSdk.nativeToScVal(wineId, { type: "u32" }),
        StellarSdk.nativeToScVal(score, { type: "u32" }),
        StellarSdk.nativeToScVal(iaNotes, { type: "string" })
      )
    )
    .setTimeout(180)
    .build();

  const simulation = await rpc.simulateTransaction(transaction);

  if (StellarSdk.rpc.Api.isSimulationError(simulation)) {
    throw new Error(`Simulation failed: ${simulation.error}`);
  }

  const assembled = StellarSdk.rpc.assembleTransaction(
    transaction,
    simulation
  ).build();

  return assembled.toXDR();
}

export async function submitSignedTransaction(signedXdr: string): Promise<ReviewResult> {
  const transaction = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    config.networkPassphrase
  );

  const response = await rpc.sendTransaction(transaction);

  if (response.status === "ERROR") {
    throw new Error(`Transaction failed: ${response.errorResult}`);
  }

  let getResponse = await rpc.getTransaction(response.hash);
  while (getResponse.status === "NOT_FOUND") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    getResponse = await rpc.getTransaction(response.hash);
  }

  if (getResponse.status === "SUCCESS") {
    return {
      txHash: response.hash,
      stellarExpertUrl: `https://stellar.expert/explorer/testnet/tx/${response.hash}`,
    };
  }

  throw new Error(`Transaction failed: ${getResponse.status}`);
}

export async function getWineStats(wineId: number): Promise<{ totalScore: number; reviewCount: number } | null> {
  try {
    const account = await rpc.getAccount(CONTRACT_ID);
    const contract = new StellarSdk.Contract(CONTRACT_ID);

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: "100000",
      networkPassphrase: config.networkPassphrase,
    })
      .addOperation(
        contract.call(
          "obtener_ranking",
          StellarSdk.nativeToScVal(wineId, { type: "u32" })
        )
      )
      .setTimeout(180)
      .build();

    const simulation = await rpc.simulateTransaction(transaction);

    if (StellarSdk.rpc.Api.isSimulationError(simulation)) {
      return null;
    }

    if ("result" in simulation && simulation.result) {
      const result = simulation.result;
      const tuple = StellarSdk.scValToNative(result.retval) as [number, number];
      return { totalScore: tuple[0], reviewCount: tuple[1] };
    }

    return null;
  } catch {
    return null;
  }
}

export async function getAllWineStats(wineIds: number[]): Promise<Map<number, { totalScore: number; reviewCount: number; average: number }>> {
  const results = new Map<number, { totalScore: number; reviewCount: number; average: number }>();
  
  await Promise.all(wineIds.map(async (wineId) => {
    const stats = await getWineStats(wineId);
    if (stats && stats.reviewCount > 0) {
      results.set(wineId, {
        totalScore: stats.totalScore,
        reviewCount: stats.reviewCount,
        average: stats.totalScore / stats.reviewCount,
      });
    }
  }));

  return results;
}

export async function getRecentReviews(limit: number = 10): Promise<OnChainReview[]> {
  try {
    const eventsResponse = await rpc.getEvents({
      startLedger: 1720000,
      filters: [
        {
          type: "contract",
          contractIds: [CONTRACT_ID],
        },
      ],
    });

    const reviews: OnChainReview[] = [];
    
    for (const event of eventsResponse.events) {
      if (event.type !== "contract") continue;
      
      const topics = event.topic;
      if (!topics || topics.length < 3) continue;
      
      try {
        const topic2Str = topics[1].toString();
        if (topic2Str !== "resena") continue;
        
        const data = event.data;
        if (!data) continue;
        
        const dataObj = data.value();
        if (!dataObj || typeof dataObj !== "object") continue;
        
        const struct = dataObj as { vec?: () => StellarSdk.xdr.ScVal[] };
        if (!struct.vec) continue;
        
        const values = struct.vec();
        if (!values || values.length < 3) continue;
        
        const wineId = parseInt(StellarSdk.scValToNative(values[0]).toString(), 10);
        const score = parseInt(StellarSdk.scValToNative(values[1]).toString(), 10);
        const iaNotes = StellarSdk.scValToNative(values[2]) as string;
        
        if (isNaN(wineId) || isNaN(score)) continue;
        
        reviews.push({
          wine_id: wineId,
          score,
          ia_notes: iaNotes,
          tx_hash: event.id || event.transactionHash || "",
          ledger: event.ledger || 0,
          timestamp: event.ledgerTimestamp || 0,
        });
      } catch (parseError) {
        console.warn("Error parsing event:", parseError);
        continue;
      }
    }

    reviews.sort((a, b) => b.ledger - a.ledger);
    return reviews.slice(0, limit);
  } catch (error) {
    console.warn("Could not fetch events from RPC, using local state only:", error);
    return [];
  }
}

export function formatAddress(address: string): string {
  if (address.length <= 8) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
