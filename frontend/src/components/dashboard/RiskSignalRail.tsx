interface RiskSignalRailProps {
  signals: Array<{
    label: string;
    score: number;
    tone: 'safe' | 'warn' | 'block';
  }>;
}

const toneClasses = {
  safe: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  warn: 'bg-amber-500/10 text-amber-700 border-amber-200',
  block: 'bg-red-500/10 text-red-700 border-red-200'
};

export function RiskSignalRail({ signals }: RiskSignalRailProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[#0B2545]">Component scores</h2>
      <div className="mt-5 space-y-4">
        {signals.map((signal) => (
          <div key={signal.label} className={`rounded-2xl border px-4 py-3 ${toneClasses[signal.tone]}`}>
            <div className="flex items-center justify-between text-sm font-medium">
              <span>{signal.label}</span>
              <span>{signal.score}</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-200/70">
              <div className="h-2 rounded-full bg-current" style={{ width: `${Math.min(100, signal.score * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
