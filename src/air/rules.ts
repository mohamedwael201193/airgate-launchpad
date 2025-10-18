/**
 * Demo rule presets for eligibility verification.
 * Used by Demos page and VerifyModal.
 */

export type RulesJSON = {
  all?: Rule[];
  any?: Rule[];
  rln?: { windowHours: number; maxActions: number };
};

export type Rule =
  | { type: 'credential'; id: string; query?: Record<string, unknown> }
  | { type: 'claim'; schema: string; query?: Record<string, unknown> }
  | { type: 'geo'; in?: string[]; notIn?: string[] }
  | { type: 'onchain'; key: string; op: 'gte' | 'lte' | 'eq'; value: number };

// DeFi Job Passport: requires KYC, work history, and DeFi activity
export const defiJobRule: RulesJSON = {
  all: [
    { type: 'credential', id: 'kyc_basic', query: { status: 'compliant' } },
    { type: 'claim', schema: 'work_history', query: { years: { $gte: 2 } } },
    { type: 'onchain', key: 'defi_activity.trades90d', op: 'gte', value: 10 },
  ],
};

// Fan VIP Challenge: requires fan badge with VIP tier + rate-limit
export const fanVipRule: RulesJSON = {
  all: [
    { type: 'credential', id: 'fan_verified', query: { tier: 'VIP' } },
  ],
  rln: { windowHours: 24, maxActions: 5 },
};

// Trader Tiers: geo-restricted, requires significant trading volume
export const traderTierRule: RulesJSON = {
  all: [
    { type: 'geo', notIn: ['US'] },
    { type: 'onchain', key: 'trades.count90d', op: 'gte', value: 20 },
  ],
};

export const demoRules = {
  defiJob: defiJobRule,
  fanVip: fanVipRule,
  traderTier: traderTierRule,
};
