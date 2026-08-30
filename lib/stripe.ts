import Stripe from 'stripe';

export function stripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  return new Stripe(key, { apiVersion: '2024-06-20' });
}

export function priceIdFor(plan: 'pro' | 'team') {
  return plan === 'pro' ? process.env.STRIPE_PRICE_PRO : process.env.STRIPE_PRICE_TEAM;
}

export function isTestMode() {
  return (process.env.STRIPE_SECRET_KEY ?? '').startsWith('sk_test_');
}
