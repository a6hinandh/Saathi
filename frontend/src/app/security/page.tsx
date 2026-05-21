import { BankLayout } from '@/components/layout/BankLayout';
import { securityItems } from '@/lib/constants';

export default function SecurityPage() {
  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-[#081326] p-8 text-white shadow-[0_24px_60px_rgba(8,19,38,0.22)]">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Security center</p>
            <h1 className="mt-2 text-4xl">Protect your session</h1>
            <p className="mt-3 text-sm leading-6 text-white/72">
              Review login methods, session settings, and alert preferences from one place.
            </p>
            <div className="mt-6 grid gap-3">
              {['Two-factor authentication', 'Trusted devices', 'Session timeout', 'Alert thresholds'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/82">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <h2 className="text-3xl">Security settings</h2>
            <div className="mt-6 space-y-4">
              {securityItems.map((item) => (
                <article key={item} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                  {item}
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </BankLayout>
  );
}