import * as StellarSdk from "@stellar/stellar-sdk";
import { rpc, config, CONTRACT_ID } from "./stellar";

export interface ReviewResult {
  txHash: string;
  stellarExpertUrl: string;
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

export function formatAddress(address: string): string {
  if (address.length <= 8) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
