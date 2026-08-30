export type Plan = 'starter' | 'pro' | 'team';

export const PLANS: Record<Plan, {
  name: string; price: number; blurb: string;
  maxAutomations: number; maxRuns: number; features: string[]; priceEnv?: string;
}> = {
  starter: {
    name: 'Starter', price: 0, blurb: 'Prove it on one workflow.',
    maxAutomations: 2, maxRuns: 100,
    features: ['2 active automations', '100 runs a month', '3 tool connections', 'Hours-saved dashboard'],
  },
  pro: {
    name: 'Pro', price: 29, blurb: 'The full library, running.',
    maxAutomations: Infinity, maxRuns: 5000, priceEnv: 'STRIPE_PRICE_PRO',
    features: ['Unlimited automations', '5,000 runs a month', 'Unlimited connections',
      'Voice matching on every draft', 'Custom approval rules', 'Every new automation, included'],
  },
  team: {
    name: 'Team', price: 79, blurb: 'Shared workflows, one bill.',
    maxAutomations: Infinity, maxRuns: 25000, priceEnv: 'STRIPE_PRICE_TEAM',
    features: ['Everything in Pro', '25,000 runs a month', 'Shared automation library',
      'Roles and audit log', 'Priority support'],
  },
};

export function limitsFor(plan: string) {
  return PLANS[(plan as Plan)] ?? PLANS.starter;
}

export function periodStart(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString().slice(0, 10);
}
