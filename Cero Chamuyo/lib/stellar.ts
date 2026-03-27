import * as StellarSdk from "@stellar/stellar-sdk";

const NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet";

export const config = {
  testnet: {
    rpcUrl: "https://soroban-testnet.stellar.org",
    networkPassphrase: StellarSdk.Networks.TESTNET,
    friendbotUrl: "https://friendbot.stellar.org",
  },
  mainnet: {
    rpcUrl: "https://soroban-mainnet.stellar.org",
    networkPassphrase: StellarSdk.Networks.PUBLIC,
    friendbotUrl: null,
  },
}[NETWORK]!;

export const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || "CAGKEEG45CJPNLQ4O5QWLAGCPYDZLR7LOF2PYE7MDK4SFIQR464Z2XPW";

export const rpc = new StellarSdk.rpc.Server(config.rpcUrl);
