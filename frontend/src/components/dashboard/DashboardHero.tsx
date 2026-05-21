export function DashboardHero() {
  return (
    <div className="rounded-3xl bg-[#081326] px-6 py-8 text-white shadow-[0_24px_70px_rgba(8,19,38,0.25)]">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-white/55">Account overview</p>
          <h1 className="mt-3 text-4xl font-semibold md:text-5xl">Digital banking without clutter.</h1>
          <p className="mt-4 max-w-3xl text-white/78">Balance snapshots, payments, card controls, and statements live together in a calm, bank-grade workspace.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-white/55">Scheduled bills</p>
            <p className="mt-3 text-3xl font-semibold">06</p>
            <p className="mt-1 text-sm text-white/72">Payments queued this week</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-white/55">Avg response</p>
            <p className="mt-3 text-3xl font-semibold">142 ms</p>
            <p className="mt-1 text-sm text-white/72">Typical portal action time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
