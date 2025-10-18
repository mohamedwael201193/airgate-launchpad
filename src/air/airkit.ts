// Real AIR Kit integration based on official SDK
import { AirService, BUILD_ENV } from "@mocanetwork/airkit";
import { z } from "zod";

const Env = z.object({
  VITE_AIR_PARTNER_ID: z.string(),
  VITE_AIR_ENV: z.enum(["testnet","prod"]).default("testnet"),
  VITE_PARTNER_TOKEN_URL: z.string().url(),
  VITE_EXPLORER_BASE_URL: z.string().url(),
  VITE_ISSUER_DID: z.string().optional(),
});

const env = Env.parse(import.meta.env);

let svc: AirService | null = null;
let initOnce: Promise<any> | null = null;

async function getPartnerToken(scope: "issue"|"verify") {
  const res = await fetch(`${env.VITE_PARTNER_TOKEN_URL}?scope=${scope}`, { method: "POST" });
  if (!res.ok) throw new Error(`partner-token failed: ${res.status}`);
  return res.text();
}

export async function initAir() {
  if (!svc) {
    console.log('🔄 Initializing AIR Service with partner ID:', env.VITE_AIR_PARTNER_ID);
    svc = new AirService({
      partnerId: env.VITE_AIR_PARTNER_ID,
    });
  }
  if (!initOnce) {
    try {
      // Try basic init configuration
      initOnce = svc.init({
        buildEnv: BUILD_ENV.DEVELOPMENT,
        enableLogging: true,
        skipRehydration: false
      });
      console.log('✅ AIR Service initialization started');
    } catch (error) {
      console.error('❌ AIR Service initialization failed:', error);
      throw error;
    }
  }
  await initOnce;
  console.log('✅ AIR Service ready');
  return svc!;
}

export async function airLogin() {
  try {
    console.log('🔄 Starting AIR login process...');
    const s = await initAir();
    console.log('🔄 AIR Service initialized, opening SSO...');
    const res = await s.login(); // opens AIR SSO iframe
    console.log('✅ AIR login successful:', res);
    return res; // contains user/session info
  } catch (error) {
    console.error('❌ AIR login failed:', error);
    throw error;
  }
}

export async function airIssue(opts: {
  credentialId: string;
  issuerDid?: string;
  credentialSubject: Record<string, unknown>;
}) {
  const s = await initAir();
  const token = await getPartnerToken("issue");
  return s.issueCredential({
    authToken: token,
    credentialId: opts.credentialId,
    issuerDid: opts.issuerDid || env.VITE_ISSUER_DID,
    credentialSubject: opts.credentialSubject,
  });
}

export async function airVerify(opts: {
  programId: string;
  redirectUrl?: string;
}) {
  const s = await initAir();
  const token = await getPartnerToken("verify");
  // verifyCredential returns a status and payload (optionally an on-chain tx)
  return s.verifyCredential({
    authToken: token,
    programId: opts.programId,
    redirectUrl: opts.redirectUrl, // optional deep-link to an issuance screen
  });
}

export function getAirService() {
  if (!svc) throw new Error("AirService not initialized");
  return svc!;
}
