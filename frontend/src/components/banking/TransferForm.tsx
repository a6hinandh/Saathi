'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { accountCards, payees } from '@/lib/constants';

export function TransferForm() {
  const [fromAccount, setFromAccount] = useState(accountCards[0].name);
  const [payee, setPayee] = useState(payees[0].name);
  const [amount, setAmount] = useState('18500');
  const [reference, setReference] = useState('School fee payment');
  const [schedule, setSchedule] = useState('immediate');
  const [confirmed, setConfirmed] = useState(false);

  const selectedAccount = accountCards.find((item) => item.name === fromAccount) ?? accountCards[0];
  const selectedPayee = payees.find((item) => item.name === payee) ?? payees[0];

  const submit = () => {
    setConfirmed(true);
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-bank-600">Payments</p>
            <h1 className="mt-2 text-4xl">Transfer funds</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Choose the source account, verify the beneficiary, and complete the transfer with the authentication step your bank requires.
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Daily limit INR 1,50,000
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
            Source account
            <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" value={fromAccount} onChange={(event) => setFromAccount(event.target.value)}>
              {accountCards.map((account) => (
                <option key={account.name} value={account.name}>
                  {account.name} - {account.number}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
            Beneficiary
            <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" value={payee} onChange={(event) => setPayee(event.target.value)}>
              {payees.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name} - {item.account}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Amount
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="numeric" placeholder="18500" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Transfer mode
            <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" value={schedule} onChange={(event) => setSchedule(event.target.value)}>
              <option value="immediate">Immediate payment</option>
              <option value="scheduled">Schedule for later</option>
              <option value="recurring">Recurring transfer</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
            Reference note
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" value={reference} onChange={(event) => setReference(event.target.value)} placeholder="School fee payment" />
          </label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'From', value: selectedAccount.number },
            { label: 'To', value: selectedPayee.account },
            { label: 'Mode', value: schedule.replace(/^[a-z]/, (letter) => letter.toUpperCase()) }
          ].map((item) => (
            <div key={item.label} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button className="bg-slate-950 text-white hover:bg-[#081326]" onClick={submit}>
            Review transfer
          </Button>
          <Link href="/beneficiary" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            Manage payees
          </Link>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-xs uppercase tracking-[0.28em] text-bank-600">Transfer review</p>
          <h2 className="mt-2 text-2xl">Confirm before sending</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Northfield Bank will show a confirmation step before the payment is submitted. Your summary appears here for a final check.
          </p>

          <div className="mt-5 space-y-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="flex items-center justify-between gap-4">
              <span>Beneficiary</span>
              <span className="font-semibold text-slate-900">{selectedPayee.name}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Account</span>
              <span className="font-semibold text-slate-900">{selectedPayee.account}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Amount</span>
              <span className="font-semibold text-slate-900">INR {Number(amount || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Reference</span>
              <span className="font-semibold text-slate-900">{reference}</span>
            </div>
          </div>

          {confirmed ? (
            <div className="mt-5 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
              Transfer prepared for authentication. Review the code sent to your registered device to complete the payment.
            </div>
          ) : (
            <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
              Choose a payee, confirm the source account, and review the amount before continuing.
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-[#081326] p-6 text-white shadow-[0_18px_50px_rgba(8,19,38,0.22)]">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Payment rail</p>
          <div className="mt-4 grid gap-3">
            {['UPI for instant transfers', 'IMPS for same-day settlements', 'NEFT for scheduled outflows'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/82">
                {item}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
