import { BankLayout } from '@/components/layout/BankLayout';
import { supportTopics } from '@/lib/constants';

export default function SupportPage() {
  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <p className="text-xs uppercase tracking-[0.28em] text-bank-600">Support</p>
            <h1 className="mt-2 text-4xl">We are here to help</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Reach the branch, call center, or digital support channel that fits the request.
            </p>
            <div className="mt-6 space-y-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Contact options</p>
              <p>Call center: 1800 123 4444</p>
              <p>Secure message inbox: support@saathibank.gov.in</p>
              <p>Branch hours: 9:30 AM to 4:30 PM, Monday to Saturday</p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <h2 className="text-3xl">Common requests</h2>
            <div className="mt-6 space-y-4">
              {supportTopics.map((item) => (
                <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </BankLayout>
  );
}