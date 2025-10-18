// TypeScript interfaces for AIR Kit SDK responses and data structures

export interface AirUser {
  id: string;
  walletAddress?: string;
  connectedAt: number;
  metadata?: Record<string, any>;
}

export interface CredentialData {
  programId: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface IssuedCredential {
  id: string;
  programId: string;
  issuerId: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
  issuedAt: number;
  txHash?: string;
  status: 'pending' | 'issued' | 'failed';
}

export interface VerificationRequest {
  programId: string;
  verifierId: string;
  credentialId?: string;
  metadata?: Record<string, any>;
}

export interface CredentialVerificationResult {
  id: string;
  status: 'compliant' | 'non-compliant' | 'pending' | 'failed';
  programId: string;
  verifierId: string;
  credentialId?: string;
  proofId?: string;
  txHash?: string;
  timestamp: number;
  metadata?: Record<string, any>;
  errors?: string[];
}

export interface AirKitConfig {
  environment: 'TESTNET' | 'MAINNET' | 'DEVNET';
  partnerToken: string;
  issuerDid?: string;
  verifierDid?: string;
}

export interface PartnerTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  scope: string;
  issuedAt: number;
}

export interface ScopedTokenRequest {
  scope: 'issue' | 'verify';
  programId?: string;
  metadata?: Record<string, any>;
}

export interface TransactionHistory {
  id: string;
  type: 'login' | 'issue' | 'verify';
  status: 'success' | 'failed' | 'pending';
  programId?: string;
  issuerId?: string;
  verifierId?: string;
  credentialId?: string;
  txHash?: string;
  timestamp: number;
  metadata?: Record<string, any>;
  error?: string;
}

export interface AirGateState {
  user: AirUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  ready: boolean;
  error: string | null;
  history: TransactionHistory[];
}

// AIR Kit SDK method responses
export interface AirLoginResponse {
  user: AirUser;
  sessionToken: string;
  expiresAt: number;
}

export interface AirIssueResponse {
  credential: IssuedCredential;
  txHash?: string;
  timestamp: number;
}

export interface AirVerifyResponse {
  result: CredentialVerificationResult;
  proofs: any[];
  timestamp: number;
}

// Error types
export interface AirKitError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: number;
}

export type AirKitErrorType = 
  | 'AUTHENTICATION_FAILED'
  | 'INVALID_CREDENTIAL'
  | 'NETWORK_ERROR'
  | 'CONFIGURATION_ERROR'
  | 'VERIFICATION_FAILED'
  | 'TOKEN_EXPIRED'
  | 'UNKNOWN_ERROR';

// Utility types
export type CredentialStatus = IssuedCredential['status'];
export type VerificationStatus = CredentialVerificationResult['status'];
export type TransactionType = TransactionHistory['type'];
export type TransactionStatus = TransactionHistory['status'];

// Program configuration types
export interface ProgramConfig {
  id: string;
  name: string;
  description: string;
  issuerId?: string;
  verifierId?: string;
  schema: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface IssuerConfig {
  id: string;
  name: string;
  programId: string;
  endpoint: string;
  metadata?: Record<string, any>;
}

export interface VerifierConfig {
  id: string;
  name: string;
  programId: string;
  endpoint: string;
  metadata?: Record<string, any>;
}

