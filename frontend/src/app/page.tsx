import Link from 'next/link';
import { bankName, featureCards, publicHighlights } from '@/lib/constants';

export default function HomePage() {
  return (
    <main className="min-h-screen text-slate-900">
      {/* Top Utility Bar */}
      <div className="bg-[#0B2545] text-white py-2 text-xs border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-4 h-2.5 bg-[#FF9933] inline-block rounded-xs"></span>
              <span className="w-4 h-2.5 bg-white inline-block rounded-xs flex items-center justify-center text-[4px] text-blue-900 font-bold">☀️</span>
              <span className="w-4 h-2.5 bg-[#128807] inline-block rounded-xs"></span>
              Govt. of India Undertaking
            </span>
            <span className="text-white/40">|</span>
            <span className="text-white/75">Toll Free: 1800-11-2211 / 1800-425-3800</span>
            <span className="text-white/40">|</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              ⚠️ Cyber Fraud Helpline: 1930
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-white/90 hover:text-white font-medium">English</button>
            <span className="text-white/30">/</span>
            <button className="text-white/70 hover:text-white font-medium">हिन्दी</button>
            <span className="text-white/30">|</span>
            <Link href="/admin" className="text-amber-400 hover:underline font-semibold">
              Fraud Ops Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Safety Alert Marquee */}
      <div className="bg-[#F37021]/12 border-b border-[#F37021]/20 py-2.5 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 relative flex items-center">
          <div className="absolute left-6 z-10 bg-[#F37021] text-white px-3 py-0.5 rounded-md text-xs font-bold shadow-sm uppercase tracking-wider">
            RBI Kehta Hai
          </div>
          <div className="w-full pl-32 overflow-hidden flex">
            <div className="animate-marquee inline-flex gap-16 text-xs font-medium text-[#7c3008]">
              <span>🛡️ Security Alert: Saathi Bank never asks for your OTP, UPI PIN, CVV, Password, or Aadhaar details. Do not share them with anyone.</span>
              <span>🔒 Safeguard Your Account: Beware of scam calls or SMS requesting KYC verification or PAN updates. Report immediately at 1930.</span>
              <span>📱 Safe Banking: Verify the sender ID for bank SMS alerts. Check transaction logs regularly via the Internet Banking dashboard.</span>
              {/* Duplicate for infinite effect */}
              <span>🛡️ Security Alert: Saathi Bank never asks for your OTP, UPI PIN, CVV, Password, or Aadhaar details. Do not share them with anyone.</span>
              <span>🔒 Safeguard Your Account: Beware of scam calls or SMS requesting KYC verification or PAN updates. Report immediately at 1930.</span>
              <span>📱 Safe Banking: Verify the sender ID for bank SMS alerts. Check transaction logs regularly via the Internet Banking dashboard.</span>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-slate-200 bg-white/80 px-6 py-4 shadow-[0_20px_50px_rgba(11,37,69,0.04)] backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B2545] text-white shadow-md">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#0B2545]">{bankName}</p>
              <p className="text-[0.72rem] text-slate-500 font-medium">Safe & Secure Retail Internet Banking Portal</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <Link href="/login" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-[#0B2545] transition hover:border-[#0B2545]/30 hover:bg-slate-50">
              Sign in to Portal
            </Link>
            <Link href="/login" className="rounded-full bg-[#0B2545] px-5 py-2.5 text-white transition hover:bg-[#134074] shadow-sm shadow-[#0B2545]/20">
              Register / Activate
            </Link>
          </div>
        </header>

        <div className="grid gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-14">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-[#F37021]/30 bg-[#F37021]/6 px-4.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F37021]">
              🇮🇳 Azadi Ka Amrit Mahotsav - Digital India Campaign
            </div>
            <div className="max-w-3xl space-y-5">
              <h1 className="text-4xl font-bold leading-tight text-[#0B2545] md:text-6xl tracking-tight">
                Secure Banking. <br/>
                Empowered by <span className="text-[#F37021] relative inline-block">Saathi AI<span className="absolute bottom-1 left-0 w-full h-1.5 bg-[#F37021]/20 -z-1"></span></span>
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                Experience India's first internet banking portal with integrated real-time coercion defense. Protect your transfers from cyber-fraud guide, digital arrest threats, and unauthorized actions.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/login" className="rounded-full bg-[#0B2545] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#134074] shadow-md shadow-[#0B2545]/25">
                Sign in to NetBanking
              </Link>
              <Link href="/support" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
                Contact Care Centre
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {publicHighlights.map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{item.label}</p>
                  <p className="mt-3 text-2xl font-bold text-[#0B2545]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-[#081220] via-[#0B2545] to-[#134074] p-8 text-white shadow-[0_24px_60px_rgba(11,37,69,0.3)] relative overflow-hidden">
            <div className="absolute right-0 top-0 -mr-16 -mt-16 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50 font-semibold">Mock SB Account Balance</p>
                <p className="mt-2 text-3xl font-bold text-amber-400">₹2,48,300.18</p>
                <p className="mt-1 text-xs text-white/60">Aadhaar Linked & KYC Verified</p>
              </div>
              <div className="rounded-2xl bg-[#128807]/20 border border-[#128807]/30 px-3.5 py-1.5 text-xs font-semibold text-[#39e627] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39e627] animate-ping"></span>
                Secure Session
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                'Instant BHIM UPI Transfer',
                'RTGS/NEFT Statement',
                'E-Rupee (Digital Currency)',
                'RuPay Card Controls'
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3.5 text-sm text-white/85 flex items-center gap-2">
                  <span className="text-[#F37021] text-lg">✦</span>
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-white/5 p-5">
              <div className="flex items-center justify-between text-xs text-white/50 uppercase tracking-wider font-semibold">
                <span>National Pension Scheme</span>
                <span className="text-amber-400">APY Enabled</span>
              </div>
              <p className="mt-3 text-lg font-bold">Atal Pension Yojana</p>
              <p className="mt-1 text-xs text-white/70">Auto-debit setup for monthly contributions active under PRAN 1102941.</p>
            </div>
          </div>
        </div>

        <section className="grid gap-5 pb-10 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((card) => (
            <article key={card.title} className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6.5 shadow-[0_14px_30px_rgba(11,37,69,0.03)] backdrop-blur transition hover:shadow-md hover:-translate-y-0.5 duration-200">
              <h2 className="text-xl font-bold text-[#0B2545]">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
