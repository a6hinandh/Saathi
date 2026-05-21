interface BehaviorTracePanelProps {
  title: string;
  details: string[];
}

export function BehaviorTracePanel({ title, details }: BehaviorTracePanelProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-slate-600">
        {details.map((item) => (
          <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">{item}</li>
        ))}
      </ul>
    </div>
  );
}
