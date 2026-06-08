'use client';

import { useState } from 'react';
import { BankLayout } from '@/components/layout/BankLayout';
import { statementRows } from '@/lib/constants';

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Pending' | 'Scheduled'>('All');
  const [downloadMsg, setDownloadMsg] = useState(false);

  // Filter logic
  const filteredRows = statementRows.filter((row) => {
    const matchesSearch = row.beneficiary.toLowerCase().includes(search.toLowerCase()) ||
                          row.ref.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' ? true : row.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDownload = () => {
    setDownloadMsg(true);
    setTimeout(() => {
      setDownloadMsg(false);
    }, 4000);
  };

  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 space-y-8 animate-fadeIn">
        {/* Banner Section */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.02)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#F37021] font-bold">Ledger</p>
              <h1 className="mt-2 text-4xl font-black text-slate-800 tracking-tight">Statement Ledger</h1>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-2xl font-medium">
                Review posted, pending, and scheduled transfers. Statement files are securely encrypted for download.
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
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-955 animate-fadeIn flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>Statement download initialized! A password-protected PDF (`statement_SB102.pdf`) has been generated and downloaded. Use your Customer ID to unlock it.</span>
          </div>
        )}

        {/* Statements Table Card */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute left-4 top-3 text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input 
                className="w-full rounded-2xl border border-slate-200 pl-10 pr-4 py-2.5 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/15 text-slate-800 text-xs font-semibold"
                placeholder="Search by beneficiary or ref ID..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-semibold text-slate-500">
              {(['All', 'Completed', 'Pending', 'Scheduled'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`rounded-md px-3.5 py-1.5 shadow-xs transition ${statusFilter === filter ? 'bg-white text-slate-800' : 'hover:text-slate-800'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs font-medium">
              <thead className="bg-slate-50/75 text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4">Ref Transaction ID</th>
                  <th className="px-5 py-4">Posting Date</th>
                  <th className="px-5 py-4">Beneficiary details</th>
                  <th className="px-5 py-4 text-right">Amount (INR)</th>
                  <th className="px-5 py-4 text-center">Settlement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                {filteredRows.length > 0 ? (
                  filteredRows.map((row) => {
                    const isCredit = row.amount.startsWith('+');
                    return (
                      <tr key={row.ref} className="hover:bg-slate-50/50 transition">
                        <td className="px-5 py-4 font-mono text-[10px] font-bold text-slate-800">{row.ref}</td>
                        <td className="px-5 py-4 font-semibold">{row.date}</td>
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-800">{row.beneficiary}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Linked transfer rail</p>
                        </td>
                        <td className={`px-5 py-4 text-right font-black text-sm ${isCredit ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {row.amount}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider ${
                            row.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' : 
                            row.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-200/50' :
                            'bg-indigo-50 text-indigo-600 border border-indigo-200/50'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-xs text-slate-400 font-semibold">No records match the current criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </BankLayout>
  );
}
