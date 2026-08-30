'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

function Logo() {
  return (
    <a href="/" className="logo" aria-label="CazoTask home">
      <span className="logo-mark" aria-hidden="true">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>
      </span>
      CazoTask
    </a>
  );
}

type Mode = 'signin' | 'signup';

function friendlyError(err: unknown): string {
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object' && 'message' in err) {
    const message = String((err as { message?: unknown }).message ?? '');
    if (message) return message;
  }
  return 'Something went wrong. Please try again.';
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const plan = (params.get('plan') ?? '').toLowerCase();
  const nextParam = params.get('next');
  const linkError = params.get('error');

  const [mode, setMode] = useState<Mode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(
    linkError === 'link_expired' ? 'That sign-in link has expired. Request a new one below.' : null
  );
  const [notice, setNotice] = useState<string | null>(null);

  function destination(): string {
    if (nextParam && nextParam.startsWith('/')) return nextParam;
    if (plan === 'pro' || plan === 'team') return `/dashboard/billing?plan=${plan}`;
    return '/dashboard';
  }

  function callbackUrl(): string {
    const next = encodeURIComponent(destination());
    return `${window.location.origin}/auth/callback?next=${next}`;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);

    try {
      const sb = supabaseBrowser();

      if (mode === 'signup') {
        const { data, error: signUpError } = await sb.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: callbackUrl() },
        });
        if (signUpError) {
          setError(friendlyError(signUpError));
          return;
        }
        if (!data.session) {
          setNotice(
            `Almost there — we sent a confirmation link to ${email}. Open it to finish creating your account.`
          );
          return;
        }
      } else {
        const { error: signInError } = await sb.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError(friendlyError(signInError));
          return;
        }
      }

      router.push(destination());
      router.refresh();
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  async function onMagicLink() {
    setError(null);
    setNotice(null);

    if (!email) {
      setError('Enter your email address first, then request a link.');
      return;
    }

    setBusy(true);
    try {
      const sb = supabaseBrowser();
      const { error: otpError } = await sb.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: callbackUrl() },
      });
      if (otpError) {
        setError(friendlyError(otpError));
        return;
      }
      setNotice(`Check ${email} — we sent you a one-tap sign-in link. It expires in an hour.`);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  const isSignup = mode === 'signup';

  return (
    <div className="glass auth-card">
      <div className="auth-head">
        <Logo />
        <div>
          <h1>{isSignup ? 'Start free' : 'Welcome back'}</h1>
          <p>
            {isSignup
              ? 'Two automations and 100 runs a month. No card required.'
              : 'Sign in to your automations and hours-saved dashboard.'}
          </p>
        </div>
      </div>

      {plan === 'pro' || plan === 'team' ? (
        <p className="small" style={{ marginBottom: 16, textAlign: 'center' }}>
          You picked the <strong className="grad-text">{plan === 'pro' ? 'Pro' : 'Team'}</strong> plan — we&apos;ll
          take you to checkout right after this.
        </p>
      ) : null}

      <form onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            required
            minLength={8}
            placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="auth-actions">
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Working…' : isSignup ? 'Create account' : 'Sign in'}
          </button>
        </div>
      </form>

      <div className="auth-sep">or</div>

      <div className="auth-actions">
        <button type="button" className="btn btn-ghost" onClick={onMagicLink} disabled={busy}>
          Email me a sign-in link
        </button>
      </div>

      {error ? (
        <div className="auth-msg" role="alert">
          {error}
        </div>
      ) : null}

      {notice ? (
        <div className="auth-msg ok" role="status">
          {notice}
        </div>
      ) : null}

      <div className="auth-foot">
        <span>
          {isSignup ? 'Already have an account? ' : 'New to CazoTask? '}
          <button
            type="button"
            onClick={() => {
              setMode(isSignup ? 'signin' : 'signup');
              setError(null);
              setNotice(null);
            }}
          >
            {isSignup ? 'Sign in' : 'Create one free'}
          </button>
        </span>
        <a href="/">← Back to cazotaskai.com</a>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="glass auth-card">
      <div className="auth-head">
        <Logo />
        <div>
          <h1>Start free</h1>
          <p>Loading…</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <div className="mesh" aria-hidden="true">
        <div className="blob a"></div><div className="blob b"></div>
      </div>
      <div className="grain" aria-hidden="true"></div>

      <main className="auth-shell">
        <div className="wrap">
          <Suspense fallback={<LoginFallback />}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </>
  );
}
