'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { bankName, loginBenefits } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState('10021487');
  const [password, setPassword] = useState('SaathiBank@123');
  const [otp, setOtp] = useState('482911');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardKeys, setKeyboardKeys] = useState<string[]>([]);
  const [activeInput, setActiveInput] = useState<'password' | 'otp' | null>(null);

  // Initialize and randomize keys for virtual keyboard
  const initializeKeyboard = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789@#$!'.split('');
    // Shuffle helper
    const shuffled = chars.sort(() => 0.5 - Math.random());
    setKeyboardKeys(shuffled);
  };

  useEffect(() => {
    initializeKeyboard();
  }, []);

  const handleKeyPress = (char: string) => {
    if (activeInput === 'password') {
      setPassword((prev) => prev + char);
    } else if (activeInput === 'otp') {
      setOtp((prev) => prev + char);
    }
  };

  const handleBackspace = () => {
    if (activeInput === 'password') {
      setPassword((prev) => prev.slice(0, -1));
    } else if (activeInput === 'otp') {
      setOtp((prev) => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (activeInput === 'password') {
      setPassword('');
    } else if (activeInput === 'otp') {
      setOtp('');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app we'd authenticate, here we route to customer dashboard
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen text-slate-900 bg-slate-50 relative">
      {/* Top Banner */}
      <header className="bg-[#0B2545] text-white py-3 px-6 text-center text-xs font-semibold shadow-sm flex items-center justify-center gap-3">
        <span>🔒 Secure 256-bit SSL encrypted connection</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-white/60">Session starts after OTP verification</span>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-40px)] max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex items-center justify-center px-6 py-10 lg:px-12">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex rounded-full border border-[#F37021]/30 bg-[#F37021]/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#F37021] items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F37021]"></span>
              {bankName}
            </div>
            <div className="space-y-5">
              <h1 className="text-4xl font-bold leading-tight text-[#0B2545] md:text-5xl tracking-tight">
                Secure credentials entry with adaptive fraud defense.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                Sign in to your account with a layered authentication system. We keep your credentials protected using localized keystroke behavior vectors, without storing raw inputs.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {loginBenefits.map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-xs">
                  {item}
                </div>
              ))}
            </div>
            <div className="rounded-[2rem] border border-[#0B2545]/10 bg-[#0B2545] p-6 text-white shadow-[0_24px_50px_rgba(11,37,69,0.2)]">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold uppercase tracking-wider">
                <span>🛡️ Security Checklist for Safe Logging</span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {[
                  'Ensure URL matches the secure saathibank portal.',
                  'Use the secure virtual keyboard for shared devices.',
                  'Report lost mobile numbers immediately to halt OTP.',
                  'Never share your login credentials with anyone.'
                ].map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-xs text-white/80 leading-5">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 lg:px-12">
          <div className="w-full max-w-md rounded-[2.5rem] border border-slate-200 bg-white p-8 text-slate-900 shadow-[0_28px_80px_rgba(11,37,69,0.08)] relative">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F37021]">Internet Banking Login</p>
            <h2 className="mt-3 text-3xl font-bold text-[#0B2545]">Welcome Back</h2>
            <p className="mt-1 text-sm text-slate-500">Please enter your retail credentials below.</p>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Customer ID</label>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/10"
                  placeholder="e.g. 10021487"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowKeyboard((prev) => !prev);
                      setActiveInput('password');
                      initializeKeyboard();
                    }}
                    className="text-xs font-bold text-[#F37021] hover:underline flex items-center gap-1"
                  >
                    🎹 {showKeyboard && activeInput === 'password' ? 'Hide Virtual Keypad' : 'Use Virtual Keypad'}
                  </button>
                </div>
                <input
                  type="password"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => {
                    if (showKeyboard) setActiveInput('password');
                  }}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">One-Time Passcode (OTP)</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowKeyboard((prev) => !prev);
                      setActiveInput('otp');
                      initializeKeyboard();
                    }}
                    className="text-xs font-bold text-[#F37021] hover:underline flex items-center gap-1"
                  >
                    🎹 {showKeyboard && activeInput === 'otp' ? 'Hide Virtual Keypad' : 'Use Virtual Keypad'}
                  </button>
                </div>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/10"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onFocus={() => {
                    if (showKeyboard) setActiveInput('otp');
                  }}
                  required
                />
              </div>

              {/* Virtual Keyboard GUI */}
              {showKeyboard && activeInput && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-fadeIn space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 border-b pb-2 uppercase tracking-wider">
                    <span>🎹 Secure Keyboard ({activeInput})</span>
                    <button
                      type="button"
                      onClick={() => initializeKeyboard()}
                      className="text-[#F37021] hover:underline"
                    >
                      🔄 Randomize
                    </button>
                  </div>
                  <div className="grid grid-cols-8 gap-1.5">
                    {keyboardKeys.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleKeyPress(key)}
                        className="h-8 w-full rounded bg-white hover:bg-slate-100 border text-sm font-semibold shadow-xs flex items-center justify-center active:scale-95 transition"
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t text-xs font-bold">
                    <button
                      type="button"
                      onClick={handleClear}
                      className="py-1.5 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={handleBackspace}
                      className="py-1.5 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
                    >
                      Backspace
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowKeyboard(false)}
                      className="py-1.5 rounded bg-[#0B2545] text-white hover:bg-[#134074]"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-slate-500">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#0B2545] focus:ring-[#0B2545]/40" defaultChecked />
                  Remember ID
                </label>
                <Link href="/support" className="font-semibold text-[#0B2545] hover:underline">
                  Forgot PIN / Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full block rounded-full bg-[#0B2545] py-3.5 text-center font-semibold text-white transition hover:bg-[#134074] shadow-md shadow-[#0B2545]/20 hover:scale-[1.01]"
              >
                Sign In Securly
              </button>
            </form>

            <div className="mt-8 rounded-[1.5rem] border border-[#F37021]/15 bg-[#F37021]/5 p-4 text-xs leading-5 text-slate-600">
              💡 **Report unauthorized transactions immediately**: Call **1930** or write to `cybercell@saathibank.co.in`. Saathi Bank is committed to cyber safety.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
