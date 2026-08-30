'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ago } from '@/lib/format';
import StatusPill from '@/components/dash/StatusPill';

export type AutomationRow = {
  id: string;
  name: string;
  template_slug: string;
  template_name: string;
  enabled: boolean;
  schedule: string | null;
  trigger_type: string | null;
  last_run_at: string | null;
};

type RunResult = {
  status: string;
  message: string;
  output?: string;
  demo?: boolean;
};

export default function AutomationsList({ automations }: { automations: AutomationRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(automations);
  const [busy, setBusy] = useState<Record<string, string | null>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [results, setResults] = useState<Record<string, RunResult | null>>({});
  const [confirming, setConfirming] = useState<string | null>(null);

  function setBusyFor(id: string, what: string | null) {
    setBusy((prev) => ({ ...prev, [id]: what }));
  }
  function setErrorFor(id: string, message: string | null) {
    setErrors((prev) => ({ ...prev, [id]: message }));
  }

  async function toggle(row: AutomationRow, enabled: boolean) {
    setBusyFor(row.id, 'toggle');
    setErrorFor(row.id, null);
    const previous = row.enabled;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, enabled } : r)));
    try {
      const res = await fetch(`/api/automations/${row.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error ?? 'Could not save that change.');
      router.refresh();
    } catch (e) {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, enabled: previous } : r)));
      setErrorFor(row.id, e instanceof Error ? e.message : 'Could not save that change.');
    } finally {
      setBusyFor(row.id, null);
    }
  }

  async function runNow(row: AutomationRow) {
    setBusyFor(row.id, 'run');
    setErrorFor(row.id, null);
    setResults((prev) => ({ ...prev, [row.id]: null }));
    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ automation_id: row.id }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error ?? 'The run could not be started.');
      setResults((prev) => ({
        ...prev,
        [row.id]: {
          status: String(body.status ?? 'unknown'),
          message: String(body.message ?? ''),
          output: typeof body.output === 'string' ? body.output : undefined,
          demo: Boolean(body.demo),
        },
      }));
      router.refresh();
    } catch (e) {
      setErrorFor(row.id, e instanceof Error ? e.message : 'The run could not be started.');
    } finally {
      setBusyFor(row.id, null);
    }
  }

  async function remove(row: AutomationRow) {
    setBusyFor(row.id, 'delete');
    setErrorFor(row.id, null);
    try {
      const res = await fetch(`/api/automations/${row.id}`, { method: 'DELETE' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error ?? 'Could not delete that automation.');
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      setConfirming(null);
      router.refresh();
    } catch (e) {
      setErrorFor(row.id, e instanceof Error ? e.message : 'Could not delete that automation.');
      setBusyFor(row.id, null);
    }
  }

  if (rows.length === 0) {
    return (
      <div className="glass dash-empty">
        <h3>No automations yet</h3>
        <p>
          The library has 44 ready-to-run automations. Add one, and it turns up here with a
          schedule and an approval rule you can adjust.
        </p>
        <Link href="/dashboard/library" className="btn btn-primary">Open the library</Link>
      </div>
    );
  }

  return (
    <div className="dash-list">
      {rows.map((row) => {
        const running = busy[row.id] === 'run';
        const result = results[row.id];
        const error = errors[row.id];

        return (
          <article key={row.id} className="glass dash-row">
            <div className="dash-row-top">
              <div className="dash-row-title">
                <strong>{row.name}</strong>
                <span className="dash-meta">
                  <span className="dash-tag">{row.template_name}</span>
                  <span className="dash-tag">
                    {row.trigger_type === 'webhook'
                      ? 'Webhook'
                      : row.schedule
                        ? `Schedule ${row.schedule}`
                        : 'Manual only'}
                  </span>
                  <span>Last run {ago(row.last_run_at)}</span>
                </span>
              </div>

              <div className="dash-row-actions">
                <label className="dash-toggle">
                  <input
                    type="checkbox"
                    checked={row.enabled}
                    disabled={busy[row.id] === 'toggle'}
                    onChange={(e) => toggle(row, e.target.checked)}
                  />
                  <span className="track" aria-hidden="true" />
                  <span>{row.enabled ? 'Enabled' : 'Paused'}</span>
                </label>

                <button
                  type="button"
                  className="dash-mini primary"
                  onClick={() => runNow(row)}
                  disabled={Boolean(busy[row.id])}
                >
                  {running ? 'Running…' : 'Run now'}
                </button>

                <Link href={`/dashboard/automations/${row.id}`} className="dash-mini">Settings</Link>

                <button
                  type="button"
                  className="dash-mini danger"
                  onClick={() => setConfirming(confirming === row.id ? null : row.id)}
                  disabled={Boolean(busy[row.id])}
                >
                  Delete
                </button>
              </div>
            </div>

            {confirming === row.id ? (
              <div className="dash-banner bad" style={{ margin: 0 }} role="alert">
                <span>
                  Delete <strong>{row.name}</strong>? Its run history stays in the log, but the
                  automation stops for good.
                </span>
                <span className="dash-row-actions" style={{ marginLeft: 'auto' }}>
                  <button
                    type="button"
                    className="dash-mini danger"
                    onClick={() => remove(row)}
                    disabled={busy[row.id] === 'delete'}
                  >
                    {busy[row.id] === 'delete' ? 'Deleting…' : 'Yes, delete'}
                  </button>
                  <button type="button" className="dash-mini" onClick={() => setConfirming(null)}>
                    Keep it
                  </button>
                </span>
              </div>
            ) : null}

            {error ? <p className="dash-error" role="alert">{error}</p> : null}

            {result ? (
              <div className="dash-row-title">
                <div className="dash-meta">
                  <StatusPill status={result.status} />
                  {result.demo ? <span className="dash-pill warn flat">Sample output</span> : null}
                  <span>{result.message}</span>
                </div>
                {result.demo ? (
                  <p className="dash-note">
                    No AI key is configured on this deployment, so this text is a placeholder,
                    not a real model response.
                  </p>
                ) : null}
                {result.output ? <pre className="dash-pre">{result.output}</pre> : null}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
