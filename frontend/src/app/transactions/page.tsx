'use client';

import { useState } from 'react';
import { BankLayout } from '@/components/layout/BankLayout';
import { statementRows } from '@/lib/constants';

// Detailed Telemetry Audits for each transaction
const telemetryAudits: Record<string, {
  score: number;
  ip: string;
  location: string;
  device: string;
  latency: string;
  backspaces: number;
  pastes: number;
  hesitation: string;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  flags: string[];
}> = {
  'TXN-9911': {
    score: 14,
    ip: '192.168.1.105',
    location: 'Mumbai, MH (Home Network)',
    device: 'Apple iPhone 15 (iOS 17.4)',
    latency: '240ms (Baseline Sync)',
    backspaces: 1,
    pastes: 0,
    hesitation: '1.8 seconds',
    threatLevel: 'LOW',
    flags: ['Known Device Verified', 'Baseline Typing Match']
  },
  'TXN-9912': {
    score: 6,
    ip: '203.0.113.48',
    location: 'Axis Studio Corporate Gateway',
    device: 'Salary Payroll Automatic Routing Desk',
    latency: 'N/A (System Direct API)',
    backspaces: 0,
    pastes: 0,
    hesitation: '0.0 seconds',
    threatLevel: 'LOW',
    flags: ['ACH Settlement Protocol', 'Authorized Corporate Payee']
  },
  'TXN-9913': {
    score: 68,
    ip: '103.48.24.110',
    location: 'New Delhi, DL (Mobile Carrier IP)',
    device: 'Xiaomi Redmi Note 12 (Android 13)',
    latency: '95ms (Anxious/Irregular)',
    backspaces: 9,
    pastes: 2,
    hesitation: '7.4 seconds',
    threatLevel: 'HIGH',
    flags: ['High Backspace Count', 'Clipboard Paste Detected', 'Hesitation Signatures Match Active Scam Guide']
  },
  'TXN-9914': {
    score: 11,
    ip: '192.168.1.105',
    location: 'Mumbai, MH (Home Network)',
    device: 'Apple iPhone 15 (iOS 17.4)',
    latency: '290ms (Baseline Sync)',
    backspaces: 0,
    pastes: 0,
    hesitation: '1.2 seconds',
    threatLevel: 'LOW',
    flags: ['Known Bill Aggregator', 'Consistent Routing Address']
  },
  'TXN-9915': {
    score: 19,
    ip: '192.168.1.105',
    location: 'Mumbai, MH (Home Network)',
    device: 'Apple iPhone 15 (iOS 17.4)',
    latency: '225ms (Baseline Sync)',
    backspaces: 2,
    pastes: 0,
    hesitation: '2.1 seconds',
    threatLevel: 'LOW',
    flags: ['Registered Beneficiary Match']
  }
};

export default function TransactionsPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<string>('TXN-9913'); // Pre-select the warning one for demo visibility!
  const [downloadMsg, setDownloadMsg] = useState(false);

  const filteredRows = statementRows.filter(row => {
    const matchesSearch = row.beneficiary.toLowerCase().includes(search.toLowerCase()) || 
                          row.ref.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'All') return matchesSearch;
    return matchesSearch && row.status === filter;
  });

  const activeAudit = telemetryAudits[selectedTxn];

  const handleDownload = () => {
    setDownloadMsg(true);
    setTimeout(() => {
      setDownloadMsg(false);
    }, 4000);
  };

  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 space-y-8 animate-fadeIn">
        
        {/* Banner Section with Download Button */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.02)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#F37021] font-bold">Ledger</p>
              <h1 className="mt-2 text-4xl font-black text-slate-800 tracking-tight">Statement Ledger</h1>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-2xl font-medium">
                Review posted, pending, and scheduled transfers. Click on any record to inspect the captured Saathi AI Telemetry Guard Profile.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button 
                onClick={handleDownload}
                className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition duration-150 shadow-sm flex items-center gap-1.5"
              >
                <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Statement
              </button>
            </div>
          </div>
        </section>

        {downloadMsg && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 animate-fadeIn flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>Statement download initialized! A password-protected PDF (`statement_SB102.pdf`) has been generated and downloaded. Use your Customer ID to unlock it.</span>
          </div>
        )}

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          
          {/* Transaction Ledger Section */}
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#F37021] font-bold">Statements</p>
                <h2 className="mt-2 text-3xl font-semibold text-[#0B2545]">Transaction history</h2>
              </div>
            </div>

            {/* Filter controls */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {['All', 'Completed', 'Pending', 'Scheduled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                      filter === status
                        ? 'bg-[#0B2545] text-white shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="relative max-w-xs w-full">
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400 text-xs pl-8 font-semibold text-slate-800"
                  placeholder="Search beneficiary or ref..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">
                  <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Beneficiary</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredRows.length > 0 ? (
                    filteredRows.map((row) => {
                      const isSelected = selectedTxn === row.ref;
                      return (
                        <tr
                          key={row.ref}
                          onClick={() => setSelectedTxn(row.ref)}
                          className={`cursor-pointer transition ${
                            isSelected
                              ? 'bg-[#0B2545]/5 hover:bg-[#0B2545]/8 border-l-4 border-l-[#F37021]'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="px-4 py-4 text-slate-600 font-semibold">
                            <p>{row.date}</p>
                            <p className="text-[9px] text-slate-400 font-mono mt-0.5">{row.ref}</p>
                          </td>
                          <td className="px-4 py-4 font-bold text-slate-800">{row.beneficiary}</td>
                          <td className={`px-4 py-4 font-black ${row.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-800'}`}>
                            {row.amount}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider border ${
                              row.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              row.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              'bg-indigo-50 text-indigo-700 border-indigo-100'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-slate-400 font-semibold">
                        No transactions match the criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Audit Inspector Panel */}
          <aside className="space-y-6">
            {activeAudit ? (
              <section className="rounded-[2rem] border border-slate-800 bg-[#060D1A] p-6 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[460px] animate-fadeIn">
                <div className="absolute inset-0 bg-scanline pointer-events-none opacity-[0.03]"></div>
                
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#F37021] font-bold">Saathi Audit Inspector</p>
                      <h2 className="text-lg font-bold text-white mt-0.5 font-sans">Session telemetry profile</h2>
                    </div>
                    <span className="text-[10px] font-mono text-[#F37021] font-semibold">{selectedTxn}</span>
                  </div>

                  {/* Dial risk gauge */}
                  <div className="mt-5 flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4">
                    <div className="relative w-14 h-14 rounded-full border-4 border-slate-800 flex items-center justify-center font-bold font-mono">
                      <span className={`text-base ${
                        activeAudit.threatLevel === 'HIGH' ? 'text-red-400' :
                        activeAudit.threatLevel === 'MEDIUM' ? 'text-amber-400' :
                        'text-emerald-400'
                      }`}>
                        {activeAudit.score}%
                      </span>
                      {/* Ring arc */}
                      <span className={`absolute inset-[-4px] rounded-full border-4 border-transparent ${
                        activeAudit.threatLevel === 'HIGH' ? 'border-t-red-500 border-r-red-500' : 'border-t-emerald-400'
                      }`} />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Evaluation Risk Index</p>
                      <p className="text-sm font-extrabold mt-0.5 tracking-tight flex items-center gap-1.5 font-sans">
                        {activeAudit.threatLevel === 'HIGH' ? (
                          <>
                            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-red-400 uppercase">Scam Suspected (Blocked)</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span className="text-emerald-400 uppercase">Session Secure (Passed)</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="mt-5 space-y-2.5 text-xs border-t border-white/5 pt-4">
                    <div className="flex justify-between">
                      <span className="text-white/40">Bound IP Address:</span>
                      <span className="font-semibold font-mono">{activeAudit.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">IP Region Trace:</span>
                      <span className="font-semibold">{activeAudit.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Verified Device:</span>
                      <span className="font-semibold text-white/90 truncate max-w-[200px]">{activeAudit.device}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Typing Latency:</span>
                      <span className="font-semibold font-mono">{activeAudit.latency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Backspace Count:</span>
                      <span className="font-semibold">{activeAudit.backspaces} keypresses</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Clipboard Pastes:</span>
                      <span className="font-semibold">{activeAudit.pastes} edits</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Hesitation Delay:</span>
                      <span className="font-semibold">{activeAudit.hesitation}</span>
                    </div>
                  </div>
                </div>

                {/* Detected Badges */}
                <div className="mt-6 border-t border-white/5 pt-4">
                  <p className="text-[9px] uppercase font-bold text-white/40 tracking-wider mb-2.5">Security Audit Indicators</p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeAudit.flags.map((flag, idx) => (
                      <span
                        key={idx}
                        className={`rounded-lg px-2 py-1 text-[9px] font-bold border ${
                          activeAudit.threatLevel === 'HIGH'
                            ? 'bg-red-500/10 border-red-500/20 text-red-400'
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-slate-300 p-8 text-center text-slate-500 text-xs font-semibold">
                Select a transaction row to view detailed telemetry metrics and threat analysis records.
              </div>
            )}
          </aside>

        </div>
      </main>
    </BankLayout>
  );
}
