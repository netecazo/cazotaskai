import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { stripe, stripeConfigured } from '@/lib/stripe';

export async function POST(req: Request) {
  if (!stripeConfigured())
    return NextResponse.json({ error: 'Billing is not configured yet.' }, { status: 503 });

  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { data: profile } = await supabaseAdmin()
    .from('ct_profiles').select('stripe_customer_id').eq('id', user.id).single();
  if (!profile?.stripe_customer_id)
    return NextResponse.json({ error: 'No billing account yet.' }, { status: 400 });

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const session = await stripe().billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${origin}/dashboard/billing`,
  });
  return NextResponse.json({ url: session.url });
}
