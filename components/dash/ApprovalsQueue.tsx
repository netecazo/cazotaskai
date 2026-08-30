'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ago } from '@/lib/format';

export type ApprovalCard = {
  id: string;
  templateName: string;
  output: string;
  actions: string[];
  created_at: string;
  isDemo: boolean;
};

const ACTION_LABEL: Record<string, string> = {
  post_slack: 'Post the message to Slack',
  send_digest: 'Send the digest to Slack',
  send_message: 'Send the message',
  webhook_out: 'Call your outbound webhook',
  create_event: 'Create a calendar event',
  draft_reply: 'Save the drafted reply on the run',
  create_doc: 'Produce a document',
  generate_report: 'Produce a report',
  create_task: 'Create a task',
  label_thread: 'Label the thread',
  update_row: 'Update the spreadsheet row',
};

function actionLabel(a: string) {
  return ACTION_LABEL[a] ?? a.replace(/[_-]+/g, ' ');
}

export default function ApprovalsQueue({ approvals }: { approvals: ApprovalCard[] }) {
  const router = useRouter();
  const [items, setItems] = useState(approvals);
  const [busy, setBusy] = useState<Record<string, string | null>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  async function decide(id: string, decision: 'approved' | 'rejected') {
    setBusy((prev) => ({ ...prev, [id]: decision }));
    setErrors((prev) => ({ ...prev, [id]: null }));
    try {
      const res = await fetch(`/api/approvals/${id}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error ?? 'Could not record that decision.');
      setItems((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
    } catch (e) {
      setErrors((prev) => ({
        ...prev,
        [id]: e instanceof Error ? e.message : 'Could not record that decision.',
      }));
      setBusy((prev) => ({ ...prev, [id]: null }));
    }
  }

  if (items.length === 0) {
    return (
      <div className="glass dash-empty">
        <h3>Nothing waiting on you</h3>
        <p>
          The queue is clear. Anything your automations want to send outside CazoTask will
          appear here first, unless you have set them to run and deliver.
        </p>
        <Link href="/dashboard/automations" className="btn btn-primary">Review your automations</Link>
      </div>
    );
  }

  return (
    <div className="dash-list">
      {items.map((item) => {
        const state = busy[item.id];
        const error = errors[item.id];

        return (
          <article key={item.id} className="glass dash-row">
            <div className="dash-row-top">
              <div className="dash-row-title">
                <strong>{item.templateName}</strong>
                <span className="dash-meta">
                  <span className="dash-pill warn">Awaiting approval</span>
                  {item.isDemo ? <span className="dash-tag">Sample output</span> : null}
                  <span>Queued {ago(item.created_at)}</span>
                </span>
              </div>

              <div className="dash-row-actions">
                <button
                  type="button"
                  className="dash-mini good"
                  onClick={() => decide(item.id, 'approved')}
                  disabled={Boolean(state)}
                >
                  {state === 'approved' ? 'Approving…' : 'Approve'}
                </button>
                <button
                  type="button"
                  className="dash-mini danger"
                  onClick={() => decide(item.id, 'rejected')}
                  disabled={Boolean(state)}
                >
                  {state === 'rejected' ? 'Rejecting…' : 'Reject'}
                </button>
              </div>
            </div>

            {item.isDemo ? (
              <p className="dash-note">
                No AI key is configured, so this text is sample output rather than a real model response.
              </p>
            ) : null}

            <pre className="dash-pre">{item.output || 'This run produced no text output.'}</pre>

            <div>
              <h3 style={{ fontSize: '.78rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted-2)', marginBottom: 8 }}>
                What happens if you approve
              </h3>
              {item.actions.length === 0 ? (
                <p className="dash-note">
                  Nothing leaves CazoTask. The output is simply marked as accepted on the run.
                </p>
              ) : (
                <div className="dash-meta">
                  {item.actions.map((a) => (
                    <span key={a} className="dash-tag">{actionLabel(a)}</span>
                  ))}
                </div>
              )}
            </div>

            {error ? <p className="dash-error" role="alert">{error}</p> : null}
          </article>
        );
      })}
    </div>
  );
}
