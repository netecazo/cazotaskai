import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseServer, requireUser } from '@/lib/supabase/server';
import { ago } from '@/lib/format';
import StatusPill from '@/components/dash/StatusPill';
import AutomationDetail from '@/components/dash/AutomationDetail';

export const dynamic = 'force-dynamic';

export default async function AutomationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireUser();
  if (!user) return null;

  const sb = supabaseServer();

  const { data: automation } = await sb
    .from('ct_automations')
    .select('id, name, template_slug, enabled, config, approval_mode, schedule, webhook_token, last_run_at, created_at')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!automation) notFound();

  const [{ data: template }, { data: runs }] = await Promise.all([
    sb.from('ct_templates')
      .select('slug, name, description, trigger_type, default_config, est_minutes_saved')
      .eq('slug', automation.template_slug)
      .maybeSingle(),
    sb.from('ct_runs')
      .select('id, status, is_demo, minutes_saved, tokens_used, error, created_at')
      .eq('user_id', user.id)
      .eq('automation_id', automation.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const merged: Record<string, unknown> = {
    ...((template?.default_config ?? {}) as Record<string, unknown>),
    ...((automation.config ?? {}) as Record<string, unknown>),
  };

  const history = runs ?? [];

  return (
    <>
      <div className="dash-head">
        <div>
          <span className="eyebrow">Automation</span>
          <h1>{automation.name}</h1>
          <p>
            {template?.description ?? 'Adjust how this automation runs and what it needs from you.'}
          </p>
          <p className="dash-meta" style={{ marginTop: 10 }}>
            <span className="dash-tag">{template?.name ?? automation.template_slug}</span>
            <StatusPill
              label={automation.enabled ? 'Enabled' : 'Paused'}
              tone={automation.enabled ? 'ok' : ''}
            />
            <span>Last run {ago(automation.last_run_at)}</span>
          </p>
        </div>
        <Link href="/dashboard/automations" className="btn btn-ghost">Back to automations</Link>
      </div>

      <AutomationDetail
        id={automation.id}
        name={automation.name}
        schedule={automation.schedule ?? null}
        approvalMode={automation.approval_mode ?? 'review_external'}
        config={merged}
        triggerType={template?.trigger_type ?? null}
        webhookToken={automation.webhook_token ?? null}
        siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? ''}
      />

      <div className="dash-section">
        <div className="dash-section-head">
          <h2>Last 20 runs</h2>
          <Link href="/dashboard/runs" className="small">Full run log</Link>
        </div>

        {history.length === 0 ? (
          <div className="glass dash-empty">
            <h3>This automation has not run yet</h3>
            <p>Use &ldquo;Run now&rdquo; on the automations page to try it once and see the output.</p>
            <Link href="/dashboard/automations" className="btn btn-primary">Go and run it</Link>
          </div>
        ) : (
          <div className="glass dash-panel tight">
            <div className="dash-scroll">
              <table className="dash-table">
                <caption className="dash-sr">The last twenty runs of this automation</caption>
                <thead>
                  <tr>
                    <th scope="col">Status</th>
                    <th scope="col">Minutes saved</th>
                    <th scope="col">Tokens</th>
                    <th scope="col">When</th>
                    <th scope="col">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((run: any) => (
                    <tr key={run.id}>
                      <td>
                        <StatusPill status={run.status} />
                        {run.is_demo ? <span className="dash-tag" style={{ marginLeft: 8 }}>Sample output</span> : null}
                      </td>
                      <td>{Number(run.minutes_saved ?? 0)}</td>
                      <td>{run.tokens_used ?? '—'}</td>
                      <td>{ago(run.created_at)}</td>
                      <td>{run.error ? <span className="dash-error">{run.error}</span> : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
