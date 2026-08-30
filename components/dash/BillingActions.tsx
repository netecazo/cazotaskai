'use client';

import { useState } from 'react';

export function UpgradeButton({
  plan,
  label,
  disabled,
  variant = 'primary',
}: {
  plan: 'pro' | 'team';
  label: string;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.url) {
        throw new Error(body?.error ?? 'Checkout could not be started.');
      }
      window.location.assign(body.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout could not be started.');
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-ghost'}`}
        onClick={go}
        disabled={busy || disabled}
        style={{ width: '100%' }}
      >
        {busy ? 'Opening checkout…' : label}
      </button>
      {error ? <p className="dash-error" role="alert" style={{ marginTop: 10 }}>{error}</p> : null}
    </>
  );
}

export function PortalButton({ disabled }: { disabled?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.url) {
        throw new Error(body?.error ?? 'The billing portal could not be opened.');
      }
      window.location.assign(body.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The billing portal could not be opened.');
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" className="btn btn-ghost" onClick={go} disabled={busy || disabled}>
        {busy ? 'Opening…' : 'Manage billing'}
      </button>
      {error ? <p className="dash-error" role="alert" style={{ marginTop: 10 }}>{error}</p> : null}
    </>
  );
}
