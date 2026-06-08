'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BankLayout } from '@/components/layout/BankLayout';
import { StatCard } from '@/components/ui/StatCard';
import { accountCards, recentActivity, securityItems } from '@/lib/constants';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { day: '16 Jun', amount: 4820 },
  { day: '17 Jun', amount: 7250 },
  { day: '18 Jun', amount: 15200 },
  { day: '19 Jun', amount: 25000 },
  { day: '20 Jun', amount: 96200 },
  { day: '21 Jun', amount: 18500 },
  { day: '22 Jun', amount: 12000 }
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 space-y-8 animate-fadeIn">
        {/* Welcome & Overview Banner */}
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#081220] via-[#0B2545] to-[#134074] p-8 text-white shadow-[0_24px_50px_rgba(11,37,69,0.18)] relative overflow-hidden">
          <div className="absolute right-0 top-0 -mr-12 -mt-12 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute left-1/3 bottom-0 -mb-16 w-48 h-48 bg-[#F37021]/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] relative z-2">
            <div className="space-y-4">
              <span className="inline-flex rounded-full border border-emerald-400/35 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400 items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Secure Session Active
              </span>
              <h1 className="text-4xl font-black tracking-tight leading-tight md:text-5xl">
                Welcome back, Asha Menon
              </h1>
              <p className="max-w-xl text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                Your account is protected by Saathi AI's real-time behavioral authentication overlay. Feel secure knowing transfers are constantly guarded against digital coercion and vishing guides.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xs p-6 flex flex-col justify-between shadow-lg">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">Total Net Worth</p>
                <p className="mt-2 text-3xl font-black text-amber-400 tracking-tight">₹4,41,820.18</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between text-xs text-white/60">
                <span>KYC Status: <strong className="text-emerald-400">Verified</strong></span>
                <span>PAN Linked: <strong>A***M81E</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Available Balance" value="₹3,41,820.00" hint="Across 3 accounts" accent="success" />
          <StatCard label="Scheduled Autopay" value="4 Active" hint="Next run: Tomorrow" accent="primary" />
          <StatCard label="Saved Beneficiaries" value="18 Payees" hint="Active & verified list" accent="info" />
          <StatCard label="Card Status" value="2 Cards Active" hint="Debit (RuPay) & Credit" accent="warning" />
        </section>

        {/* Main Columns */}
        <div className="grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-8">
            {/* Visual Spend Graph */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5 mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Transaction Stream</p>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Weekly Activity Trend</h2>
                </div>
                <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-semibold text-slate-500">
                  <button className="rounded-md bg-white px-3 py-1 text-slate-700 shadow-xs">7 Days</button>
                  <button className="px-3 py-1 hover:text-slate-800">30 Days</button>
                </div>
              </div>
              <div className="h-64 w-full">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F37021" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#F37021" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f172a', 
                          border: 'none', 
                          borderRadius: '12px', 
                          color: '#fff',
                          fontFamily: 'monospace',
                          fontSize: '11px'
                        }} 
                      />
                      <Area type="monotone" dataKey="amount" stroke="#F37021" strokeWidth={2.5} fillOpacity={1} fill="url(#chartGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-slate-50 animate-pulse rounded-2xl flex items-center justify-center text-xs text-slate-400">Loading spending metrics...</div>
                )}
              </div>
            </section>

            {/* Linked Balances and Transactions Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Linked Accounts */}
              <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between border-b pb-5 mb-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#F37021]">Liquid Assets</p>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Accounts</h2>
                  </div>
                  <Link href="/accounts" className="text-xs font-bold text-[#0B2545] hover:text-[#F37021] hover:underline transition">
                    View Ledger
                  </Link>
                </div>
                <div className="space-y-3.5">
                  {accountCards.map((account) => (
                    <article key={account.name} className="rounded-2xl border border-slate-200/60 bg-slate-50/50 p-4 hover:bg-slate-50 hover:shadow-2xs transition duration-150">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{account.name}</p>
                          <p className="mt-0.5 text-[10px] text-slate-400 font-semibold">{account.number}</p>
                        </div>
                        <span className="rounded-full bg-white border border-slate-200/60 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                          SB-102
                        </span>
                      </div>
                      <div className="mt-3 flex items-end justify-between gap-4">
                        <p className="text-xl font-black text-slate-800 tracking-tight">{account.balance}</p>
                        <span className="text-[9px] uppercase font-bold text-emerald-500">Active</span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* Recent Transactions */}
              <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between border-b pb-5 mb-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#F37021]">Recent feed</p>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Transactions</h2>
                  </div>
                  <Link href="/transactions" className="text-xs font-bold text-[#0B2545] hover:text-[#F37021] hover:underline transition">
                    Statements
                  </Link>
                </div>
                <div className="space-y-3.5">
                  {recentActivity.map((item) => {
                    const isCredit = item.amount.startsWith('+');
                    return (
                      <article key={`${item.title}-${item.date}`} className="rounded-2xl border border-slate-200/60 bg-white p-4 flex items-center justify-between gap-4 hover:shadow-2xs transition">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
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
                          <p className="text-[8px] uppercase font-bold text-slate-400 mt-0.5">{item.status}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar Area */}
          <aside className="space-y-6">
            {/* Quick Actions */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <h2 className="text-xl font-black text-slate-800 tracking-tight border-b pb-4 mb-4">Quick Operations</h2>
              <div className="grid gap-3">
                {[
                  { 
                    href: '/transfer', 
                    label: 'Transfer Funds',
                    icon: (
                      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )
                  },
                  { 
                    href: '/beneficiary', 
                    label: 'Add Beneficiary',
                    icon: (
                      <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    )
                  },
                  { 
                    href: '/cards', 
                    label: 'Manage Cards',
                    icon: (
                      <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    )
                  },
                  { 
                    href: '/support', 
                    label: 'Care Center Support',
                    icon: (
                      <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    )
                  }
                ].map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className="rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3.5 text-xs font-bold text-slate-700 transition hover:border-[#0B2545]/20 hover:bg-[#0B2545]/5 hover:text-[#0B2545] flex items-center gap-3"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* AI Security Policy */}
            <section className="rounded-3xl border border-slate-800 bg-[#081326] p-6 text-white shadow-[0_18px_40px_rgba(8,19,38,0.2)]">
              <p className="text-xs uppercase tracking-[0.25em] text-[#F37021] font-bold">Saathi AI shield</p>
              <h2 className="text-xl font-black text-white mt-1">Active Guarantees</h2>
              <div className="mt-5 space-y-3.5">
                {securityItems.map((item) => (
                  <div key={item} className="rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-xs leading-relaxed text-slate-300 font-medium">
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
