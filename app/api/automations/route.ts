import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { limitsFor } from '@/lib/plans';

export async function POST(req: Request) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const slug = String(body.template_slug ?? '');
  if (!slug) return NextResponse.json({ error: 'template_slug is required' }, { status: 400 });

  const { data: tpl } = await sb.from('ct_templates').select('*').eq('slug', slug).single();
  if (!tpl) return NextResponse.json({ error: 'Unknown automation' }, { status: 404 });

  const { data: profile } = await sb.from('ct_profiles').select('plan').eq('id', user.id).single();
  const limits = limitsFor(profile?.plan ?? 'starter');

  const { count } = await sb.from('ct_automations')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id).eq('enabled', true);

  if ((count ?? 0) >= limits.maxAutomations) {
    return NextResponse.json(
      { error: `The ${limits.name} plan allows ${limits.maxAutomations} active automations. Upgrade to add more.`, code: 'plan_limit' },
      { status: 402 }
    );
  }

  const { data, error } = await sb.from('ct_automations').insert({
    user_id: user.id,
    template_slug: slug,
    name: tpl.name,
    config: tpl.default_config ?? {},
    schedule: tpl.default_schedule,
    approval_mode: 'review_external',
  }).select('id').single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ id: data.id });
}
