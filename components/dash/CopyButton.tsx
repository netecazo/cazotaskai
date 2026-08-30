'use client';

import { useState } from 'react';

export default function CopyButton({
  value,
  label = 'Copy',
  ariaLabel,
}: {
  value: string;
  label?: string;
  ariaLabel?: string;
}) {
  const [state, setState] = useState<'idle' | 'done' | 'error'>('idle');

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState('done');
      setTimeout(() => setState('idle'), 2000);
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  }

  return (
    <button
      type="button"
      className="dash-mini"
      onClick={copy}
      aria-label={ariaLabel ?? `${label} to clipboard`}
    >
      {state === 'done' ? 'Copied' : state === 'error' ? 'Copy failed' : label}
    </button>
  );
}
