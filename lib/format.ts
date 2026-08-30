export function hours(minutes: number) {
  const h = minutes / 60;
  return h >= 10 ? `${Math.round(h)}h` : `${h.toFixed(1)}h`;
}

export function ago(iso?: string | null) {
  if (!iso) return 'never';
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export const AVAILABILITY: Record<string, { label: string; tone: string; note: string }> = {
  live:           { label: 'Live',            tone: 'ok',   note: 'Runs for real right now.' },
  pending_review: { label: 'Pending approval',tone: 'warn', note: 'Built, but waiting on OAuth verification from the provider.' },
  needs_key:      { label: 'Needs API key',   tone: 'info', note: 'Built. Add the provider key in Connections to switch it on.' },
  beta:           { label: 'Beta',            tone: 'info', note: 'Early access.' },
};
