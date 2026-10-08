import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { slackAuthUrl, slackConfigured } from '@/lib/slack';

export async function GET(req: Request) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  if (!slackConfigured())
    return NextResponse.redirect(`${origin}/dashboard/connections?error=slack_not_configured`);

  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/login`);

  const url = slackAuthUrl(user.id, `${origin}/api/connections/slack/callback`);
  return NextResponse.redirect(url);
}
