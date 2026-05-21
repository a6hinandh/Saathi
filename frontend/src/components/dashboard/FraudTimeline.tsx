interface FraudTimelineProps {
  events: Array<{
    title: string;
    detail: string;
    time: string;
    tone: 'safe' | 'warn' | 'block';
  }>;
}

const ringClasses = {
  safe: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  warn: 'border-amber-300 bg-amber-50 text-amber-700',
  block: 'border-red-300 bg-red-50 text-red-700'
};

export function FraudTimeline({ events }: FraudTimelineProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Decision timeline</h2>
      <div className="mt-6 space-y-4">
        {events.map((event) => (
          <div key={`${event.title}-${event.time}`} className="flex gap-4">
            <div className={`mt-1 h-3 w-3 rounded-full border ${ringClasses[event.tone]}`} />
            <div className="flex-1 border-b border-slate-100 pb-4 last:border-none">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-slate-900">{event.title}</p>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{event.time}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{event.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
