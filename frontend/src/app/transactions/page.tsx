import { BankLayout } from '@/components/layout/BankLayout';
import { statementRows } from '@/lib/constants';

export default function TransactionsPage() {
  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-bank-600">Statements</p>
              <h1 className="mt-2 text-4xl">Transaction history</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Review posted, pending, and scheduled payments for the last statement cycle.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                Filter
              </button>
              <button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                Download statement
              </button>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Beneficiary</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {statementRows.map((row) => (
                  <tr key={row.ref}>
                    <td className="px-4 py-4 text-slate-600">{row.date}</td>
                    <td className="px-4 py-4 font-medium text-slate-900">{row.beneficiary}</td>
                    <td className="px-4 py-4 font-semibold text-slate-900">{row.amount}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </BankLayout>
  );
}
