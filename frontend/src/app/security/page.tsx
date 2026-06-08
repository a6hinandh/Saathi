'use client';

import { useState } from 'react';
import { BankLayout } from '@/components/layout/BankLayout';

const policiesList = [
  {
    key: 'mfa' as const,
    label: 'Multi-Factor 2FA Verification',
    desc: 'Require one-time passcodes (OTP) sent to registered mobile for any transfer greater than ₹10,000.',
    icon: (
      <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  },
  {
    key: 'deviceBinding' as const,
    label: 'Device Hardware Trust Binding',
    desc: 'Lock account access to your primary verified device UUID. Prevents credentials login from unverified browser agents.',
    icon: (
      <svg className="w-4 h-4 text-[#F37021] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    key: 'biometrics' as const,
    label: 'Real-Time Behavioral Biometrics (Saathi SDK)',
    desc: 'Evaluate keystroke cadence, deletes, hesitation times, and note intents to identify coercion scams and vishing scripts.',
    icon: (
      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    key: 'autoLogout' as const,
    label: 'Automatic Session Timeout Safeguard',
    desc: 'Log out immediately after 5 minutes of browser session inactivity to prevent unauthorized office/desktop transfers.',
    icon: (
      <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    key: 'limitLock' as const,
    label: 'Temporary Daily Transfer Limit Lock',
    desc: 'Reduce maximum daily transfers from ₹1,50,000 down to ₹20,000. Enable if you suspect active phishing attempts.',
    icon: (
      <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    )
  }
];

export default function SecurityPage() {
  // Mock state for security switches
  const [securityLayers, setSecurityLayers] = useState({
    mfa: true,
    deviceBinding: true,
    biometrics: true,
    autoLogout: true,
    limitLock: false
  });

  const toggleLayer = (key: keyof typeof securityLayers) => {
    setSecurityLayers((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Calculate score based on active layers
  const activeCount = Object.values(securityLayers).filter(Boolean).length;
  const score = activeCount * 20;

  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 space-y-8 animate-fadeIn">
        {/* Banner Section */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.02)]">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#F37021] font-bold">Session Defense</p>
          <h1 className="mt-2 text-4xl font-black text-slate-800 tracking-tight">Security Center</h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-3xl font-medium">
            Customize AI policy triggers, toggle device binding, and review active behavioral sensors to match your comfort level.
          </p>
        </section>

        {/* Layout Grid */}
        <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
          {/* Health Score Panel */}
          <section className="rounded-3xl border border-slate-200 bg-[#081220] p-8 text-white shadow-lg space-y-6 flex flex-col items-center justify-between text-center relative overflow-hidden">
            <div className="absolute right-0 top-0 -mr-16 -mt-16 w-36 h-36 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="w-full">
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/50 font-black">AI Shield Diagnostic</p>
              <h2 className="text-2xl font-black tracking-tight text-white mt-1">Protection Level</h2>
            </div>

            {/* Score circle */}
            <div className="relative w-40 h-40 flex items-center justify-center border-8 border-slate-800 rounded-full my-4">
              {/* Outer active indicator ring */}
              <div className="absolute inset-0 rounded-full border-8 border-[#F37021] border-r-transparent animate-spin-slow opacity-20"></div>
              <div>
                <p className="text-4xl font-black text-amber-400 font-mono tracking-tighter">{score}%</p>
                <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mt-1">Guarded</p>
              </div>
            </div>

            <div className="w-full text-xs font-semibold text-slate-400 space-y-2.5 bg-white/5 border border-white/8 p-4 rounded-2xl">
              <div className="flex justify-between">
                <span>Active Shield Layers:</span>
                <span className="text-emerald-400">{activeCount} / 5</span>
              </div>
              <div className="flex justify-between">
                <span>Coercion Scan Depth:</span>
                <span className="text-[#F37021]">{securityLayers.biometrics ? 'Telemetry Enabled' : 'Incomplete'}</span>
              </div>
            </div>
          </section>

          {/* Active Policies */}
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs space-y-6">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight border-b pb-4">Security Policies</h2>

            <div className="space-y-5">
              {policiesList.map((policy) => (
                <div key={policy.key} className="flex items-start justify-between gap-6 py-2 border-b last:border-0 border-slate-100 pb-4 last:pb-0">
                  <div className="flex items-start gap-3">
                    <span className="p-2 bg-slate-50 rounded-xl border border-slate-100 shrink-0 mt-0.5">
                      {policy.icon}
                    </span>
                    <div className="space-y-1">
                      <p className="text-xs font-extrabold text-slate-800">{policy.label}</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-medium max-w-xl">{policy.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleLayer(policy.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      securityLayers[policy.key] ? 'bg-[#0B2545]' : 'bg-slate-200'
                    }`}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        securityLayers[policy.key] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </BankLayout>
  );
}