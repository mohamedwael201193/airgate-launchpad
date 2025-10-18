import { z } from "zod";

const Env = z.object({
  // Core AIR Configuration
  VITE_AIR_PARTNER_ID: z.string().min(1),
  VITE_AIR_ENV: z.enum(["testnet","prod"]).default("testnet"),
  VITE_AIR_DEBUG: z.string().optional().transform(val => val === "true"),
  
  // Network Configuration
  VITE_MOCA_CHAIN_ID: z.string().min(1),
  VITE_MOCA_RPC_URL: z.string().url(),
  VITE_EXPLORER_BASE_URL: z.string().url(),
  
  // Authentication & Token URLs
  VITE_PARTNER_TOKEN_URL: z.string().url(),
  
  // Identity Configuration
  VITE_ISSUER_DID: z.string().min(1),
  VITE_VERIFIER_DID: z.string().min(1),
  
  // Program IDs (JSON strings)
  VITE_ISSUER_PROGRAM_IDS: z.string().transform(s => JSON.parse(s)),
  VITE_VERIFIER_PROGRAM_IDS: z.string().transform(s => JSON.parse(s)),
  
  // Application Configuration
  VITE_AIRGATE_BRAND: z.string().min(1),
  VITE_AIRGATE_CONTACT_EMAIL: z.string().email(),
  VITE_AIRGATE_DEMOS_ENABLED: z.string().optional().transform(val => val === "true"),
  
  // Web3 Configuration
  VITE_WALLET_CONNECT_PROJECT_ID: z.string().min(1),
  
  // Application URLs
  VITE_NODE_ENV: z.enum(["development", "production"]).default("development"),
  VITE_APP_URL: z.string().url(),
  VITE_REDIRECT_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof Env> & {
  VITE_ISSUER_PROGRAM_IDS: Record<string,string>;
  VITE_VERIFIER_PROGRAM_IDS: Record<string,string>;
};

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (!cachedEnv) {
    const raw = {
      // Core AIR Configuration
      VITE_AIR_PARTNER_ID: import.meta.env.VITE_AIR_PARTNER_ID,
      VITE_AIR_ENV: import.meta.env.VITE_AIR_ENV,
      VITE_AIR_DEBUG: import.meta.env.VITE_AIR_DEBUG,
      
      // Network Configuration
      VITE_MOCA_CHAIN_ID: import.meta.env.VITE_MOCA_CHAIN_ID,
      VITE_MOCA_RPC_URL: import.meta.env.VITE_MOCA_RPC_URL,
      VITE_EXPLORER_BASE_URL: import.meta.env.VITE_EXPLORER_BASE_URL,
      
      // Authentication & Token URLs
      VITE_PARTNER_TOKEN_URL: import.meta.env.VITE_PARTNER_TOKEN_URL,
      
      // Identity Configuration
      VITE_ISSUER_DID: import.meta.env.VITE_ISSUER_DID,
      VITE_VERIFIER_DID: import.meta.env.VITE_VERIFIER_DID,
      
      // Program IDs
      VITE_ISSUER_PROGRAM_IDS: import.meta.env.VITE_ISSUER_PROGRAM_IDS || "{}",
      VITE_VERIFIER_PROGRAM_IDS: import.meta.env.VITE_VERIFIER_PROGRAM_IDS || "{}",
      
      // Application Configuration
      VITE_AIRGATE_BRAND: import.meta.env.VITE_AIRGATE_BRAND,
      VITE_AIRGATE_CONTACT_EMAIL: import.meta.env.VITE_AIRGATE_CONTACT_EMAIL,
      VITE_AIRGATE_DEMOS_ENABLED: import.meta.env.VITE_AIRGATE_DEMOS_ENABLED,
      
      // Web3 Configuration
      VITE_WALLET_CONNECT_PROJECT_ID: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
      
      // Application URLs
      VITE_NODE_ENV: import.meta.env.VITE_NODE_ENV,
      VITE_APP_URL: import.meta.env.VITE_APP_URL,
      VITE_REDIRECT_URL: import.meta.env.VITE_REDIRECT_URL,
    };
    
    try {
      cachedEnv = Env.parse(raw) as Env;
      console.log("✅ Environment validation successful");
    } catch (error) {
      console.error("❌ Environment validation failed:", error);
      throw error;
    }
  }
  return cachedEnv;
}

// Export individual getters for convenience
export const getPartnerId = () => getEnv().VITE_AIR_PARTNER_ID;
export const getAirEnv = () => getEnv().VITE_AIR_ENV;
export const getAppUrl = () => getEnv().VITE_APP_URL;
export const getNodeEnv = () => getEnv().VITE_NODE_ENV;
export const isDebugMode = () => getEnv().VITE_AIR_DEBUG;
export const getWalletConnectProjectId = () => getEnv().VITE_WALLET_CONNECT_PROJECT_ID;
