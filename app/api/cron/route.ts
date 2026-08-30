import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { executeAutomation } from '@/lib/engine';

export const maxDuration = 300;

/** Scheduler. Vercel calls this once a day at 06:00 UTC (see vercel.json). */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }
  }

  const db = supabaseAdmin();
  const now = new Date();

  const { data: due } = await db.from('ct_automations')
    .select('id, schedule, last_run_at')
    .eq('enabled', true)
    .not('schedule', 'is', null)
    .limit(200);

  const ran: string[] = [];
  for (const a of due ?? []) {
    if (!isDue(a.schedule as string, a.last_run_at as string | null, now)) continue;
    try {
      await executeAutomation(a.id as string, { fired_at: now.toISOString() }, { source: 'schedule' });
      await db.from('ct_automations').update({ last_run_at: now.toISOString() }).eq('id', a.id);
      ran.push(a.id as string);
    } catch { /* the engine already recorded the failure on the run */ }
  }

  return NextResponse.json({ checked: due?.length ?? 0, ran: ran.length });
}

/** Minimal 5-field cron matcher: minute hour day-of-month month day-of-week, UTC. */
function isDue(expr: string, lastRun: string | null, now: Date) {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return false;

  const fields = [now.getUTCMinutes(), now.getUTCHours(), now.getUTCDate(), now.getUTCMonth() + 1, now.getUTCDay()];
  const matches = parts.every((p, i) => matchField(p, fields[i]));
  if (!matches) return false;

  // never twice inside the same hour-slot
  if (lastRun && now.getTime() - new Date(lastRun).getTime() < 50 * 60 * 1000) return false;
  return true;
}

function matchField(field: string, value: number): boolean {
  if (field === '*') return true;
  return field.split(',').some((part) => {
    if (part.includes('/')) {
      const [range, stepRaw] = part.split('/');
      const step = Number(stepRaw);
      if (!step) return false;
      if (range === '*') return value % step === 0;
      const [lo, hi] = range.split('-').map(Number);
      return value >= lo && value <= (hi ?? lo) && (value - lo) % step === 0;
    }
    if (part.includes('-')) {
      const [lo, hi] = part.split('-').map(Number);
      return value >= lo && value <= hi;
    }
    return Number(part) === value;
  });
}
