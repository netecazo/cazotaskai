import Link from 'next/link';
import { supabaseServer, requireUser } from '@/lib/supabase/server';
import { limitsFor, periodStart } from '@/lib/plans';
import { hours, ago } from '@/lib/format';
import { engineStatus } from '@/lib/engine';
import StatusPill from '@/components/dash/StatusPill';

export const dynamic = 'force-dynamic';

function pct(used: number, max: number) {
  if (!Number.isFinite(max) || max <= 0) return 0;
  return Math.min(100, Math.round((used / max) * 100));
}

function cap(max: number) {
  return Number.isFinite(max) ? max.toLocaleString('en-GB') : 'Unlimited';
}

export default async function OverviewPage() {
  const user = await requireUser();
  if (!user) return null;

  const sb = await supabaseServer();
  const period = periodStart();

  const [
    { data: profile },
    { data: usage },
    { count: activeCount },
    { count: totalAutomations },
    { count: pendingApprovals },
    { data: runs },
    { data: templates },
  ] = await Promise.all([
    sb.from('ct_profiles').select('plan').eq('id', user.id).maybeSingle(),
    sb.from('ct_usage').select('runs_used, minutes_saved')
      .eq('user_id', user.id).eq('period_start', period).maybeSingle(),
    sb.from('ct_automations').select('id', { count: 'exact', head: true })
      .eq('user_id', user.id).eq('enabled', true),
    sb.from('ct_automations').select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
    sb.from('ct_approvals').select('id', { count: 'exact', head: true })
      .eq('user_id', user.id).eq('status', 'pending'),
    sb.from('ct_runs')
      .select('id, template_slug, status, is_demo, created_at, minutes_saved')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(8),
    sb.from('ct_templates').select('slug, name'),
  ]);

  const limits = limitsFor(profile?.plan ?? 'starter');
  const runsUsed = Number(usage?.runs_used ?? 0);
  const minutesSaved = Number(usage?.minutes_saved ?? 0);
  const active = activeCount ?? 0;
  const pending = pendingApprovals ?? 0;

  const names = new Map<string, string>(
    (templates ?? []).map((t: { slug: string; name: string }) => [t.slug, t.name])
  );

  const recent = runs ?? [];
  const engine = engineStatus();

  return (
    <>
      <div className="dash-head">
        <div>
          <span className="eyebrow">Overview</span>
          <h1>Your week, minus the admin</h1>
          <p>Everything running for you this month, and what is waiting on a decision.</p>
        </div>
        <Link href="/dashboard/library" className="btn btn-primary">Browse the library</Link>
      </div>

      {engine.ai === 'sample-mode' ? (
        <div className="dash-banner warn" role="status">
          <span>
            <strong>AI key not configured</strong> — runs return sample output and are marked
            accordingly. Nothing you see from a run in this state came from a real model.
          </span>
        </div>
      ) : null}

      <div className="dash-tiles">
        <div className="glass dash-tile">
          <span className="k">Hours saved this month</span>
          <span className="v grad-text">{hours(minutesSaved)}</span>
          <span className="s">Banked from {runsUsed.toLocaleString('en-GB')} run{runsUsed === 1 ? '' : 's'}</span>
        </div>

        <div className="glass dash-tile">
          <span className="k">Runs used</span>
          <span className="v">
            {runsUsed.toLocaleString('en-GB')}
            <span className="s"> / {cap(limits.maxRuns)}</span>
          </span>
          <div
            className={`dash-bar ${pct(runsUsed, limits.maxRuns) >= 80 ? 'hot' : ''}`.trim()}
            role="progressbar"
            aria-valuenow={runsUsed}
            aria-valuemin={0}
            aria-valuemax={Number.isFinite(limits.maxRuns) ? limits.maxRuns : runsUsed}
            aria-label={`Runs used on the ${limits.name} plan`}
          >
            <i style={{ width: `${pct(runsUsed, limits.maxRuns)}%` }} />
          </div>
          <span className="s">{limits.name} plan allowance</span>
        </div>

        <div className="glass dash-tile">
          <span className="k">Active automations</span>
          <span className="v">
            {active}
            <span className="s"> / {cap(limits.maxAutomations)}</span>
          </span>
          <div
            className="dash-bar"
            role="progressbar"
            aria-valuenow={active}
            aria-valuemin={0}
            aria-valuemax={Number.isFinite(limits.maxAutomations) ? limits.maxAutomations : Math.max(active, 1)}
            aria-label="Active automations against your plan limit"
          >
            <i style={{ width: `${pct(active, limits.maxAutomations)}%` }} />
          </div>
          <span className="s">Switched on right now</span>
        </div>

        <div className="glass dash-tile">
          <span className="k">Pending approvals</span>
          <span className="v">{pending}</span>
          <span className="s">
            {pending === 0 ? 'Nothing waiting on you' : (
              <Link href="/dashboard/approvals" className="grad-text">Review the queue</Link>
            )}
          </span>
        </div>
      </div>

      <div className="dash-section">
        <div className="dash-section-head">
          <h2>Recent runs</h2>
          <Link href="/dashboard/runs" className="small">See the full run log</Link>
        </div>

        {(totalAutomations ?? 0) === 0 ? (
          <div className="glass dash-empty">
            <h3>No automations yet</h3>
            <p>
              Pick one from the library, switch it on, and it starts taking work off your plate.
              Most people begin with inbox triage.
            </p>
            <Link href="/dashboard/library" className="btn btn-primary">Open the library</Link>
          </div>
        ) : recent.length === 0 ? (
          <div className="glass dash-empty">
            <h3>Nothing has run yet</h3>
            <p>Your automations are set up but have not fired. Run one by hand to see the output.</p>
            <Link href="/dashboard/automations" className="btn btn-primary">Go to automations</Link>
          </div>
        ) : (
          <div className="glass dash-panel tight">
            <div className="dash-scroll">
              <table className="dash-table">
                <caption className="dash-sr">Your eight most recent runs</caption>
                <thead>
                  <tr>
                    <th scope="col">Status</th>
                    <th scope="col">Automation</th>
                    <th scope="col">Minutes saved</th>
                    <th scope="col">When</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((run: any) => (
                    <tr key={run.id}>
                      <td>
                        <StatusPill status={run.status} />
                        {run.is_demo ? <span className="dash-tag" style={{ marginLeft: 8 }}>Sample output</span> : null}
                      </td>
                      <td className="ink">{names.get(run.template_slug) ?? run.template_slug}</td>
                      <td>{Number(run.minutes_saved ?? 0)}</td>
                      <td>{ago(run.created_at)}</td>
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
