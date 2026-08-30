import { redirect } from 'next/navigation';
import Link from 'next/link';
import { supabaseServer, requireUser } from '@/lib/supabase/server';
import { limitsFor } from '@/lib/plans';
import SideNav from '@/components/dash/SideNav';
import SignOutButton from '@/components/dash/SignOutButton';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  if (!user) redirect('/login');

  const sb = supabaseServer();

  const [{ data: profile }, { count: pendingApprovals }] = await Promise.all([
    sb.from('ct_profiles')
      .select('id, email, full_name, plan, plan_status')
      .eq('id', user.id)
      .maybeSingle(),
    sb.from('ct_approvals')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'pending'),
  ]);

  const plan = profile?.plan ?? 'starter';
  const planName = limitsFor(plan).name;

  return (
    <div className="dash-shell">
      <div className="mesh" aria-hidden="true">
        <div className="blob a" /><div className="blob b" /><div className="blob c" /><div className="blob d" />
      </div>
      <div className="grain" aria-hidden="true" />

      <aside className="dash-side">
        <Link href="/dashboard" className="logo" aria-label="CazoTask dashboard home">
          <span className="logo-mark" aria-hidden="true">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" /></svg>
          </span>
          CazoTask
        </Link>

        <SideNav pendingApprovals={pendingApprovals ?? 0} />

        <div className="dash-side-foot">
          <p className="dash-user">{profile?.email ?? user.email ?? 'Signed in'}</p>
          <Link href="/dashboard/billing" className="dash-plan">
            <span className="k">Plan</span>
            <span className="v grad-text">{planName}</span>
          </Link>
          <SignOutButton />
        </div>
      </aside>

      <main className="dash-main">
        <div className="wrap">{children}</div>
      </main>
    </div>
  );
}
