interface FraudOverviewCardsProps {
  cards: Array<{
    label: string;
    value: string;
    hint: string;
    tone: 'safe' | 'warn' | 'block';
  }>;
}

const toneMap = {
  safe: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warn: 'border-amber-200 bg-amber-50 text-amber-900',
  block: 'border-red-200 bg-red-50 text-red-900'
};

export function FraudOverviewCards({ cards }: FraudOverviewCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-3xl border p-5 shadow-sm ${toneMap[card.tone]}`}>
          <p className="text-sm font-medium opacity-70">{card.label}</p>
          <p className="mt-3 text-3xl font-semibold">{card.value}</p>
          <p className="mt-2 text-sm opacity-80">{card.hint}</p>
        </div>
      ))}
    </div>
  );
}
