import { z } from "zod";

const Env = z.object({
  VITE_AIR_PARTNER_ID: z.string().min(1),
  VITE_AIR_ENV: z.enum(["testnet","prod"]),
  VITE_MOCA_CHAIN_ID: z.string().min(1),
  VITE_MOCA_RPC_URL: z.string().url(),
  VITE_EXPLORER_BASE_URL: z.string().url(),
  VITE_PARTNER_TOKEN_URL: z.string().url(),
  VITE_ISSUER_PROGRAM_IDS: z.string().transform(s => JSON.parse(s)),
  VITE_VERIFIER_PROGRAM_IDS: z.string().transform(s => JSON.parse(s)),
  VITE_AIRGATE_BRAND: z.string().min(1),
  VITE_AIRGATE_CONTACT_EMAIL: z.string().min(3),
  VITE_AIRGATE_DEMOS_ENABLED: z.string().optional(),
});

export type Env = z.infer<typeof Env> & {
  VITE_ISSUER_PROGRAM_IDS: Record<string,string>;
  VITE_VERIFIER_PROGRAM_IDS: Record<string,string>;
};

export function getEnv(): Env {
  const raw = {
    VITE_AIR_PARTNER_ID: import.meta.env.VITE_AIR_PARTNER_ID,
    VITE_AIR_ENV: import.meta.env.VITE_AIR_ENV,
    VITE_MOCA_CHAIN_ID: import.meta.env.VITE_MOCA_CHAIN_ID,
    VITE_MOCA_RPC_URL: import.meta.env.VITE_MOCA_RPC_URL,
    VITE_EXPLORER_BASE_URL: import.meta.env.VITE_EXPLORER_BASE_URL,
    VITE_PARTNER_TOKEN_URL: import.meta.env.VITE_PARTNER_TOKEN_URL,
    VITE_ISSUER_PROGRAM_IDS: import.meta.env.VITE_ISSUER_PROGRAM_IDS || "{}",
    VITE_VERIFIER_PROGRAM_IDS: import.meta.env.VITE_VERIFIER_PROGRAM_IDS || "{}",
    VITE_AIRGATE_BRAND: import.meta.env.VITE_AIRGATE_BRAND,
    VITE_AIRGATE_CONTACT_EMAIL: import.meta.env.VITE_AIRGATE_CONTACT_EMAIL,
    VITE_AIRGATE_DEMOS_ENABLED: String(import.meta.env.VITE_AIRGATE_DEMOS_ENABLED ?? "true"),
  };
  return Env.parse(raw) as Env;
}
