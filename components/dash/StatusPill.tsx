export type RunStatus =
  | 'queued' | 'running' | 'succeeded' | 'failed'
  | 'awaiting_approval' | 'skipped' | 'rejected';

const RUN_STATUS: Record<string, { label: string; tone: string }> = {
  queued:            { label: 'Queued',            tone: '' },
  running:           { label: 'Running',           tone: 'info' },
  succeeded:         { label: 'Succeeded',         tone: 'ok' },
  failed:            { label: 'Failed',            tone: 'bad' },
  awaiting_approval: { label: 'Awaiting approval', tone: 'warn' },
  skipped:           { label: 'Skipped',           tone: '' },
  rejected:          { label: 'Rejected',          tone: 'bad' },
};

export function runStatusLabel(status: string) {
  return RUN_STATUS[status]?.label ?? status;
}

/**
 * A status pill. The word is always present, so the pill never relies on
 * colour alone to carry its meaning.
 */
export default function StatusPill({
  status,
  label,
  tone,
}: {
  status?: string;
  label?: string;
  tone?: string;
}) {
  const known = status ? RUN_STATUS[status] : undefined;
  const text = label ?? known?.label ?? status ?? 'Unknown';
  const t = tone ?? known?.tone ?? '';
  return <span className={`dash-pill ${t}`.trim()}>{text}</span>;
}
