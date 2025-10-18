import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAirService } from "./airkit";
import { getIssuerId, getVerifierId } from "./programs";

type Ctx = {
  ready: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getIssuerId: (k: string) => string;
  getVerifierId: (k: string) => string;
  service: any;
};
const AirGateCtx = createContext<Ctx | null>(null);

export function AirGateProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const service = useMemo(() => getAirService(), []);
  useEffect(() => { 
    service.init?.({ 
      buildEnv: service.buildEnv || 'development', 
      enableLogging: true, 
      skipRehydration: false 
    }).finally(() => setReady(true)); 
  }, [service]);

  const login = async () => { await service.login?.(); };
  const logout = async () => { await service.logout?.(); };

  return (
    <AirGateCtx.Provider value={{ ready, login, logout, getIssuerId, getVerifierId, service }}>
      {children}
    </AirGateCtx.Provider>
  );
}
export const useAirGate = () => {
  const ctx = useContext(AirGateCtx);
  if (!ctx) throw new Error("useAirGate must be used within AirGateProvider");
  return ctx;
};
