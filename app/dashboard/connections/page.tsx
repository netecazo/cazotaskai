import { supabaseServer, requireUser } from '@/lib/supabase/server';
import { engineStatus } from '@/lib/engine';
import { ago } from '@/lib/format';
import StatusPill from '@/components/dash/StatusPill';

export const dynamic = 'force-dynamic';

type Group = 'oauth' | 'pending' | 'key';

const PROVIDERS: { id: string; name: string; group: Group; blurb: string }[] = [
  { id: 'slack',      name: 'Slack',            group: 'oauth',
    blurb: 'Post digests, summaries and alerts into a channel of your choosing.' },
  { id: 'gmail',      name: 'Gmail',            group: 'pending',
    blurb: 'Triage the inbox, draft replies and label threads.' },
  { id: 'outlook',    name: 'Outlook',          group: 'pending',
    blurb: 'The same inbox work, for Microsoft 365 accounts.' },
  { id: 'gcal',       name: 'Google Calendar',  group: 'pending',
    blurb: 'Prepare briefs before meetings and tidy the week ahead.' },
  { id: 'zoom',       name: 'Zoom',             group: 'pending',
    blurb: 'Turn recordings and transcripts into notes and follow-ups.' },
  { id: 'teams',      name: 'Microsoft Teams',  group: 'pending',
    blurb: 'Post updates and summaries into Teams channels.' },
  { id: 'notion',     name: 'Notion',           group: 'key',
    blurb: 'File research, notes and reports into your workspace.' },
  { id: 'sheets',     name: 'Google Sheets',    group: 'key',
    blurb: 'Append rows and keep trackers current without opening them.' },
  { id: 'hubspot',    name: 'HubSpot',          group: 'key',
    blurb: 'Log activity and keep deal records tidy.' },
  { id: 'stripe',     name: 'Stripe',           group: 'key',
    blurb: 'Summarise revenue movements and flag failed payments.' },
  { id: 'quickbooks', name: 'QuickBooks',       group: 'key',
    blurb: 'Chase invoices and prepare month-end summaries.' },
];

const ERROR_COPY: Record<string, string> = {
  slack_state: 'The Slack sign-in could not be verified, so nothing was connected. Please start again.',
};

export default async function ConnectionsPage({
  searchParams,
}: {
  searchParams: { connected?: string; error?: string };
}) {
  const user = await requireUser();
  if (!user) return null;

  const sb = supabaseServer();
  const { data: connections } = await sb
    .from('ct_connections')
    .select('provider, status, external_account, created_at')
    .eq('user_id', user.id);

  const byProvider = new Map<string, any>(
    (connections ?? []).map((c: any) => [c.provider, c])
  );

  const engine = engineStatus();
  const connectedParam = searchParams?.connected;
  const errorParam = searchParams?.error;

  return (
    <>
      <div className="dash-head">
        <div>
          <span className="eyebrow">Connections</span>
          <h1>Your tools</h1>
          <p>
            An automation can only touch a tool you have connected. Where a connection is not
            available yet, it says so plainly below rather than pretending otherwise.
          </p>
        </div>
      </div>

      {connectedParam ? (
        <div className="dash-banner ok" role="status">
          <span><strong>Connected</strong> — {connectedParam} is now linked to your account.</span>
        </div>
      ) : null}

      {errorParam ? (
        <div className="dash-banner bad" role="alert">
          <span>
            <strong>Connection failed</strong> — {ERROR_COPY[errorParam] ?? errorParam}
          </span>
        </div>
      ) : null}

      {engine.slack === 'not-configured' ? (
        <div className="dash-banner warn" role="status">
          <span>
            <strong>Slack OAuth is not configured on this deployment</strong> — the Connect
            button will not complete until the Slack app credentials are set.
          </span>
        </div>
      ) : null}

      <div className="dash-cards">
        {PROVIDERS.map((p) => {
          const conn = byProvider.get(p.id);
          const isConnected = conn?.status === 'connected';

          return (
            <article key={p.id} className="glass dash-card">
              <div className="dash-meta">
                <h3 style={{ marginRight: 'auto' }}>{p.name}</h3>
                {isConnected ? (
                  <StatusPill label="Connected" tone="ok" />
                ) : p.group === 'oauth' ? (
                  <StatusPill label="Not connected" tone="" />
                ) : p.group === 'pending' ? (
                  <StatusPill label="Pending verification" tone="warn" />
                ) : (
                  <StatusPill label="Needs API key" tone="info" />
                )}
              </div>

              <p>{p.blurb}</p>

              {p.group === 'pending' ? (
                <p className="dash-note">
                  Built and tested, but the OAuth review with {p.name} has not completed, so we
                  cannot connect real accounts yet.
                </p>
              ) : null}

              {p.group === 'key' ? (
                <p className="dash-note">
                  This connection runs on an API key you supply. Key entry is not open on this
                  deployment yet, so the button stays disabled.
                </p>
              ) : null}

              {isConnected && conn?.external_account ? (
                <p className="dash-note">
                  Connected to <strong style={{ color: 'var(--ink)' }}>{conn.external_account}</strong>
                  {conn.created_at ? ` — linked ${ago(conn.created_at)}` : null}
                </p>
              ) : null}

              <div className="foot">
                <span className="dash-meta">{p.id}</span>
                {p.group === 'oauth' ? (
                  <a href="/api/connections/slack/start" className="dash-mini primary">
                    {isConnected ? 'Reconnect' : 'Connect'}
                  </a>
                ) : (
                  <button
                    type="button"
                    className="dash-mini"
                    disabled
                    aria-label={
                      p.group === 'pending'
                        ? `${p.name} is awaiting OAuth verification and cannot be connected yet`
                        : `${p.name} needs an API key, which cannot be added yet`
                    }
                  >
                    {p.group === 'pending' ? 'Awaiting verification' : 'Needs API key'}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
