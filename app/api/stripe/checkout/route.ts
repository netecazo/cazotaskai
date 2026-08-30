import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { stripe, stripeConfigured, priceIdFor } from '@/lib/stripe';

export async function POST(req: Request) {
  if (!stripeConfigured())
    return NextResponse.json({ error: 'Billing is not configured on this deployment yet.', code: 'no_stripe' }, { status: 503 });

  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { plan } = await req.json().catch(() => ({ plan: 'pro' }));
  if (!['pro', 'team'].includes(plan))
    return NextResponse.json({ error: 'Unknown plan' }, { status: 400 });

  const price = priceIdFor(plan);
  if (!price)
    return NextResponse.json({ error: `No Stripe price configured for ${plan}.`, code: 'no_price' }, { status: 503 });

  const db = supabaseAdmin();
  const { data: profile } = await db.from('ct_profiles')
    .select('stripe_customer_id, email').eq('id', user.id).single();

  const s = stripe();
  let customerId = profile?.stripe_customer_id ?? null;
  if (!customerId) {
    const customer = await s.customers.create({
      email: profile?.email ?? user.email ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await db.from('ct_profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const session = await s.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price, quantity: 1 }],
    allow_promotion_codes: true,
    subscription_data: { trial_period_days: 14, metadata: { supabase_user_id: user.id, plan } },
    metadata: { supabase_user_id: user.id, plan },
    success_url: `${origin}/dashboard/billing?checkout=success`,
    cancel_url: `${origin}/dashboard/billing?checkout=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
