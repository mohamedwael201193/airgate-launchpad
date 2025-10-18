import { getEnv } from "./env";
// Adjust the imports/methods to the actual SDK version you install:
import { AirService } from "@mocanetwork/airkit";

let svc: AirService | null = null;

async function fetchPartnerToken(): Promise<string> {
  const { VITE_PARTNER_TOKEN_URL } = getEnv();
  const res = await fetch(VITE_PARTNER_TOKEN_URL, { method: "POST" });
  if (!res.ok) throw new Error("Partner token fetch failed");
  return res.text();
}

export function getAirService(): AirService {
  if (svc) return svc;
  const env = getEnv();
  svc = new AirService({
    partnerId: env.VITE_AIR_PARTNER_ID,
  });
  return svc;
}
