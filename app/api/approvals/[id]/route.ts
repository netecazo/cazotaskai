import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { periodStart } from '@/lib/plans';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { decision } = await req.json().catch(() => ({ decision: '' }));
  if (!['approved', 'rejected'].includes(decision))
    return NextResponse.json({ error: 'decision must be approved or rejected' }, { status: 400 });

  const { data: approval } = await sb.from('ct_approvals')
    .select('id, run_id, status').eq('id', id).eq('user_id', user.id).single();
  if (!approval) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (approval.status !== 'pending')
    return NextResponse.json({ error: 'Already decided' }, { status: 409 });

  const db = supabaseAdmin();
  await db.from('ct_approvals').update({ status: decision, decided_at: new Date().toISOString() }).eq('id', approval.id);

  if (decision === 'approved') {
    const { data: run } = await db.from('ct_runs')
      .select('template_slug').eq('id', approval.run_id).single();
    const { data: tpl } = await db.from('ct_templates')
      .select('est_minutes_saved').eq('slug', run?.template_slug ?? '').maybeSingle();

    await db.from('ct_runs').update({ status: 'succeeded' }).eq('id', approval.run_id);

    const period = periodStart();
    const { data: usage } = await db.from('ct_usage')
      .select('minutes_saved').eq('user_id', user.id).eq('period_start', period).maybeSingle();
    if (usage) {
      await db.from('ct_usage').update({
        minutes_saved: Number(usage.minutes_saved) + Number(tpl?.est_minutes_saved ?? 0),
      }).eq('user_id', user.id).eq('period_start', period);
    }
  } else {
    await db.from('ct_runs').update({ status: 'rejected' }).eq('id', approval.run_id);
  }

  return NextResponse.json({ ok: true, status: decision });
}
