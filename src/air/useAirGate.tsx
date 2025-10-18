/**
 * AirGate React Context and Zustand store.
 * Provides global access to AIR service and state.
 */

import { create } from 'zustand';
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { getAirService, AirService, AirCredential } from './airkit';
import { getIssuerId, getVerifierId } from './programs';
import { safeGetEnv } from './env';

interface AirGateState {
  service: AirService | null;
  user: { address: string } | null;
  credentials: AirCredential[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshCredentials: () => Promise<void>;
}

export const useAirGateStore = create<AirGateState>((set, get) => ({
  service: null,
  user: null,
  credentials: [],
  isLoading: false,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      const service = await getAirService();
      await service.init();
      set({ service, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to initialize AIR service',
        isLoading: false 
      });
    }
  },

  login: async () => {
    const { service } = get();
    if (!service) throw new Error('Service not initialized');
    
    try {
      set({ isLoading: true, error: null });
      const user = await service.login();
      const credentials = await service.getCredentials();
      set({ user, credentials, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    const { service } = get();
    if (!service) return;
    
    try {
      await service.logout();
      set({ user: null, credentials: [] });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  refreshCredentials: async () => {
    const { service } = get();
    if (!service) return;
    
    try {
      const credentials = await service.getCredentials();
      set({ credentials });
    } catch (error) {
      console.error('Failed to refresh credentials:', error);
    }
  },
}));

interface AirGateContextValue {
  getIssuerId: (key: string) => string;
  getVerifierId: (key: string) => string;
  env: ReturnType<typeof safeGetEnv>;
}

const AirGateContext = createContext<AirGateContextValue | null>(null);

export function AirGateProvider({ children }: { children: ReactNode }) {
  const initialize = useAirGateStore(state => state.initialize);
  const env = safeGetEnv();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const value: AirGateContextValue = {
    getIssuerId,
    getVerifierId,
    env,
  };

  return (
    <AirGateContext.Provider value={value}>
      {children}
    </AirGateContext.Provider>
  );
}

export function useAirGate() {
  const context = useContext(AirGateContext);
  if (!context) {
    throw new Error('useAirGate must be used within AirGateProvider');
  }
  
  const store = useAirGateStore();
  
  return {
    ...store,
    ...context,
  };
}
