'use client';

import { useState } from 'react';
import { BankLayout } from '@/components/layout/BankLayout';
import { payees as initialPayees } from '@/lib/constants';

export default function BeneficiaryPage() {
  const [payeeList, setPayeeList] = useState(initialPayees);
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [bank, setBank] = useState('');
  const [nickname, setNickname] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLabel, setFilterLabel] = useState('All');
  
  // Simulated AI scanner states
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [successToast, setSuccessToast] = useState('');
  const [successToastType, setSuccessToastType] = useState<'success' | 'delete'>('success');

  const handleAddPayee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !account || !bank) return;

    setIsScanning(true);
    setScanStep(1);

    // Simulate Saathi Trust-Score Scan steps
    setTimeout(() => {
      setScanStep(2);
    }, 800);

    setTimeout(() => {
      setScanStep(3);
    }, 1600);

    setTimeout(() => {
      const isUpi = account.includes('@') || account.toLowerCase().includes('upi');
      const formattedAccount = isUpi 
        ? (account.toUpperCase().startsWith('UPI:') ? account : `UPI: ${account}`)
        : (account.toUpperCase().startsWith('A/C:') ? account : `A/c: ${account}`);
      
      const newPayee = {
        name,
        account: formattedAccount,
        bank: bank + (nickname ? ` (${nickname})` : ''),
        label: isUpi ? 'Verified' : 'Active'
      };

      setPayeeList([newPayee, ...payeeList]);
      setName('');
      setAccount('');
      setBank('');
      setNickname('');
      setIsScanning(false);
      setSuccessToastType('success');
      setSuccessToast(`${name} has been successfully screened and added to your safe beneficiaries.`);
      
      // Auto-dismiss toast
      setTimeout(() => {
        setSuccessToast('');
      }, 5000);
    }, 2400);
  };

  const handleDeletePayee = (nameToDelete: string) => {
    setPayeeList(payeeList.filter(item => item.name !== nameToDelete));
    setSuccessToastType('delete');
    setSuccessToast(`Payee "${nameToDelete}" has been removed from your list.`);
    setTimeout(() => {
      setSuccessToast('');
    }, 3000);
  };

  // Filter list
  const filteredPayees = payeeList.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bank.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (filterLabel === 'All') return matchesSearch;
    return matchesSearch && item.label === filterLabel;
  });

  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Success Toast */}
        {successToast && (
          <div className={`mb-6 p-4 rounded-2xl border ${
            successToastType === 'delete' 
              ? 'bg-amber-50 border-amber-200 text-amber-800' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          } text-sm font-medium shadow-md animate-fadeIn flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              {successToastType === 'delete' ? (
                <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast('')} className="text-slate-500 hover:text-slate-800 text-lg font-bold pl-3">×</button>
          </div>
        )}

        <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] relative overflow-hidden">
            {isScanning && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-10 flex flex-col items-center justify-center text-center p-6 text-white animate-fadeIn">
                <div className="relative flex items-center justify-center">
                  {/* Glowing scanner ring */}
                  <div className="w-16 h-16 border-4 border-[#F37021]/30 border-t-[#F37021] rounded-full animate-spin"></div>
                  <div className="absolute text-2xl animate-pulse text-[#F37021]">
                    <svg className="w-6 h-6 text-[#F37021] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-bold text-[#F37021] tracking-wide">Saathi AI Shield Guard</h3>
                
                <div className="mt-4 max-w-xs space-y-2 text-sm text-slate-300 font-mono">
                  <div className={`flex items-center gap-2 justify-center transition-opacity duration-300 ${scanStep >= 1 ? 'opacity-100 font-semibold text-emerald-400' : 'opacity-30'}`}>
                    <span>•</span> Performing Beneficiary IP & Routing Audit
                  </div>
                  <div className={`flex items-center gap-2 justify-center transition-opacity duration-300 ${scanStep >= 2 ? 'opacity-100 font-semibold text-emerald-400' : 'opacity-30'}`}>
                    <span>•</span> Checking NPCI Mule Database Registry
                  </div>
                  <div className={`flex items-center gap-2 justify-center transition-opacity duration-300 ${scanStep >= 3 ? 'opacity-100 font-semibold text-emerald-400' : 'opacity-30'}`}>
                    <span>•</span> Binding Telemetry Encryption keys
                  </div>
                </div>
                
                <p className="mt-8 text-xs text-slate-400 italic">Safeguarding your funds from coercion scams...</p>
              </div>
            )}

            <p className="text-xs uppercase tracking-[0.28em] text-[#F37021] font-bold">Payees</p>
            <h1 className="mt-2 text-4xl font-semibold text-[#0B2545]">Manage beneficiaries</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 font-medium">
              Save trusted recipients, review the account details, and keep your payment book ready for faster, secure transfers.
            </p>

            <form onSubmit={handleAddPayee} className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Beneficiary Name</label>
                <input
                  required
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 text-sm font-semibold text-slate-800"
                  placeholder="e.g. Maya Fernandes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">UPI ID or Account Number</label>
                <input
                  required
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 text-sm font-semibold text-slate-800"
                  placeholder="e.g. name@upi or 1234567890"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bank Name & IFSC</label>
                <input
                  required
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 text-sm font-semibold text-slate-800"
                  placeholder="e.g. HDFC Bank Ltd (HDFC00001)"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nickname (Optional)</label>
                <input
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 text-sm font-semibold text-slate-800"
                  placeholder="e.g. Family, Office"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isScanning}
                className="mt-2 rounded-full bg-[#0B2545] hover:bg-[#134074] transition px-5 py-3.5 font-bold uppercase tracking-wider text-white md:col-span-2 shadow-md shadow-[#0B2545]/20 disabled:opacity-50 text-xs"
              >
                Evaluate & Save Beneficiary
              </button>
            </form>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#F37021] font-bold">Saved recipients</p>
                <h2 className="mt-2 text-3xl font-semibold text-[#0B2545]">Trusted payee list</h2>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-[#0B2545]">
                {filteredPayees.length} matching
              </span>
            </div>

            {/* Filter and Search Controls */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2 relative">
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 outline-none transition focus:border-slate-400 text-xs pl-8 font-semibold text-slate-800"
                  placeholder="Search by name, UPI or bank..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">
                  <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>
              <select
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-slate-400 text-xs font-bold text-slate-700"
                value={filterLabel}
                onChange={(e) => setFilterLabel(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Verified">Verified</option>
                <option value="Trusted">Trusted</option>
                <option value="Active">Active</option>
              </select>
            </div>

            {/* Payee List Display */}
            <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {filteredPayees.length > 0 ? (
                filteredPayees.map((item) => (
                  <article key={item.name} className="group rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:shadow-md hover:border-slate-300 relative overflow-hidden flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-[#F37021] transition">{item.name}</p>
                        <p className="mt-1 text-xs font-mono text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-md inline-block">{item.account}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm border ${
                          item.label === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          item.label === 'Trusted' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {item.label}
                        </span>
                        <button
                          onClick={() => handleDeletePayee(item.name)}
                          className="text-slate-400 hover:text-red-500 p-1.5 transition rounded-lg hover:bg-red-50 flex items-center justify-center"
                          title="Delete payee"
                        >
                          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-500 font-bold">{item.bank}</p>
                  </article>
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-3xl text-slate-400 text-xs font-bold">
                  No beneficiaries match the current filter or search criteria.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </BankLayout>
  );
}
