'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const navItems = [
  { 
    href: '/dashboard', 
    label: 'Overview',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
      </svg>
    )
  },
  { 
    href: '/accounts', 
    label: 'Accounts',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  { 
    href: '/transfer', 
    label: 'Payments',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )
  },
  { 
    href: '/beneficiary', 
    label: 'Payees',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  { 
    href: '/transactions', 
    label: 'Statements',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  { 
    href: '/cards', 
    label: 'Cards',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  { 
    href: '/security', 
    label: 'Security',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  { 
    href: '/support', 
    label: 'Support',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.172l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  { 
    href: '/settings', 
    label: 'Settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

export function BankLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lastLoginTime = '22 June 2026, 11:20:18 IST';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      {/* Top running safety notification */}
      <div className="bg-gradient-to-r from-[#F37021] to-[#E05A17] text-white h-8 px-6 text-[0.72rem] font-bold overflow-hidden border-b border-[#C04C10] shadow-sm select-none flex items-center justify-center sticky top-0 z-30">
        <div className="mx-auto max-w-7xl flex items-center justify-center">
          <div className="animate-marquee inline-flex gap-16 whitespace-nowrap">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              SAFETY WARNING: Saathi Bank will never ask for OTP or UPI PIN. Ignore police imposters on call.
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              BEWARE: Imposters demanding payment for "KYC updates" or "Digital Arrest" verification are scammers.
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              REPORT CYBER FRAUD IMMEDIATELY: Dial toll-free 1930 to freeze fraudulent transfers.
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid xl:grid-cols-[280px_1fr] relative">
        {/* Sidebar */}
        <aside className="bg-slate-900 border-r border-slate-800 text-slate-300 xl:sticky xl:top-8 xl:h-[calc(100vh-32px)] flex flex-col justify-between p-6 overflow-y-auto scrollbar-none z-20">
          <div className="space-y-8">
            {/* Header / Logo */}
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <img src="/logo.png" alt="Saathi Logo" className="h-11 w-11 object-contain rounded-xl bg-white p-1 transition group-hover:scale-105 duration-300 shadow-md shadow-[#F37021]/10" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
              </div>
              <div>
                <p className="text-[0.6rem] font-black uppercase tracking-[0.25em] text-[#F37021]">Saathi Bank</p>
                <p className="text-xs font-semibold tracking-tight text-white group-hover:text-[#00ffcc] transition">NetBanking</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="space-y-1">
              <p className="text-[0.62rem] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Main Menu</p>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition duration-200 border border-transparent ${
                      isActive
                        ? 'bg-slate-800 border-slate-700/50 text-white shadow-inner shadow-slate-900/50 text-shadow-sm border-l-4 border-l-[#F37021]'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
                    }`}
                  >
                    <span className={isActive ? 'text-[#F37021]' : 'text-slate-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-4 pt-6 mt-6 border-t border-slate-800">
            {/* Analyst Console Link */}
            <Link 
              href="/admin" 
              className="block text-center rounded-xl bg-amber-400/5 border border-amber-400/20 hover:bg-amber-400/10 hover:border-amber-400/40 py-2.5 px-3 transition duration-200 shadow-xs group"
            >
              <p className="text-[9px] uppercase font-black tracking-widest text-amber-400 flex items-center justify-center gap-1">
                <svg className="w-3 h-3 text-amber-400 group-hover:scale-105 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Analyst Console
              </p>
              <p className="text-[10px] text-slate-300 mt-0.5 font-medium">Saathi Risk Engine Logs</p>
            </Link>

            {/* Session Security Indicator */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/10 rounded-bl-full blur-xs transition group-hover:bg-emerald-500/20"></div>
              <p className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-500">Security System</p>
              <div className="mt-2.5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] text-slate-400">Shield Protection</p>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5">Active & Guarded</p>
                </div>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-8 z-10 border-b border-slate-200/80 bg-white/70 backdrop-blur-md px-6 py-4">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] font-black text-[#F37021]">Retail Internet Banking</p>
                <p className="mt-0.5 text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  Customer: <span className="text-slate-800 font-bold">Asha Menon</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  ID: <span className="font-bold">10021487</span>
                </p>
              </div>
              <div className="flex items-center gap-5">
                <div className="hidden md:block text-right">
                  <p className="text-[8px] uppercase tracking-wider font-extrabold text-slate-400">Secure Session Start</p>
                  <p className="text-[11px] font-semibold text-slate-600 mt-0.5">{lastLoginTime}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link 
                    href="/support" 
                    className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2 text-xs font-bold text-slate-700 transition tracking-wider uppercase"
                  >
                    Helpline
                  </Link>
                  <Link 
                    href="/login" 
                    className="rounded-full bg-slate-900 hover:bg-slate-800 px-5 py-2 text-xs font-bold text-white transition shadow-sm tracking-wider uppercase"
                  >
                    Logout
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Child Page Rendering Area */}
          <div className="flex-1 bg-slate-50">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
