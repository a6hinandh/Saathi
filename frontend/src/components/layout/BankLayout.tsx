import Link from 'next/link';
import type { ReactNode } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/accounts', label: 'Accounts' },
  { href: '/transfer', label: 'Payments' },
  { href: '/beneficiary', label: 'Payees' },
  { href: '/transactions', label: 'Statements' },
  { href: '/cards', label: 'Cards' },
  { href: '/security', label: 'Security' },
  { href: '/support', label: 'Support' },
  { href: '/settings', label: 'Settings' }
];

export function BankLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#eef3f7] text-slate-900">
      <div className="grid min-h-screen xl:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-[#081326] text-white xl:border-b-0 xl:border-r xl:border-slate-800">
          <div className="flex h-full flex-col justify-between px-6 py-8 lg:px-7">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-sm font-bold text-[#081326] shadow-lg shadow-amber-950/20">
                  NB
                </div>
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.32em] text-white/55">Northfield Bank</p>
                  <p className="text-lg font-semibold">Internet Banking</p>
                </div>
              </div>
              <p className="mt-6 max-w-xs text-sm leading-6 text-white/68">
                Manage accounts, payments, cards, statements, and service requests in one secure session.
              </p>
              <nav className="mt-8 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/0 px-4 py-3 text-sm font-medium text-white/82 transition hover:border-amber-300/40 hover:bg-white/6 hover:text-white"
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-white/35">Open</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/15 backdrop-blur">
              <p className="text-[0.68rem] uppercase tracking-[0.26em] text-white/50">Today's session</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-white/62">Secure access level</p>
                  <p className="mt-1 text-2xl font-semibold">Verified</p>
                </div>
                <div className="rounded-2xl bg-emerald-400/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
                  Active
                </div>
              </div>
            </div>
          </div>
        </aside>
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-bank-600">Secure session</p>
                <p className="mt-1 text-sm text-slate-500">Customer ID 10021487</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                <Link href="/support" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                  Support
                </Link>
                <Link href="/login" className="rounded-full bg-slate-950 px-4 py-2 text-white transition hover:bg-[#081326]">
                  Sign out
                </Link>
              </div>
            </div>
          </header>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
