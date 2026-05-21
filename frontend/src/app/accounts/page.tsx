import { BankLayout } from '@/components/layout/BankLayout';
import { StatCard } from '@/components/ui/StatCard';
import { accountCards, dashboardStats, recentActivity } from '@/lib/constants';

export default function AccountsPage() {
  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <p className="text-xs uppercase tracking-[0.28em] text-bank-600">Accounts</p>
              <h1 className="mt-2 text-4xl">Account overview</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                See your balances, linked products, and activity at a glance.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {dashboardStats.map((item) => (
                <StatCard key={item.label} label={item.label} value={item.value} hint={item.hint} />
              ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {accountCards.map((account) => (
                <article key={account.name} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{account.name}</p>
                  <p className="mt-2 text-sm text-slate-500">{account.number}</p>
                  <p className="mt-6 text-3xl font-semibold text-slate-900">{account.balance}</p>
                  <p className="mt-2 text-sm text-slate-500">{account.status}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <p className="text-xs uppercase tracking-[0.28em] text-bank-600">Recent activity</p>
            <h2 className="mt-2 text-3xl">Latest entries</h2>
            <div className="mt-5 space-y-4">
              {recentActivity.map((item) => (
                <article key={`${item.title}-${item.date}`} className="rounded-[1.5rem] border border-slate-200 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{item.amount}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </BankLayout>
  );
}