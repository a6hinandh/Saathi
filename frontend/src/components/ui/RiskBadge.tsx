interface RiskBadgeProps {
  level: string;
}

export function RiskBadge({ level }: RiskBadgeProps) {
  const tone =
    level === 'CRITICAL'
      ? 'bg-red-500/15 text-red-200 border-red-500/30'
      : level === 'HIGH'
        ? 'bg-amber-500/15 text-amber-200 border-amber-500/30'
        : level === 'MEDIUM'
          ? 'bg-yellow-500/15 text-yellow-100 border-yellow-500/30'
          : 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30';

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${tone}`}>{level}</span>;
}
