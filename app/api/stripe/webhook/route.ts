import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { stripe, stripeConfigured } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!stripeConfigured()) return NextResponse.json({ received: true, skipped: 'no stripe' });

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get('stripe-signature');
  const raw = await req.text();

  let event: any;
  try {
    event = secret && signature
      ? stripe().webhooks.constructEvent(raw, signature, secret)
      : JSON.parse(raw);
  } catch (e: any) {
    return NextResponse.json({ error: `Signature check failed: ${e.message}` }, { status: 400 });
  }

  const db = supabaseAdmin();

  async function syncFromSubscription(sub: any, planHint?: string) {
    const userId = sub.metadata?.supabase_user_id;
    const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id;

    const match = userId
      ? { id: userId }
      : { stripe_customer_id: customerId };

    const status = sub.status === 'trialing' ? 'trialing'
      : sub.status === 'active' ? 'active'
      : sub.status === 'past_due' ? 'past_due' : 'canceled';

    const plan = planHint ?? sub.metadata?.plan ?? 'pro';

    await db.from('ct_profiles').update({
      plan: ['active', 'trialing'].includes(status) ? plan : 'starter',
      plan_status: status,
      stripe_subscription_id: sub.id,
      stripe_customer_id: customerId,
      current_period_end: sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString() : null,
    }).match(match);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const s = event.data.object;
      if (s.subscription) {
        const sub = await stripe().subscriptions.retrieve(s.subscription as string);
        await syncFromSubscription({ ...sub, metadata: { ...sub.metadata, ...s.metadata } }, s.metadata?.plan);
      }
      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await syncFromSubscription(event.data.object);
      break;
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      await db.from('ct_profiles').update({ plan: 'starter', plan_status: 'canceled' })
        .eq('stripe_subscription_id', sub.id);
      break;
    }
  }

  await db.from('ct_events').insert({ kind: `stripe.${event.type}`, data: { id: event.id } });
  return NextResponse.json({ received: true });
}
