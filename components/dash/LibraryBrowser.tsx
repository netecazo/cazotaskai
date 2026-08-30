'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AVAILABILITY } from '@/lib/format';

export type LibraryTemplate = {
  slug: string;
  name: string;
  description: string | null;
  category: string | null;
  trigger_type: string | null;
  required_providers: string[] | null;
  est_minutes_saved: number | null;
  availability: string | null;
};

const TONE: Record<string, string> = { ok: 'ok', warn: 'warn', info: 'info' };

const PROVIDER_LABEL: Record<string, string> = {
  slack: 'Slack', gmail: 'Gmail', outlook: 'Outlook', gcal: 'Google Calendar',
  zoom: 'Zoom', teams: 'Microsoft Teams', notion: 'Notion', sheets: 'Google Sheets',
  hubspot: 'HubSpot', stripe: 'Stripe', quickbooks: 'QuickBooks',
};

function titleise(value: string) {
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function LibraryBrowser({
  templates,
  addedSlugs,
}: {
  templates: LibraryTemplate[];
  addedSlugs: string[];
}) {
  const router = useRouter();
  const [category, setCategory] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [added, setAdded] = useState<string[]>(addedSlugs);
  const [error, setError] = useState<string | null>(null);
  const [limitHit, setLimitHit] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((t) => { if (t.category) set.add(t.category); });
    return Array.from(set).sort();
  }, [templates]);

  const availabilities = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((t) => { if (t.availability) set.add(t.availability); });
    return Array.from(set);
  }, [templates]);

  const visible = templates.filter(
    (t) =>
      (category === 'all' || t.category === category) &&
      (availability === 'all' || t.availability === availability)
  );

  async function add(slug: string) {
    setBusySlug(slug);
    setError(null);
    setLimitHit(null);
    try {
      const res = await fetch('/api/automations', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ template_slug: slug }),
      });
      const body = await res.json().catch(() => ({}));

      if (res.status === 402 || body?.code === 'plan_limit') {
        setLimitHit(body?.error ?? 'You have reached your plan limit for active automations.');
        return;
      }
      if (!res.ok) throw new Error(body?.error ?? 'Could not add that automation.');

      setAdded((prev) => [...prev, slug]);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add that automation.');
    } finally {
      setBusySlug(null);
    }
  }

  return (
    <>
      {limitHit ? (
        <div className="dash-banner warn" role="alert">
          <span><strong>Plan limit reached</strong> — {limitHit}</span>
          <Link href="/dashboard/billing" className="dash-mini primary">Upgrade plan</Link>
        </div>
      ) : null}

      {error ? (
        <div className="dash-banner bad" role="alert">
          <span>{error}</span>
        </div>
      ) : null}

      <div className="dash-chips" role="group" aria-label="Filter by category">
        <span className="lbl">Category</span>
        <button
          type="button"
          className={`dash-chip ${category === 'all' ? 'on' : ''}`.trim()}
          aria-pressed={category === 'all'}
          onClick={() => setCategory('all')}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={`dash-chip ${category === c ? 'on' : ''}`.trim()}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {titleise(c)}
          </button>
        ))}
      </div>

      <div className="dash-chips" role="group" aria-label="Filter by availability">
        <span className="lbl">Availability</span>
        <button
          type="button"
          className={`dash-chip ${availability === 'all' ? 'on' : ''}`.trim()}
          aria-pressed={availability === 'all'}
          onClick={() => setAvailability('all')}
        >
          All
        </button>
        {availabilities.map((a) => (
          <button
            key={a}
            type="button"
            className={`dash-chip ${availability === a ? 'on' : ''}`.trim()}
            aria-pressed={availability === a}
            onClick={() => setAvailability(a)}
          >
            {AVAILABILITY[a]?.label ?? titleise(a)}
          </button>
        ))}
      </div>

      <p className="small" style={{ marginBottom: 16 }}>
        Showing {visible.length} of {templates.length} automations.
      </p>

      {visible.length === 0 ? (
        <div className="glass dash-empty">
          <h3>Nothing matches those filters</h3>
          <p>Try widening the category or availability filter to see the rest of the library.</p>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => { setCategory('all'); setAvailability('all'); }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="dash-cards">
          {visible.map((t) => {
            const meta = AVAILABILITY[t.availability ?? ''] ?? {
              label: titleise(t.availability ?? 'unknown'),
              tone: '',
              note: '',
            };
            const isAdded = added.includes(t.slug);
            const providers = t.required_providers ?? [];

            return (
              <article key={t.slug} className="glass dash-card">
                <div className="dash-meta">
                  {t.category ? <span className="dash-tag">{titleise(t.category)}</span> : null}
                  <span className={`dash-pill ${TONE[meta.tone] ?? ''}`.trim()} title={meta.note}>
                    {meta.label}
                  </span>
                </div>

                <h3>{t.name}</h3>
                {t.description ? <p>{t.description}</p> : null}

                {providers.length > 0 ? (
                  <div className="dash-meta" aria-label="Tools this automation needs">
                    {providers.map((p) => (
                      <span key={p} className="dash-tag">{PROVIDER_LABEL[p] ?? titleise(p)}</span>
                    ))}
                  </div>
                ) : (
                  <div className="dash-meta"><span className="dash-tag">No connections needed</span></div>
                )}

                {t.availability !== 'live' && meta.note ? (
                  <p className="dash-note">{meta.note}</p>
                ) : null}

                <div className="foot">
                  <span className="dash-meta">
                    Saves about <strong style={{ color: 'var(--mint)', marginLeft: 4 }}>
                      {Number(t.est_minutes_saved ?? 0)} min
                    </strong>&nbsp;a run
                  </span>
                  <button
                    type="button"
                    className="dash-mini primary"
                    onClick={() => add(t.slug)}
                    disabled={busySlug === t.slug}
                  >
                    {busySlug === t.slug ? 'Adding…' : isAdded ? 'Add again' : 'Add'}
                  </button>
                </div>

                {isAdded ? (
                  <p className="dash-ok">
                    Added. <Link href="/dashboard/automations" style={{ textDecoration: 'underline' }}>
                      Configure it
                    </Link>
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
