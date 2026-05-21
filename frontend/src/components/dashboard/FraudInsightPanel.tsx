interface FraudInsightPanelProps {
  title: string;
  summary: string;
  bullets: string[];
}

export function FraudInsightPanel({ title, summary, bullets }: FraudInsightPanelProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm uppercase tracking-[0.24em] text-bank-600">Explainability</p>
      <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">{summary}</p>
      <ul className="mt-5 space-y-3 text-sm text-slate-600">
        {bullets.map((bullet) => (
          <li key={bullet} className="rounded-2xl bg-slate-50 px-4 py-3">{bullet}</li>
        ))}
      </ul>
    </div>
  );
}
