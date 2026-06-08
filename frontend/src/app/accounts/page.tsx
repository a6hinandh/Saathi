'use client';

import { useState } from 'react';
import { BankLayout } from '@/components/layout/BankLayout';
import { StatCard } from '@/components/ui/StatCard';
import { accountCards, dashboardStats, recentActivity } from '@/lib/constants';

export default function AccountsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'debit' | 'credit'>('all');

  const cardColors = {
    emerald: 'from-[#0d9488] via-[#0f766e] to-[#115e59]',
    slate: 'from-[#1e293b] via-[#334155] to-[#475569]',
    gold: 'from-[#b45309] via-[#92400e] to-[#78350f]'
  };

  const filteredActivity = recentActivity.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'debit') return item.amount.startsWith('-');
    if (activeTab === 'credit') return item.amount.startsWith('+');
    return true;
  });

  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 space-y-8 animate-fadeIn">
        {/* Header Banner */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.02)]">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#F37021] font-bold">Ledger Balance</p>
          <h1 className="mt-2 text-4xl font-black text-slate-800 tracking-tight">Accounts Overview</h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-3xl font-medium">
            Monitor balances, view product details, and search transactions. Your accounts are monitored for abnormal withdrawal rates.
          </p>
        </section>

        {/* Stats Grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((item, idx) => (
            <StatCard 
              key={item.label} 
              label={item.label} 
              value={item.value} 
              hint={item.hint} 
              accent={idx === 0 ? 'success' : idx === 3 ? 'warning' : 'primary'} 
            />
          ))}
        </section>

        {/* Core Layout */}
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          {/* Virtual Cards Grid */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Your Digital Cards</h2>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-2">
              {accountCards.map((account) => {
                const colorKey = (account.tone === 'gold' ? 'gold' : account.tone === 'emerald' ? 'emerald' : 'slate') as 'gold' | 'emerald' | 'slate';
                const color = cardColors[colorKey];
                return (
                  <article 
                    key={account.name} 
                    className={`rounded-2xl bg-gradient-to-br ${color} p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-48 hover:scale-[1.01] transition duration-200`}
                  >
                    {/* Background Accent */}
                    <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-extrabold text-white/50">{account.name}</p>
                        <p className="text-[11px] text-white/70 font-mono mt-0.5">{account.number}</p>
                      </div>
                      {/* Gold card chip simulation */}
                      <div className="w-8 h-6 rounded-md bg-amber-400/80 border border-amber-300 shadow-inner flex items-center justify-center">
                        <span className="w-4 h-3 border border-amber-500/30 rounded-xs"></span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-white/50 font-bold uppercase tracking-wider">Available balance</p>
                      <p className="text-2xl font-black tracking-tight mt-1">{account.balance}</p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] border-t border-white/10 pt-3 text-white/60">
                      <span>{account.status}</span>
                      <span className="font-extrabold uppercase text-[#00ffcc]">AI Shield Active</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Recent Ledger Entries */}
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5 mb-5">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#F37021]">Posted transactions</p>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Recent Activity</h2>
                </div>
                {/* Tabs */}
                <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-semibold text-slate-500">
                  <button 
                    onClick={() => setActiveTab('all')}
                    className={`rounded-md px-3 py-1 shadow-xs transition ${activeTab === 'all' ? 'bg-white text-slate-800' : 'hover:text-slate-800'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setActiveTab('credit')}
                    className={`rounded-md px-3 py-1 shadow-xs transition ${activeTab === 'credit' ? 'bg-white text-slate-800' : 'hover:text-slate-800'}`}
                  >
                    Credits
                  </button>
                  <button 
                    onClick={() => setActiveTab('debit')}
                    className={`rounded-md px-3 py-1 shadow-xs transition ${activeTab === 'debit' ? 'bg-white text-slate-800' : 'hover:text-slate-800'}`}
                  >
                    Debits
                  </button>
                </div>
              </div>

              <div className="space-y-3.5">
                {filteredActivity.length > 0 ? (
                  filteredActivity.map((item) => {
                    const isCredit = item.amount.startsWith('+');
                    return (
                      <article key={`${item.title}-${item.date}`} className="rounded-2xl border border-slate-200/60 bg-slate-50/20 p-4 flex items-center justify-between gap-4 hover:shadow-2xs transition">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            {isCredit ? '↙' : '↗'}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-1">{item.title}</p>
                            <p className="mt-0.5 text-[10px] text-slate-400 font-semibold">{item.detail}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-xs font-black ${isCredit ? 'text-emerald-600' : 'text-slate-800'}`}>
                            {item.amount}
                          </p>
                          <p className="text-[8px] uppercase font-bold text-slate-400 mt-0.5">{item.date}</p>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="py-10 text-center text-xs text-slate-400 font-medium">No transactions match your active filter.</div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </BankLayout>
  );
}