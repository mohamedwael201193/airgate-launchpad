import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { airIssue, airLogin, airVerify, initAir } from "./airkit";
import { credentialCache } from "./cache";
import { getIssuerId, getVerifierId } from "./programs";
import type { TransactionHistory } from "./types";

type HistoryItem =
  | { type: "issued"; credentialId: string; at: number; payload: any }
  | { type: "verified"; programId: string; at: number; result: any };

type AirGateContextType = {
  ready: boolean;
  user: any | null;
  login: () => Promise<void>;
  issue: (key: string, subject: Record<string, unknown>) => Promise<any>;
  verify: (key: string) => Promise<any>;
  history: HistoryItem[];
  getIssuerId: (k: string) => string;
  getVerifierId: (k: string) => string;
};

const AirGateContext = createContext<AirGateContextType | null>(null);
const storeKey = "airgate-history";

export function AirGateProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try { 
      return JSON.parse(localStorage.getItem(storeKey) || "[]"); 
    } catch { 
      return []; 
    }
  });

  useEffect(() => {
    (async () => { 
      try {
        await initAir(); 
        setReady(true);
        console.log('🎯 Real AIR Kit ready!');
      } catch (error) {
        console.error('AIR Kit init failed:', error);
        setReady(true); // Still proceed for demo
      }
    })().catch(console.error);
  }, []);

  useEffect(() => { 
    localStorage.setItem(storeKey, JSON.stringify(history)); 
  }, [history]);

  const login = async () => {
    try {
      const res = await airLogin();
      setUser(res); // airLogin returns the user object directly
      console.log('✅ AIR login successful:', res);
    } catch (error) {
      console.error('❌ AIR login failed:', error);
      throw error;
    }
  };

  const issue = async (issuerKey: string, subject: Record<string, unknown>) => {
    try {
      const credentialId = getIssuerId(issuerKey);
      
      console.log('🔄 Issuing credential for:', issuerKey, credentialId);
      const result = await airIssue({
        credentialId,
        credentialSubject: subject
      });
      
      // Create history item with the result
      const historyItem = { type: "issued" as const, credentialId, at: Date.now(), payload: result };
      setHistory(h => [...h, historyItem]);
      
      // Cache the transaction
      const cacheHistoryItem: TransactionHistory = {
        id: credentialId,
        type: "issue",
        status: "success",
        programId: credentialId,
        credentialId,
        timestamp: Date.now()
      };
      credentialCache.addHistoryItem(cacheHistoryItem);
      
      console.log('✅ Credential issued successfully:', credentialId);
      return result;
    } catch (error) {
      console.error('❌ Credential issuance failed:', error);
      throw error;
    }
  };

  const verify = async (verifierKey: string) => {
    try {
      const programId = getVerifierId(verifierKey);
      
      console.log('🔄 Verifying credential for:', verifierKey, programId);
      const result = await airVerify({
        programId,
        redirectUrl: window.location.origin + "/issue"
      });
      
      const historyItem = { type: "verified" as const, programId, at: Date.now(), result };
      setHistory(h => [...h, historyItem]);
      
      // Cache the transaction
      const cacheHistoryItem: TransactionHistory = {
        id: programId,
        type: "verify",
        status: "success",
        programId,
        timestamp: Date.now()
      };
      credentialCache.addHistoryItem(cacheHistoryItem);
      
      console.log('✅ Credential verification completed:', result);
      return result;
    } catch (error) {
      console.error('❌ Credential verification failed:', error);
      throw error;
    }
  };

  const value = useMemo<AirGateContextType>(() => ({
    ready, user, login, issue, verify, history, getIssuerId, getVerifierId
  }), [ready, user, history]);

  return (
    <AirGateContext.Provider value={value}>
      {children}
    </AirGateContext.Provider>
  );
}

export const useAirGate = () => {
  const ctx = useContext(AirGateContext);
  if (!ctx) throw new Error("useAirGate must be used within AirGateProvider");
  return ctx;
};
