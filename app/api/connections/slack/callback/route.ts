import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { slackExchange } from '@/lib/slack';
import { encryptSecret } from '@/lib/crypto';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? url.origin;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user || !code || state !== user.id)
    return NextResponse.redirect(`${origin}/dashboard/connections?error=slack_state`);

  try {
    const { accessToken, team, scopes } = await slackExchange(code, `${origin}/api/connections/slack/callback`);
    const db = supabaseAdmin();

    const { data: conn } = await db.from('ct_connections').upsert({
      user_id: user.id, provider: 'slack', status: 'connected',
      external_account: team ?? null, scopes,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,provider' }).select('id').single();

    await db.from('ct_connection_secrets').upsert({
      connection_id: conn!.id, access_token: encryptSecret(accessToken),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.redirect(`${origin}/dashboard/connections?connected=slack`);
  } catch (e: any) {
    return NextResponse.redirect(`${origin}/dashboard/connections?error=${encodeURIComponent(e.message)}`);
  }
}
