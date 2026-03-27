"use client";

import { useState, useEffect, useCallback } from "react";
import {
  isConnected,
  isAllowed,
  requestAccess,
  getAddress,
  signTransaction,
  getNetwork,
} from "@stellar/freighter-api";

export function useFreighter() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [networkPassphrase, setNetworkPassphrase] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = useCallback(async () => {
    setIsLoading(true);
    try {
      const freighterConnected = await isConnected();
      if (!freighterConnected) {
        setConnected(false);
        setAddress(null);
        setNetwork(null);
        setNetworkPassphrase(null);
        setIsLoading(false);
        return;
      }

      const allowed = await isAllowed();
      if (allowed) {
        const addressResult = await getAddress();
        const networkResult = await getNetwork();
        
        if (addressResult.address && !addressResult.error) {
          setConnected(true);
          setAddress(addressResult.address);
          setNetwork(networkResult.network || null);
          setNetworkPassphrase(networkResult.networkPassphrase || null);
        } else {
          setConnected(false);
          setAddress(null);
          setNetwork(null);
          setNetworkPassphrase(null);
        }
      } else {
        setConnected(false);
        setAddress(null);
        setNetwork(null);
        setNetworkPassphrase(null);
      }
    } catch {
      setConnected(false);
      setAddress(null);
      setNetwork(null);
      setNetworkPassphrase(null);
    }
    setIsLoading(false);
  }, []);

  const connect = useCallback(async () => {
    try {
      const freighterConnected = await isConnected();
      if (!freighterConnected) {
        throw new Error("Freighter extension not installed");
      }

      await requestAccess();
      const addressResult = await getAddress();
      const networkResult = await getNetwork();

      if (addressResult.error || !addressResult.address) {
        throw new Error(addressResult.error?.message || "Failed to get address");
      }

      setConnected(true);
      setAddress(addressResult.address);
      setNetwork(networkResult.network || null);
      setNetworkPassphrase(networkResult.networkPassphrase || null);

      return addressResult.address;
    } catch (error) {
      console.error("Failed to connect:", error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    setConnected(false);
    setAddress(null);
    setNetwork(null);
    setNetworkPassphrase(null);
  }, []);

  const sign = useCallback(
    async (xdr: string, networkPassphraseToUse?: string) => {
      if (!connected) throw new Error("Wallet not connected");
      const passphrase = networkPassphraseToUse || networkPassphrase || "Test SDF Network ; September 2015";
      const result = await signTransaction(xdr, { networkPassphrase: passphrase });
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.signedTxXdr;
    },
    [connected, networkPassphrase]
  );

  return { 
    connected, 
    address, 
    network,
    networkPassphrase,
    isLoading,
    connect, 
    disconnect, 
    sign,
    checkConnection 
  };
}
