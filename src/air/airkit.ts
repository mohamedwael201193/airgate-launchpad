// Real AIR Kit integration based on official SDK
import { AirService, BUILD_ENV } from "@mocanetwork/airkit";
import { getEnv, getNodeEnv, isDebugMode } from "./env";

let svc: AirService | null = null;
let initOnce: Promise<any> | null = null;

async function getPartnerToken(scope: "issue"|"verify") {
  const env = getEnv();
  const url = `${env.VITE_PARTNER_TOKEN_URL}?scope=${scope}`;
  
  if (isDebugMode()) {
    console.log(`🔑 Fetching partner token for scope: ${scope}`);
  }
  
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error(`partner-token failed: ${res.status}`);
  
  const token = await res.text();
  
  if (isDebugMode()) {
    console.log(`✅ Partner token received for ${scope}`);
  }
  
  return token;
}

export async function initAir() {
  if (!svc) {
    const env = getEnv();
    
    if (isDebugMode()) {
      console.log('🔄 Initializing AIR Service with:', {
        partnerId: env.VITE_AIR_PARTNER_ID,
        nodeEnv: getNodeEnv(),
        appUrl: env.VITE_APP_URL
      });
    }
    
    svc = new AirService({
      partnerId: env.VITE_AIR_PARTNER_ID,
    });
  }
  if (!initOnce) {
    try {
      // Use NODE_ENV to determine build environment
      const buildEnv = getNodeEnv() === "production" ? BUILD_ENV.PRODUCTION : BUILD_ENV.DEVELOPMENT;
      
      if (isDebugMode()) {
        console.log(`🔄 Using build environment: ${buildEnv}`);
      }
      
      initOnce = svc.init({
        buildEnv: buildEnv,
        enableLogging: isDebugMode(),
        skipRehydration: false
      });
      
      if (isDebugMode()) {
        console.log('✅ AIR Service initialization started');
      }
    } catch (error) {
      console.error('❌ AIR Service initialization failed:', error);
      throw error;
    }
  }
  await initOnce;
  
  if (isDebugMode()) {
    console.log('✅ AIR Service ready');
  }
  
  return svc!;
}

export async function airLogin() {
  try {
    if (isDebugMode()) {
      console.log('🔄 Starting AIR login process...');
    }
    const s = await initAir();
    
    if (isDebugMode()) {
      console.log('🔄 AIR Service initialized, opening SSO...');
    }
    
    const res = await s.login(); // opens AIR SSO iframe
    
    if (isDebugMode()) {
      console.log('✅ AIR login successful:', res);
    }
    
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
  const env = getEnv();
  const s = await initAir();
  const token = await getPartnerToken("issue");
  
  if (isDebugMode()) {
    console.log('📝 Issuing credential:', opts.credentialId);
  }
  
  const result = await s.issueCredential({
    authToken: token,
    credentialId: opts.credentialId,
    issuerDid: opts.issuerDid || env.VITE_ISSUER_DID,
    credentialSubject: opts.credentialSubject,
  });
  
  if (isDebugMode()) {
    console.log('✅ Credential issued:', result);
  }
  
  return result;
}

export async function airVerify(opts: {
  programId: string;
  redirectUrl?: string;
}) {
  const env = getEnv();
  const s = await initAir();
  const token = await getPartnerToken("verify");
  
  if (isDebugMode()) {
    console.log('🔍 Verifying credential for program:', opts.programId);
  }
  
  // verifyCredential returns a status and payload (optionally an on-chain tx)
  const result = await s.verifyCredential({
    authToken: token,
    programId: opts.programId,
    redirectUrl: opts.redirectUrl || env.VITE_REDIRECT_URL || env.VITE_APP_URL, // fallback to app URL
  });
  
  if (isDebugMode()) {
    console.log('✅ Credential verified:', result);
  }
  
  return result;
}

export function getAirService() {
  if (!svc) throw new Error("AirService not initialized");
  return svc!;
}
