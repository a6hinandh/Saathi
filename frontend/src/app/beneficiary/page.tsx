'use client';

import { useState } from 'react';
import { BankLayout } from '@/components/layout/BankLayout';
import { payees as initialPayees } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

export default function BeneficiaryPage() {
  const [payeeList, setPayeeList] = useState(initialPayees);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'upi' | 'bank'>('all');

  // Add Payee Form State
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [bank, setBank] = useState('');
  const [label, setLabel] = useState('Active');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleAddPayee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !account) return;

    const newPayee = {
      name,
      account,
      bank: bank || 'Saathi Bank of India',
      label
    };

    setPayeeList([newPayee, ...payeeList]);
    setSuccessMsg(true);

    // Clear form
    setName('');
    setAccount('');
    setBank('');
    setLabel('Active');

    setTimeout(() => {
      setSuccessMsg(false);
    }, 4000);
  };

  // Filter Payees
  const filteredPayees = payeeList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.account.toLowerCase().includes(search.toLowerCase());
    
    const isUPI = item.account.includes('UPI:');
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'upi') return matchesSearch && isUPI;
    if (activeFilter === 'bank') return matchesSearch && !isUPI;
    
    return matchesSearch;
  });

  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 space-y-8 animate-fadeIn">
        {/* Banner Section */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.02)]">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#F37021] font-bold">Payee Book</p>
          <h1 className="mt-2 text-4xl font-black text-slate-800 tracking-tight">Beneficiaries</h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-3xl font-medium">
            Register and manage your trusted recipients. Newly added beneficiaries undergo a cooling-off limit safety rule to secure transactions.
          </p>
        </section>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Add Payee Form */}
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#F37021]">Secure register</p>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Add Beneficiary</h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold leading-relaxed">
                Add a new saved account or UPI ID. Verification signals are collected to prevent spoofing.
              </p>
            </div>

            {successMsg && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-900 animate-fadeIn flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>Payee successfully registered! The payee is now active for transfers.</span>
              </div>
            )}

            <form onSubmit={handleAddPayee} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">Full Name</label>
                  <input 
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/15 text-slate-800 text-xs font-semibold"
                    placeholder="e.g. Maya Fernandes" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">UPI ID or Account Number</label>
                  <input 
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/15 text-slate-800 text-xs font-semibold"
                    placeholder="e.g. UPI: maya@upi or A/c: 102948210" 
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">Bank Name & Branch (IFSC)</label>
                <input 
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/15 text-slate-800 text-xs font-semibold"
                  placeholder="e.g. ICICI Bank Ltd (ICIC0000048)" 
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">Safety Label</label>
                <select 
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/15 text-slate-800 text-xs font-semibold"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                >
                  <option value="Verified">Verified Friend/Family</option>
                  <option value="Active">Standard Payee</option>
                  <option value="Trusted">Pre-Authorized Trusted</option>
                </select>
              </div>

              <Button type="submit" className="w-full bg-[#0B2545] text-white hover:bg-[#134074] py-3 text-xs tracking-wider font-extrabold uppercase">
                Save Beneficiary
              </Button>
            </form>
          </section>

          {/* Payee List Panel */}
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#F37021]">Address Book</p>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Saved Payees</h2>
              </div>
              <span className="rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-bold text-slate-500">
                {payeeList.length} total
              </span>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input 
                  className="w-full rounded-2xl border border-slate-200 pl-10 pr-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/15 text-slate-800 text-xs font-semibold"
                  placeholder="Search payees by name or details..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-semibold text-slate-500 max-w-max">
                <button 
                  onClick={() => setActiveFilter('all')}
                  className={`rounded-md px-3.5 py-1 shadow-xs transition ${activeFilter === 'all' ? 'bg-white text-slate-800' : 'hover:text-slate-800'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setActiveFilter('upi')}
                  className={`rounded-md px-3.5 py-1 shadow-xs transition ${activeFilter === 'upi' ? 'bg-white text-slate-800' : 'hover:text-slate-800'}`}
                >
                  UPI Accounts
                </button>
                <button 
                  onClick={() => setActiveFilter('bank')}
                  className={`rounded-md px-3.5 py-1 shadow-xs transition ${activeFilter === 'bank' ? 'bg-white text-slate-800' : 'hover:text-slate-800'}`}
                >
                  Bank Accounts
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredPayees.length > 0 ? (
                filteredPayees.map((item) => {
                  const initial = item.name.charAt(0);
                  const isUPI = item.account.includes('UPI:');
                  return (
                    <article key={item.name} className="rounded-2xl border border-slate-200/60 bg-slate-50/20 p-4 hover:bg-slate-50 transition duration-150 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300/60 flex items-center justify-center font-black text-slate-600 text-sm">
                          {initial}
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-800 leading-snug">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5">{item.account}</p>
                          <p className="text-[9px] text-slate-400 font-medium leading-relaxed mt-1 line-clamp-1">{item.bank}</p>
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider ${
                        item.label === 'Trusted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' : 
                        item.label === 'Verified' ? 'bg-cyan-50 text-cyan-600 border border-cyan-200/50' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {item.label}
                      </span>
                    </article>
                  );
                })
              ) : (
                <div className="py-12 text-center text-xs text-slate-400 font-semibold">No beneficiaries found matching the query.</div>
              )}
            </div>
          </section>
        </div>
      </main>
    </BankLayout>
  );
}
