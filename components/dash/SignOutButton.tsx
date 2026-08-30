'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signOut() {
    setBusy(true);
    setError(null);
    try {
      const { error: err } = await supabaseBrowser().auth.signOut();
      if (err) throw err;
      router.push('/');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not sign out. Please try again.');
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" className="btn btn-ghost" onClick={signOut} disabled={busy}>
        {busy ? 'Signing out…' : 'Sign out'}
      </button>
      {error ? <p className="dash-error" role="alert">{error}</p> : null}
    </>
  );
}
