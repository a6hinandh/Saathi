import { BankLayout } from '@/components/layout/BankLayout';
import { cardPortfolio } from '@/lib/constants';

export default function CardsPage() {
  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-xs uppercase tracking-[0.28em] text-bank-600">Cards</p>
          <h1 className="mt-2 text-4xl">Card controls</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Review debit and credit cards, manage limits, and keep everyday spending under control.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {cardPortfolio.map((card) => (
              <article key={card.name} className="rounded-[2rem] border border-slate-200 bg-[#081326] p-6 text-white shadow-[0_24px_60px_rgba(8,19,38,0.22)]">
                <p className="text-xs uppercase tracking-[0.26em] text-white/45">{card.status}</p>
                <h2 className="mt-3 text-2xl">{card.name}</h2>
                <p className="mt-2 text-sm text-white/68">{card.number}</p>
                <p className="mt-6 text-lg font-medium text-white/86">{card.limit}</p>
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  {['Freeze card', 'Set travel notice', 'Change PIN', 'Raise limit'].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-white/80">
                      {item}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </BankLayout>
  );
}