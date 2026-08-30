import { supabaseServer, requireUser } from '@/lib/supabase/server';
import { PLANS, limitsFor, periodStart, type Plan } from '@/lib/plans';
import { hours } from '@/lib/format';
import { stripeConfigured, isTestMode } from '@/lib/stripe';
import { UpgradeButton, PortalButton } from '@/components/dash/BillingActions';

export const dynamic = 'force-dynamic';

const ORDER: Plan[] = ['starter', 'pro', 'team'];

function cap(max: number) {
  return Number.isFinite(max) ? max.toLocaleString('en-GB') : 'Unlimited';
}

function pct(used: number, max: number) {
  if (!Number.isFinite(max) || max <= 0) return 0;
  return Math.min(100, Math.round((used / max) * 100));
}

function formatDate(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { checkout?: string };
}) {
  const user = await requireUser();
  if (!user) return null;

  const sb = supabaseServer();
  const period = periodStart();

  const [{ data: profile }, { data: usage }, { count: activeCount }] = await Promise.all([
    sb.from('ct_profiles')
      .select('plan, plan_status, stripe_customer_id, current_period_end')
      .eq('id', user.id)
      .maybeSingle(),
    sb.from('ct_usage').select('runs_used, minutes_saved')
      .eq('user_id', user.id).eq('period_start', period).maybeSingle(),
    sb.from('ct_automations').select('id', { count: 'exact', head: true })
      .eq('user_id', user.id).eq('enabled', true),
  ]);

  const currentPlan = (profile?.plan ?? 'starter') as Plan;
  const limits = limitsFor(currentPlan);
  const runsUsed = Number(usage?.runs_used ?? 0);
  const minutesSaved = Number(usage?.minutes_saved ?? 0);
  const active = activeCount ?? 0;

  const configured = stripeConfigured();
  const testMode = configured && isTestMode();
  const hasCustomer = Boolean(profile?.stripe_customer_id);
  const renewal = formatDate(profile?.current_period_end);
  const checkout = searchParams?.checkout;

  return (
    <>
      <div className="dash-head">
        <div>
          <span className="eyebrow">Billing</span>
          <h1>Plan and usage</h1>
          <p>You are on the {limits.name} plan. Change it whenever you like; nothing is locked in.</p>
        </div>
        {testMode ? <span className="dash-pill info">Test mode</span> : null}
      </div>

      {checkout === 'success' ? (
        <div className="dash-banner ok" role="status">
          <span>
            <strong>Checkout complete</strong> — thank you. Your plan updates as soon as Stripe
            confirms the subscription, which is usually within a few seconds.
          </span>
        </div>
      ) : null}

      {checkout === 'cancelled' ? (
        <div className="dash-banner" role="status">
          <span><strong>Checkout cancelled</strong> — nothing was charged and your plan is unchanged.</span>
        </div>
      ) : null}

      {!configured ? (
        <div className="dash-banner warn" role="status">
          <span>
            <strong>Billing is not configured on this deployment yet</strong> — there is no Stripe
            key set, so checkout and the billing portal are switched off. You can keep using the
            Starter plan in the meantime.
          </span>
        </div>
      ) : null}

      {testMode ? (
        <div className="dash-banner info" role="status">
          <span>
            <strong>Stripe is in test mode</strong> — checkout will accept test cards only and
            no real money moves.
          </span>
        </div>
      ) : null}

      <div className="dash-tiles">
        <div className="glass dash-tile">
          <span className="k">Current plan</span>
          <span className="v grad-text">{limits.name}</span>
          <span className="s">
            {profile?.plan_status ? `Status: ${profile.plan_status}` : 'No subscription on file'}
            {renewal ? ` · Renews ${renewal}` : ''}
          </span>
        </div>

        <div className="glass dash-tile">
          <span className="k">Runs this month</span>
          <span className="v">{runsUsed.toLocaleString('en-GB')}<span className="s"> / {cap(limits.maxRuns)}</span></span>
          <div
            className={`dash-bar ${pct(runsUsed, limits.maxRuns) >= 80 ? 'hot' : ''}`.trim()}
            role="progressbar"
            aria-valuenow={runsUsed}
            aria-valuemin={0}
            aria-valuemax={Number.isFinite(limits.maxRuns) ? limits.maxRuns : runsUsed}
            aria-label="Runs used this month against your plan allowance"
          >
            <i style={{ width: `${pct(runsUsed, limits.maxRuns)}%` }} />
          </div>
          <span className="s">Resets at the start of next month</span>
        </div>

        <div className="glass dash-tile">
          <span className="k">Active automations</span>
          <span className="v">{active}<span className="s"> / {cap(limits.maxAutomations)}</span></span>
          <span className="s">{hours(minutesSaved)} saved so far this month</span>
        </div>
      </div>

      <div className="dash-section">
        <div className="dash-section-head">
          <h2>Plans</h2>
          {hasCustomer ? <PortalButton disabled={!configured} /> : null}
        </div>

        {!hasCustomer && configured ? (
          <p className="small" style={{ marginBottom: 14 }}>
            Once you subscribe, a &ldquo;Manage billing&rdquo; button appears here for invoices,
            card changes and cancellation.
          </p>
        ) : null}

        <div className="dash-cards">
          {ORDER.map((key) => {
            const plan = PLANS[key];
            const isCurrent = key === currentPlan;

            return (
              <article
                key={key}
                className={`glass dash-card${isCurrent ? ' glass-strong' : ''}`}
              >
                <div className="dash-meta">
                  <h3 style={{ marginRight: 'auto' }}>{plan.name}</h3>
                  {isCurrent ? <span className="dash-pill violet">Current plan</span> : null}
                </div>

                <p>{plan.blurb}</p>

                <p>
                  <strong style={{ fontSize: '2rem', letterSpacing: '-.045em' }}>
                    {plan.price === 0 ? 'Free' : `£${plan.price}`}
                  </strong>
                  {plan.price === 0 ? null : <span className="small"> a month</span>}
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {plan.features.map((f) => (
                    <li key={f} className="small" style={{ color: 'var(--muted)' }}>{f}</li>
                  ))}
                </ul>

                <div className="foot" style={{ display: 'block' }}>
                  {isCurrent ? (
                    <button type="button" className="btn btn-ghost" disabled style={{ width: '100%' }}>
                      Your current plan
                    </button>
                  ) : key === 'starter' ? (
                    <p className="dash-note">
                      To move back down to Starter, cancel your subscription in the billing portal.
                    </p>
                  ) : (
                    <UpgradeButton
                      plan={key}
                      label={`Upgrade to ${plan.name}`}
                      disabled={!configured}
                      variant={key === 'pro' ? 'primary' : 'ghost'}
                    />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
