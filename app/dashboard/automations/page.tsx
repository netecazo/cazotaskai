import Link from 'next/link';
import { supabaseServer, requireUser } from '@/lib/supabase/server';
import AutomationsList, { type AutomationRow } from '@/components/dash/AutomationsList';

export const dynamic = 'force-dynamic';

export default async function AutomationsPage() {
  const user = await requireUser();
  if (!user) return null;

  const sb = supabaseServer();

  const [{ data: automations }, { data: templates }] = await Promise.all([
    sb.from('ct_automations')
      .select('id, name, template_slug, enabled, schedule, last_run_at, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    sb.from('ct_templates').select('slug, name, trigger_type'),
  ]);

  const meta = new Map<string, { name: string; trigger_type: string | null }>(
    (templates ?? []).map((t: { slug: string; name: string; trigger_type: string | null }) => [
      t.slug,
      { name: t.name, trigger_type: t.trigger_type },
    ])
  );

  const rows: AutomationRow[] = (automations ?? []).map((a: any) => ({
    id: a.id,
    name: a.name,
    template_slug: a.template_slug,
    template_name: meta.get(a.template_slug)?.name ?? a.template_slug,
    enabled: Boolean(a.enabled),
    schedule: a.schedule ?? null,
    trigger_type: meta.get(a.template_slug)?.trigger_type ?? null,
    last_run_at: a.last_run_at ?? null,
  }));

  return (
    <>
      <div className="dash-head">
        <div>
          <span className="eyebrow">Automations</span>
          <h1>What is running for you</h1>
          <p>Switch one off to pause it without losing its settings or its history.</p>
        </div>
        <Link href="/dashboard/library" className="btn btn-primary">Add an automation</Link>
      </div>

      <AutomationsList automations={rows} />
    </>
  );
}
