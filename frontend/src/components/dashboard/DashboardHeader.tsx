import Link from 'next/link';

export function DashboardHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-bank-600">Northfield Bank</p>
          <h1 className="text-3xl font-semibold text-slate-900">Digital banking dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/transfer" className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">New transfer</Link>
          <Link href="/security" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold">Security center</Link>
        </div>
      </div>
    </header>
  );
}
