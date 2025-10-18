/**
 * Issuer and Verifier Program ID helpers.
 * Parses JSON env variables and provides getters.
 */

import { safeGetEnv } from './env';

const env = safeGetEnv();

export const ISSUER = env.issuerProgramIds || {};
export const VERIFIER = env.verifierProgramIds || {};

export function getIssuerId(key: string): string {
  const id = ISSUER[key];
  if (!id) {
    console.warn(`Issuer program ID not found for key: ${key}`);
  }
  return id || '';
}

export function getVerifierId(key: string): string {
  const id = VERIFIER[key];
  if (!id) {
    console.warn(`Verifier program ID not found for key: ${key}`);
  }
  return id || '';
}
