import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { executeAutomation } from '@/lib/engine';

export const maxDuration = 60;

/** Inbound trigger. The token in the path is the automation's shared secret. */
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const db = supabaseAdmin();

  const { data: automation } = await db.from('ct_automations')
    .select('id, enabled').eq('webhook_token', token).maybeSingle();

  if (!automation) return NextResponse.json({ error: 'Unknown hook' }, { status: 404 });
  if (!automation.enabled) return NextResponse.json({ error: 'Automation is paused' }, { status: 409 });

  const payload = await req.json().catch(() => ({}));

  try {
    const result = await executeAutomation(automation.id, payload, { source: 'webhook' });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: 'POST a JSON body here to trigger this automation.' });
}
