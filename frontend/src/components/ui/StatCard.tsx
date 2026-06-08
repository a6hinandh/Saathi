interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  accent?: 'primary' | 'warning' | 'success' | 'info';
}

export function StatCard({ label, value, hint, accent = 'primary' }: StatCardProps) {
  const accentColors = {
    primary: 'border-t-4 border-t-[#0B2545]',
    warning: 'border-t-4 border-t-[#F37021]',
    success: 'border-t-4 border-t-emerald-500',
    info: 'border-t-4 border-t-cyan-500'
  };

  return (
    <div className={`rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.03)] transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${accentColors[accent]}`}>
      <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-800 tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500 font-semibold">{hint}</p> : null}
    </div>
  );
}
