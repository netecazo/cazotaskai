import Link from 'next/link';
import { supabaseServer, requireUser } from '@/lib/supabase/server';
import RunsTable, { type RunRow } from '@/components/dash/RunsTable';

export const dynamic = 'force-dynamic';

const SOURCE_LABEL: Record<string, string> = {
  manual: 'Run by hand',
  webhook: 'Webhook',
  schedule: 'Schedule',
  cron: 'Schedule',
};

export default async function RunsPage() {
  const user = await requireUser();
  if (!user) return null;

  const sb = await supabaseServer();

  const [{ data: runs }, { data: automations }, { data: templates }] = await Promise.all([
    sb.from('ct_runs')
      .select('id, automation_id, template_slug, status, trigger, ai_output, actions, minutes_saved, tokens_used, error, is_demo, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(200),
    sb.from('ct_automations').select('id, name').eq('user_id', user.id),
    sb.from('ct_templates').select('slug, name'),
  ]);

  const autoNames = new Map<string, string>(
    (automations ?? []).map((a: { id: string; name: string }) => [a.id, a.name])
  );
  const tplNames = new Map<string, string>(
    (templates ?? []).map((t: { slug: string; name: string }) => [t.slug, t.name])
  );

  const rows: RunRow[] = (runs ?? []).map((r: any) => {
    const source = String(r.trigger?._source ?? 'manual');
    return {
      id: r.id,
      status: r.status,
      automation_id: r.automation_id ?? null,
      automation_name:
        (r.automation_id ? autoNames.get(r.automation_id) : undefined) ??
        tplNames.get(r.template_slug) ??
        r.template_slug,
      template_slug: r.template_slug,
      source: SOURCE_LABEL[source] ?? source,
      minutes_saved: Number(r.minutes_saved ?? 0),
      tokens_used: r.tokens_used ?? null,
      is_demo: Boolean(r.is_demo),
      error: r.error ?? null,
      output: typeof r.ai_output?.text === 'string' ? r.ai_output.text : null,
      actions: Array.isArray(r.actions) ? r.actions : [],
      created_at: r.created_at,
    };
  });

  return (
    <>
      <div className="dash-head">
        <div>
          <span className="eyebrow">Runs</span>
          <h1>Run log</h1>
          <p>
            Every run, successful or not, with what the AI produced and what was actually done
            with it. Select a row to read the detail.
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="glass dash-empty">
          <h3>Nothing has run yet</h3>
          <p>Once an automation fires — by schedule, by webhook, or by hand — it turns up here.</p>
          <Link href="/dashboard/library" className="btn btn-primary">Add your first automation</Link>
        </div>
      ) : (
        <RunsTable runs={rows} />
      )}
    </>
  );
}
