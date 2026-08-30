'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/automations', label: 'Automations' },
  { href: '/dashboard/library', label: 'Library' },
  { href: '/dashboard/runs', label: 'Runs' },
  { href: '/dashboard/approvals', label: 'Approvals' },
  { href: '/dashboard/connections', label: 'Connections' },
  { href: '/dashboard/billing', label: 'Billing' },
];

export default function SideNav({ pendingApprovals = 0 }: { pendingApprovals?: number }) {
  const pathname = usePathname() ?? '/dashboard';

  return (
    <nav className="dash-nav" aria-label="Dashboard">
      {LINKS.map((link) => {
        const active =
          link.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={active ? 'on' : undefined}
            aria-current={active ? 'page' : undefined}
          >
            {link.label}
            {link.href === '/dashboard/approvals' && pendingApprovals > 0 ? (
              <span className="count">
                {pendingApprovals}
                <span className="dash-sr"> pending</span>
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
