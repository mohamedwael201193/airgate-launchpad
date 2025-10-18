/**
 * Typed environment variable access with validation.
 * Throws clear errors with remediation tips if required variables are missing.
 */

export interface AirEnv {
  partnerId: string;
  env: 'testnet' | 'prod';
  mocaChainId: string;
  mocaRpcUrl: string;
  explorerBaseUrl: string;
  partnerTokenUrl: string;
  issuerProgramIds: Record<string, string>;
  verifierProgramIds: Record<string, string>;
  brand: string;
  contactEmail: string;
  demosEnabled: boolean;
}

export function getEnv(): AirEnv {
  const missingKeys: string[] = [];

  const partnerId = import.meta.env.VITE_AIR_PARTNER_ID;
  if (!partnerId) missingKeys.push('VITE_AIR_PARTNER_ID');

  const env = (import.meta.env.VITE_AIR_ENV || 'testnet') as 'testnet' | 'prod';
  
  const mocaChainId = import.meta.env.VITE_MOCA_CHAIN_ID;
  if (!mocaChainId) missingKeys.push('VITE_MOCA_CHAIN_ID');

  const mocaRpcUrl = import.meta.env.VITE_MOCA_RPC_URL;
  if (!mocaRpcUrl) missingKeys.push('VITE_MOCA_RPC_URL');

  const explorerBaseUrl = import.meta.env.VITE_EXPLORER_BASE_URL || 'https://explorer.moca.network';
  
  const partnerTokenUrl = import.meta.env.VITE_PARTNER_TOKEN_URL;
  if (!partnerTokenUrl) missingKeys.push('VITE_PARTNER_TOKEN_URL');

  let issuerProgramIds: Record<string, string> = {};
  try {
    issuerProgramIds = JSON.parse(import.meta.env.VITE_ISSUER_PROGRAM_IDS || '{}');
  } catch (e) {
    console.error('Failed to parse VITE_ISSUER_PROGRAM_IDS:', e);
  }

  let verifierProgramIds: Record<string, string> = {};
  try {
    verifierProgramIds = JSON.parse(import.meta.env.VITE_VERIFIER_PROGRAM_IDS || '{}');
  } catch (e) {
    console.error('Failed to parse VITE_VERIFIER_PROGRAM_IDS:', e);
  }

  const brand = import.meta.env.VITE_AIRGATE_BRAND || 'AirGate OS';
  const contactEmail = import.meta.env.VITE_AIRGATE_CONTACT_EMAIL || 'hello@airgate.example';
  const demosEnabled = import.meta.env.VITE_AIRGATE_DEMOS_ENABLED === 'true';

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingKeys.map(k => `  - ${k}`).join('\n')}\n\n` +
      `Remediation:\n` +
      `1. Copy .env.example to .env\n` +
      `2. Fill in your AIR Partner credentials\n` +
      `3. Add Issuer and Verifier Program IDs as JSON strings\n` +
      `4. Restart your dev server\n\n` +
      `See README.md for detailed setup instructions.`
    );
  }

  return {
    partnerId,
    env,
    mocaChainId,
    mocaRpcUrl,
    explorerBaseUrl,
    partnerTokenUrl,
    issuerProgramIds,
    verifierProgramIds,
    brand,
    contactEmail,
    demosEnabled,
  };
}

export function safeGetEnv(): Partial<AirEnv> {
  try {
    return getEnv();
  } catch {
    // Return safe defaults for demo mode
    return {
      partnerId: 'demo-partner',
      env: 'testnet',
      brand: 'AirGate OS',
      contactEmail: 'hello@airgate.example',
      demosEnabled: false,
      issuerProgramIds: {},
      verifierProgramIds: {},
    };
  }
}
