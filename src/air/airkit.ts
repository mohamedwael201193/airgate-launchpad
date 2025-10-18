/**
 * AIR Kit integration stub.
 * TODO: Replace with real @mocanetwork/airkit SDK calls.
 */

import { safeGetEnv } from './env';
import type { RulesJSON } from './rules';

export interface AirCredential {
  id: string;
  type: string;
  status: 'active' | 'expired' | 'revoked';
  issuedAt: string;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
}

export interface VerificationProof {
  proofId: string;
  timestamp: string;
  rules: RulesJSON;
  isValid: boolean;
  metadata?: Record<string, unknown>;
}

export interface AirService {
  init: () => Promise<void>;
  login: () => Promise<{ address: string }>;
  logout: () => Promise<void>;
  getCredentials: () => Promise<AirCredential[]>;
  issueCredential: (programId: string, data?: Record<string, unknown>) => Promise<AirCredential>;
  createVerificationProof: (params: { programId: string; rules: RulesJSON }) => Promise<VerificationProof>;
}

let partnerToken: string | null = null;

async function fetchPartnerToken(): Promise<string> {
  const env = safeGetEnv();
  if (!env.partnerTokenUrl) {
    throw new Error('Partner token URL not configured');
  }

  // TODO: Replace with real partner token fetch
  // const response = await fetch(env.partnerTokenUrl, { method: 'POST' });
  // if (!response.ok) throw new Error('Failed to fetch partner token');
  // return response.text();

  console.log('[AIR Kit Stub] Fetching partner token from:', env.partnerTokenUrl);
  return 'stub-partner-token-' + Date.now();
}

export async function getAirService(): Promise<AirService> {
  const env = safeGetEnv();

  if (!partnerToken) {
    partnerToken = await fetchPartnerToken();
  }

  return {
    init: async () => {
      // TODO: Initialize @mocanetwork/airkit
      console.log('[AIR Kit Stub] Initializing with partner:', env.partnerId, 'env:', env.env);
    },

    login: async () => {
      // TODO: Call real login flow
      console.log('[AIR Kit Stub] Login triggered');
      return { address: '0xStub...Address' };
    },

    logout: async () => {
      // TODO: Call real logout
      console.log('[AIR Kit Stub] Logout triggered');
    },

    getCredentials: async () => {
      // TODO: Fetch real credentials from AIR
      console.log('[AIR Kit Stub] Fetching credentials');
      return [
        {
          id: 'kyc_basic',
          type: 'kyc',
          status: 'active',
          issuedAt: new Date(Date.now() - 86400000).toISOString(),
          metadata: { status: 'compliant' },
        },
        {
          id: 'work_history',
          type: 'claim',
          status: 'active',
          issuedAt: new Date(Date.now() - 172800000).toISOString(),
          metadata: { years: 3 },
        },
      ];
    },

    issueCredential: async (programId: string, data?: Record<string, unknown>) => {
      // TODO: Call real issuer program
      console.log('[AIR Kit Stub] Issuing credential for program:', programId, 'data:', data);
      return {
        id: `cred_${programId}_${Date.now()}`,
        type: programId,
        status: 'active',
        issuedAt: new Date().toISOString(),
        metadata: data,
      };
    },

    createVerificationProof: async ({ programId, rules }) => {
      // TODO: Call real verifier program to create ZK proof
      console.log('[AIR Kit Stub] Creating verification proof for program:', programId, 'rules:', rules);
      return {
        proofId: `proof_${Date.now()}`,
        timestamp: new Date().toISOString(),
        rules,
        isValid: true,
        metadata: { programId },
      };
    },
  };
}
