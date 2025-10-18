import { getEnv } from "./env";
const env = getEnv();
export const ISSUER = env.VITE_ISSUER_PROGRAM_IDS;
export const VERIFIER = env.VITE_VERIFIER_PROGRAM_IDS;
export const getIssuerId = (k: string) => ISSUER[k] || "";
export const getVerifierId = (k: string) => VERIFIER[k] || "";
