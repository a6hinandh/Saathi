import Link from 'next/link';
import { bankName, loginBenefits } from '@/lib/constants';

export default function LoginPage() {
  return (
    <main className="min-h-screen text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex items-center justify-center px-6 py-14 lg:px-12">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex rounded-full border border-slate-300 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600">
              {bankName}
            </div>
            <div className="space-y-5">
              <h1 className="text-5xl leading-tight md:text-7xl">Sign in to a banking session built for clarity and control.</h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Access your accounts, payees, transfers, cards, and statements from one secure portal with a familiar banking flow.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {loginBenefits.map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-5 text-sm leading-6 text-slate-600 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-[#081326] p-6 text-white shadow-[0_24px_70px_rgba(8,19,38,0.28)]">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">Need help signing in?</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {[
                  'Use your customer ID or username.',
                  'Confirm login with OTP or device trust.'
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/78">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center px-6 py-14 lg:px-12">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-900 shadow-[0_28px_90px_rgba(15,23,42,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-bank-600">Customer access</p>
            <h2 className="mt-3 text-3xl">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">Enter your credentials to continue to internet banking.</p>

            <form className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Customer ID or username</label>
                <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200" placeholder="e.g. 10021487" defaultValue="10021487" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200" placeholder="Enter password" type="password" defaultValue="Northfield@123" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">One-time passcode</label>
                <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200" placeholder="6-digit code" defaultValue="482911" />
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-400" defaultChecked />
                  Remember this device
                </label>
                <Link href="/support" className="font-medium text-bank-700 hover:text-bank-800">
                  Forgot credentials?
                </Link>
              </div>
              <Link href="/dashboard" className="block rounded-full bg-slate-950 px-4 py-3 text-center font-semibold text-white transition hover:bg-[#081326]">
                Sign in securely
              </Link>
            </form>
            <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              Keep this portal private. Northfield Bank will never ask for your full password by email or phone.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
