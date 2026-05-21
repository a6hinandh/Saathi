import { BankLayout } from '@/components/layout/BankLayout';
import { payees } from '@/lib/constants';

export default function BeneficiaryPage() {
  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <p className="text-xs uppercase tracking-[0.28em] text-bank-600">Payees</p>
            <h1 className="mt-2 text-4xl">Manage beneficiaries</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Save trusted recipients, review the account details, and keep your payment book ready for faster transfers.
            </p>

            <form className="mt-8 grid gap-4 md:grid-cols-2">
              <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" placeholder="Beneficiary name" defaultValue="Maya Fernandes" />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" placeholder="UPI ID or account number" defaultValue="maya.fernandes@upi" />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" placeholder="Bank name" defaultValue="Northfield Bank" />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" placeholder="Nickname" defaultValue="Family" />
              <button className="rounded-full bg-slate-950 px-5 py-3 font-semibold text-white md:col-span-2">
                Save beneficiary
              </button>
            </form>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-bank-600">Saved recipients</p>
                <h2 className="mt-2 text-3xl">Trusted payee list</h2>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                {payees.length} active
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {payees.map((item) => (
                <article key={item.name} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.account}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">{item.label}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">{item.bank}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </BankLayout>
  );
}
