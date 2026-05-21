 'use client';

import Link from 'next/link';
import { BankLayout } from '@/components/layout/BankLayout';
import { StatCard } from '@/components/ui/StatCard';
import { accountCards, dashboardStats, recentActivity, securityItems } from '@/lib/constants';

export default function DashboardPage() {
  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-[#081326] p-7 text-white shadow-[0_24px_70px_rgba(8,19,38,0.25)]">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="max-w-2xl space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">Account overview</p>
                  <h1 className="text-5xl leading-tight md:text-6xl">Everything you need for the day, in one place.</h1>
                  <p className="max-w-2xl text-base leading-7 text-white/72">
                    Move between accounts, transfer funds, review card activity, and keep track of payments from a single trusted banking session.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Quick balance</p>
                  <p className="mt-3 text-4xl font-semibold">INR 3,41,820</p>
                  <p className="mt-2 text-sm text-white/68">Across linked accounts</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {dashboardStats.map((item) => (
                <StatCard key={item.label} label={item.label} value={item.value} hint={item.hint} />
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.26em] text-bank-600">Accounts</p>
                    <h2 className="mt-2 text-3xl">Linked balances</h2>
                  </div>
                  <Link href="/accounts" className="text-sm font-semibold text-bank-700 hover:text-bank-800">
                    View all
                  </Link>
                </div>
                <div className="mt-5 space-y-4">
                  {accountCards.map((account) => (
                    <article key={account.name} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{account.name}</p>
                          <p className="mt-1 text-sm text-slate-500">{account.number}</p>
                        </div>
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                          {account.status}
                        </span>
                      </div>
                      <div className="mt-4 flex items-end justify-between gap-4">
                        <p className="text-3xl font-semibold text-slate-900">{account.balance}</p>
                        <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{account.tone}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.26em] text-bank-600">Recent activity</p>
                    <h2 className="mt-2 text-3xl">Latest transactions</h2>
                  </div>
                  <Link href="/transactions" className="text-sm font-semibold text-bank-700 hover:text-bank-800">
                    Open statements
                  </Link>
                </div>
                <div className="mt-5 space-y-4">
                  {recentActivity.map((item) => (
                    <article key={`${item.title}-${item.date}`} className="rounded-[1.5rem] border border-slate-200 px-4 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{item.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900">{item.amount}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{item.status}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-bank-600">Quick actions</p>
                  <h2 className="mt-2 text-2xl">What would you like to do?</h2>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {[
                  { href: '/transfer', label: 'Make a transfer' },
                  { href: '/beneficiary', label: 'Manage payees' },
                  { href: '/cards', label: 'Card controls' },
                  { href: '/support', label: 'Raise a request' }
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white">
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-[#081326] p-6 text-white shadow-[0_18px_50px_rgba(8,19,38,0.22)]">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">Security center</p>
              <h2 className="mt-2 text-2xl">Session protections</h2>
              <div className="mt-5 space-y-3">
                {securityItems.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm leading-6 text-white/80">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </BankLayout>
  );
}
