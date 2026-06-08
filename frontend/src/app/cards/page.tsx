'use client';

import { useState } from 'react';
import { BankLayout } from '@/components/layout/BankLayout';

const controlsList = [
  { 
    key: 'frozen' as const, 
    label: 'Freeze Card', 
    desc: 'Instantly block all ATM, online, and offline transactions.',
    icon: (
      <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  },
  { 
    key: 'online' as const, 
    label: 'Online E-Commerce', 
    desc: 'Allow online transactions on domestic shopping platforms.',
    icon: (
      <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  },
  { 
    key: 'contactless' as const, 
    label: 'Contactless / Tap-to-Pay', 
    desc: 'Allow NFC payments without PIN entry up to ₹5,000.',
    icon: (
      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-1.414-1.414a7 7 0 000-9.9m0 0L15.536 8.464a5 5 0 010 7.072m0 0l-1.414-1.414a3 3 0 000-4.242" />
      </svg>
    )
  },
  { 
    key: 'international' as const, 
    label: 'International Transactions', 
    desc: 'Enable payments outside India. Keep disabled for max safety.',
    icon: (
      <svg className="w-4 h-4 text-[#F37021] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V8a2 2 0 00-2-2h-1.5a2 2 0 01-2-2V3.07M12 21a9 9 0 100-18 9 9 0 000 18z" />
      </svg>
    )
  }
];

export default function CardsPage() {
  // Mock state for card controls
  const [controls, setControls] = useState({
    debit: {
      frozen: false,
      online: true,
      international: false,
      contactless: true
    },
    credit: {
      frozen: false,
      online: true,
      international: true,
      contactless: false
    }
  });

  const toggleDebit = (key: 'frozen' | 'online' | 'international' | 'contactless') => {
    setControls((prev) => ({
      ...prev,
      debit: {
        ...prev.debit,
        [key]: !prev.debit[key]
      }
    }));
  };

  const toggleCredit = (key: 'frozen' | 'online' | 'international' | 'contactless') => {
    setControls((prev) => ({
      ...prev,
      credit: {
        ...prev.credit,
        [key]: !prev.credit[key]
      }
    }));
  };

  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 space-y-8 animate-fadeIn">
        {/* Banner Section */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.02)]">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#F37021] font-bold">Portfolios</p>
          <h1 className="mt-2 text-4xl font-black text-slate-800 tracking-tight">Card Management</h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-3xl font-medium">
            Lock/unlock your debit and credit cards, adjust limits, and disable swipe configurations in real-time. In case of vishing threats, freeze card immediately.
          </p>
        </section>

        {/* Cards Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Card 1: RuPay Debit */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">RuPay Platinum Debit</h2>
            
            {/* Visual Card */}
            <div className={`rounded-3xl bg-gradient-to-tr from-[#0a1e36] via-[#102d52] to-[#1c4b82] p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between h-56 transition ${controls.debit.frozen ? 'grayscale opacity-75' : ''}`}>
              <div className="absolute right-0 bottom-0 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#F37021] font-black">Saathi Bank of India</p>
                  <p className="text-xs font-semibold text-white/70 mt-1">PLATINUM DEBIT</p>
                </div>
                {/* Chip */}
                <div className="w-9 h-7 rounded-md bg-amber-400/80 border border-amber-300 shadow-inner flex items-center justify-center">
                  <span className="w-5 h-4 border border-amber-500/25 rounded-xs"></span>
                </div>
              </div>

              <div>
                <p className="text-xl font-bold font-mono tracking-widest text-white/95">•••• •••• •••• 2287</p>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Daily Limit: ₹1,50,000.00</p>
              </div>

              <div className="flex justify-between items-end border-t border-white/10 pt-3 text-[10px] text-white/60">
                <div>
                  <p className="text-[8px] uppercase font-bold text-white/40">Card Holder</p>
                  <p className="font-bold text-white mt-0.5">ASHA MENON</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-400 uppercase tracking-widest">{controls.debit.frozen ? 'FROZEN' : 'ACTIVE'}</p>
                </div>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase border-b pb-3.5">Debit Controls</h3>
              
              {controlsList.map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-6 py-2 border-b last:border-0 border-slate-100 pb-3 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{item.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-semibold">{item.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleDebit(item.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      controls.debit[item.key] ? (item.key === 'frozen' ? 'bg-red-500' : 'bg-[#0B2545]') : 'bg-slate-200'
                    }`}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        controls.debit[item.key] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Card 2: Visa Select Credit */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Visa Select Credit Card</h2>
            
            {/* Visual Card */}
            <div className={`rounded-3xl bg-gradient-to-tr from-[#6b21a8] via-[#581c87] to-[#4c1d95] p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between h-56 transition ${controls.credit.frozen ? 'grayscale opacity-75' : ''}`}>
              <div className="absolute right-0 bottom-0 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-amber-400 font-black">Saathi Bank of India</p>
                  <p className="text-xs font-semibold text-white/70 mt-1">SELECT CREDIT</p>
                </div>
                {/* Chip */}
                <div className="w-9 h-7 rounded-md bg-amber-400/80 border border-amber-300 shadow-inner flex items-center justify-center">
                  <span className="w-5 h-4 border border-amber-500/25 rounded-xs"></span>
                </div>
              </div>

              <div>
                <p className="text-xl font-bold font-mono tracking-widest text-white/95">•••• •••• •••• 6643</p>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-300 font-semibold">Outstanding Balance: ₹24,860.00</p>
              </div>

              <div className="flex justify-between items-end border-t border-white/10 pt-3 text-[10px] text-white/60">
                <div>
                  <p className="text-[8px] uppercase font-bold text-white/40">Card Holder</p>
                  <p className="font-bold text-white mt-0.5">ASHA MENON</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-300 uppercase tracking-widest">{controls.credit.frozen ? 'FROZEN' : 'ACTIVE'}</p>
                </div>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase border-b pb-3.5">Credit Controls</h3>
              
              {controlsList.map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-6 py-2 border-b last:border-0 border-slate-100 pb-3 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{item.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-semibold">{item.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleCredit(item.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      controls.credit[item.key] ? (item.key === 'frozen' ? 'bg-red-500' : 'bg-[#0B2545]') : 'bg-slate-200'
                    }`}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        controls.credit[item.key] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </BankLayout>
  );
}