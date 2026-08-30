'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import { ago } from '@/lib/format';
import StatusPill, { runStatusLabel } from '@/components/dash/StatusPill';

export type RunRow = {
  id: string;
  status: string;
  automation_id: string | null;
  automation_name: string;
  template_slug: string;
  source: string;
  minutes_saved: number;
  tokens_used: number | null;
  is_demo: boolean;
  error: string | null;
  output: string | null;
  actions: unknown[];
  created_at: string;
};

const FILTERS = [
  'all', 'succeeded', 'awaiting_approval', 'failed', 'running', 'queued', 'skipped', 'rejected',
];

export default function RunsTable({ runs }: { runs: RunRow[] }) {
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState<string | null>(null);

  const visible = filter === 'all' ? runs : runs.filter((r) => r.status === filter);

  return (
    <>
      <div className="dash-chips" role="group" aria-label="Filter runs by status">
        <span className="lbl">Status</span>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`dash-chip ${filter === f ? 'on' : ''}`.trim()}
            aria-pressed={filter === f}
            onClick={() => { setFilter(f); setOpen(null); }}
          >
            {f === 'all' ? 'All' : runStatusLabel(f)}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="glass dash-empty">
          <h3>No runs with that status</h3>
          <p>Nothing in your log matches this filter yet.</p>
          <button type="button" className="btn btn-ghost" onClick={() => setFilter('all')}>
            Show every run
          </button>
        </div>
      ) : (
        <div className="glass dash-panel tight">
          <div className="dash-scroll">
            <table className="dash-table">
              <caption className="dash-sr">
                Your run log. Select a row to read the AI output and the actions taken.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Status</th>
                  <th scope="col">Automation</th>
                  <th scope="col">Trigger</th>
                  <th scope="col">Minutes saved</th>
                  <th scope="col">Tokens</th>
                  <th scope="col">When</th>
                  <th scope="col"><span className="dash-sr">Details</span></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((run) => {
                  const isOpen = open === run.id;
                  return (
                    <Fragment key={run.id}>
                      <tr
                        className="clickable"
                        onClick={() => setOpen(isOpen ? null : run.id)}
                      >
                        <td>
                          <StatusPill status={run.status} />
                          {run.is_demo ? (
                            <span className="dash-tag" style={{ marginLeft: 8 }}>Sample output</span>
                          ) : null}
                        </td>
                        <td className="ink">{run.automation_name}</td>
                        <td>{run.source}</td>
                        <td>{run.minutes_saved}</td>
                        <td>{run.tokens_used ?? '—'}</td>
                        <td>{ago(run.created_at)}</td>
                        <td>
                          <button
                            type="button"
                            className="dash-mini"
                            aria-expanded={isOpen}
                            aria-controls={`run-detail-${run.id}`}
                            onClick={(e) => { e.stopPropagation(); setOpen(isOpen ? null : run.id); }}
                          >
                            {isOpen ? 'Hide' : 'Details'}
                          </button>
                        </td>
                      </tr>

                      {isOpen ? (
                        <tr>
                          <td className="expand" colSpan={7} id={`run-detail-${run.id}`}>
                            {run.is_demo ? (
                              <p className="dash-note" style={{ marginBottom: 10 }}>
                                This run was produced without an AI key, so the text below is
                                sample output rather than a real model response.
                              </p>
                            ) : null}

                            {run.error ? (
                              <p className="dash-error" style={{ marginBottom: 10 }}>{run.error}</p>
                            ) : null}

                            <h3 style={{ fontSize: '.85rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted-2)', marginBottom: 8 }}>
                              AI output
                            </h3>
                            <pre className="dash-pre">
                              {run.output ?? 'This run produced no text output.'}
                            </pre>

                            <h3 style={{ fontSize: '.85rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted-2)', margin: '16px 0 8px' }}>
                              Actions
                            </h3>
                            <pre className="dash-pre">
                              {run.actions && run.actions.length > 0
                                ? JSON.stringify(run.actions, null, 2)
                                : 'No actions were recorded for this run.'}
                            </pre>

                            {run.automation_id ? (
                              <p style={{ marginTop: 12 }}>
                                <Link href={`/dashboard/automations/${run.automation_id}`} className="dash-mini">
                                  Open automation settings
                                </Link>
                              </p>
                            ) : null}
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
