import Link from 'next/link';
import { bankName, featureCards, publicHighlights } from '@/lib/constants';

export default function HomePage() {
  return (
    <main className="min-h-screen text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-slate-200 bg-white/82 px-6 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.34em] text-bank-600">{bankName}</p>
            <p className="mt-1 text-sm text-slate-500">Internet banking for personal and joint accounts</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-medium">
            <Link href="/login" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              Sign in
            </Link>
            <Link href="/dashboard" className="rounded-full bg-slate-950 px-4 py-2 text-white transition hover:bg-[#081326]">
              Open dashboard
            </Link>
          </div>
        </header>

        <div className="grid gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-14">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-slate-300 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
              Secure access to everyday banking
            </div>
            <div className="max-w-3xl space-y-5">
              <h1 className="text-5xl leading-tight md:text-7xl">
                Banking that feels calm, precise, and ready for real life.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                Review balances, move money, pay beneficiaries, download statements, and manage cards from a polished internet banking portal built around clear navigation and fast decisions.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/login" className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#081326]">
                Sign in to your accounts
              </Link>
              <Link href="/support" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
                Contact support
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {publicHighlights.map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-[#081326] p-6 text-white shadow-[0_24px_70px_rgba(8,19,38,0.35)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Everyday account</p>
                <p className="mt-2 text-3xl font-semibold">INR 2,48,300.18</p>
                <p className="mt-1 text-sm text-white/68">Available balance in current account</p>
              </div>
              <div className="rounded-2xl bg-amber-400 px-4 py-2 text-sm font-semibold text-[#081326]">
                Verified
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                'Instant transfers',
                'Beneficiary book',
                'Scheduled bills',
                'Card controls'
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/7 px-4 py-3 text-sm text-white/84">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Next scheduled debit</span>
                <span>26 May</span>
              </div>
              <p className="mt-3 text-xl font-semibold">Electricity and broadband bundle</p>
              <p className="mt-2 text-sm text-white/70">Auto-pay enabled from the savings account ending 7310.</p>
            </div>
          </div>
        </div>

        <section className="grid gap-4 pb-10 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((card) => (
            <article key={card.title} className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur">
              <h2 className="text-2xl">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
