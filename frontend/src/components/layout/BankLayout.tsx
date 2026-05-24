import Link from 'next/link';
import type { ReactNode } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/accounts', label: 'Accounts' },
  { href: '/transfer', label: 'Payments' },
  { href: '/beneficiary', label: 'Payees' },
  { href: '/transactions', label: 'Statements' },
  { href: '/cards', label: 'Cards' },
  { href: '/security', label: 'Security' },
  { href: '/support', label: 'Support' },
  { href: '/settings', label: 'Settings' }
];

export function BankLayout({ children }: { children: ReactNode }) {
  // Use static date representing current demo date
  const lastLoginTime = '22 May 2026, 10:15:42 IST';

  return (
    <div className="min-h-screen bg-[#f3f5f8] text-slate-900 font-sans">
      {/* Top running safety notification */}
      <div className="bg-[#F37021] text-white py-1 px-4 text-xs font-semibold overflow-hidden border-b border-[#E05A17]">
        <div className="animate-marquee inline-flex gap-16">
          <span>🛡️ Safety Alert: Do not share OTP or UPI PIN with callers claiming to be Bank Managers or Police.</span>
          <span>🔒 Remember: Bank never demands money or transfer verification for unblocking accounts.</span>
          <span>📞 Report Cyber Crimes instantly by calling Toll-Free 1930.</span>
          {/* Duplicate */}
          <span>🛡️ Safety Alert: Do not share OTP or UPI PIN with callers claiming to be Bank Managers or Police.</span>
          <span>🔒 Remember: Bank never demands money or transfer verification for unblocking accounts.</span>
          <span>📞 Report Cyber Crimes instantly by calling Toll-Free 1930.</span>
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-24px)] xl:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-[#081220] text-white xl:border-b-0 xl:border-r xl:border-slate-800">
          <div className="flex h-full flex-col justify-between px-6 py-8 lg:px-7">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-[#081220] shadow-lg font-bold text-base">
                  SB
                </div>
                <div>
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-[#F37021]">Saathi Bank</p>
                  <p className="text-sm font-semibold tracking-tight text-white/90">Internet Banking</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-5 text-white/50">
                A Govt of India Undertaking. Adaptive AI security enabled on this retail netbanking portal.
              </p>
              <nav className="mt-8 space-y-1.5">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-xl border border-white/0 bg-white/0 px-4 py-2.5 text-xs font-semibold text-white/70 transition hover:border-[#F37021]/30 hover:bg-white/5 hover:text-white"
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] text-white/30 font-medium">Open</span>
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="mt-8 space-y-4">
              {/* Switch to Admin Badge */}
              <Link href="/admin" className="group block rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur transition hover:border-[#F37021]/30 hover:bg-white/8">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F37021]/15 text-[#F37021] transition group-hover:bg-[#F37021]/25">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">Fraud Analyst</p>
                    <p className="text-xs font-semibold text-white/80 mt-0.5 group-hover:text-white transition">Risk Dashboard</p>
                  </div>
                </div>
              </Link>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur">
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">Secure Session</p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-white/60">Protection Level</p>
                    <p className="mt-1 text-lg font-bold text-emerald-400">AI Guarded</p>
                  </div>
                  <div className="rounded-lg bg-emerald-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                    Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
        
        <div className="flex min-h-[calc(100vh-24px)] flex-col">
          <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#F37021]">Secure NetBanking Session</p>
                <p className="mt-1 text-xs text-slate-500 font-medium">Customer ID: 10021487 (SB-102)</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden md:block text-right">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Last login trace</p>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">{lastLoginTime}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/support" className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                    Helpline
                  </Link>
                  <Link href="/login" className="rounded-full bg-[#0B2545] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#134074] shadow-sm">
                    Logout
                  </Link>
                </div>
              </div>
            </div>
          </header>
          <div className="flex-1 bg-[#f3f5f8]">{children}</div>
        </div>
      </div>
    </div>
  );
}
