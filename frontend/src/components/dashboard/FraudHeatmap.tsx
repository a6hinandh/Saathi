interface FraudHeatmapProps {
  cells: Array<{
    label: string;
    value: number;
    detail: string;
  }>;
}

export function FraudHeatmap({ cells }: FraudHeatmapProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#0B2545]">Fraud heatmap</h2>
          <p className="mt-1 text-sm text-slate-500">Risk concentration across active behavior signals.</p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Live</div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {cells.map((cell) => {
          const intensity = Math.max(12, Math.min(100, cell.value));
          return (
            <div
              key={cell.label}
              className="rounded-3xl p-4 text-white shadow-sm"
              style={{ background: `linear-gradient(135deg, rgba(6,22,52,0.95), rgba(22,63,159,${intensity / 100}))` }}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-blue-100/70">{cell.label}</p>
              <p className="mt-4 text-3xl font-semibold">{cell.value}</p>
              <p className="mt-2 text-sm text-blue-50/80">{cell.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
