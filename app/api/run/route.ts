import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { supabaseServer } from '@/lib/supabase/server';
import { executeAutomation } from '@/lib/engine';

export const maxDuration = 60;

export async function POST(req: Request) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const id = String(body.automation_id ?? '');
  if (!id) return NextResponse.json({ error: 'automation_id is required' }, { status: 400 });

  // ownership check before the engine touches anything
  const { data: owned } = await sb.from('ct_automations')
    .select('id').eq('id', id).eq('user_id', user.id).maybeSingle();
  if (!owned) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    const result = await executeAutomation(id, body.trigger ?? {}, { source: 'manual' });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}
