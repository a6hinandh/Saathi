'use client';

import { useState } from 'react';
import { BankLayout } from '@/components/layout/BankLayout';
import { securityItems as initialItems } from '@/lib/constants';

export default function SecurityPage() {
  const [sensitivity, setSensitivity] = useState<'low' | 'balanced' | 'strict'>('balanced');
  
  // Toggles for active AI protections
  const [protections, setProtections] = useState<Record<string, boolean>>({
    'Typing Rhythm Analyzer': true,
    'Mouse Speed & Acceleration': true,
    'Clipboard Paste interceptor': true,
    'Digital Arrest Threat Guard': true,
    'Device Trust Binding': true
  });

  // Panic PIN Setup
  const [panicPin, setPanicPin] = useState('');
  const [tempPin, setTempPin] = useState('');
  const [showPanicModal, setShowPanicModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const toggleProtection = (key: string) => {
    setProtections({ ...protections, [key]: !protections[key] });
  };

  const handlePanicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempPin.length === 4 && /^\d+$/.test(tempPin)) {
      setPanicPin(tempPin);
      setShowPanicModal(false);
      setToastMessage('🛡️ Silent Duress Panic PIN successfully registered! Duress Mode active.');
      setTimeout(() => setToastMessage(''), 5000);
    }
  };

  // Sensitivity Details Metadata
  const sensitivityMeta = {
    low: {
      score: '65%',
      level: 'Coarse Analytics',
      color: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
      desc: 'Standard checks only. Relies heavily on device ID binding. Behavioral checks are relaxed to prevent false positives for rapid/expert typists.'
    },
    balanced: {
      score: '92%',
      level: 'Adaptive Guard (AI recommended)',
      color: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
      desc: 'Active monitoring of typing variance, clipboard events, and focus switches. Scans transfer reference notes for scam indicators.'
    },
    strict: {
      score: '99.4%',
      level: 'Critical Lockout',
      color: 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5',
      desc: 'Real-time mouse trajectory audit and continuous hesitation telemetry analysis. Suspends immediate high-value transfers under uncertainty.'
    }
  };

  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950 border border-emerald-500/20 text-emerald-400 text-sm font-semibold shadow-md animate-fadeIn flex items-center justify-between">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage('')} className="text-emerald-500 hover:text-white text-lg font-bold">×</button>
          </div>
        )}

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-slate-800 bg-[#081220] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="absolute right-0 top-0 -mr-12 -mt-12 w-40 h-40 bg-[#F37021]/10 rounded-full blur-2xl"></div>
              
              <p className="text-xs uppercase tracking-[0.28em] text-[#F37021] font-bold">Saathi AI Shield</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight">Coercion Defense Engine</h1>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Calibrate detection limits, manage active telemetry signal lines, and activate Silent Panic pins to safeguard transfers from cyber-fraud guide vectors.
              </p>

              {/* Sensitivity Levels Dial */}
              <div className="mt-8">
                <h3 className="text-xs uppercase font-bold text-white/40 tracking-wider mb-4">Protection Sensitivity Level</h3>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'balanced', 'strict'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSensitivity(level)}
                      className={`rounded-2xl border py-4 px-3 text-center transition ${
                        sensitivity === level
                          ? 'border-[#F37021] bg-[#F37021]/15 text-white shadow-lg'
                          : 'border-white/5 bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      <p className="text-xs font-bold uppercase tracking-wider">{level}</p>
                      <p className="mt-1 text-lg font-extrabold text-[#F37021]">{sensitivityMeta[level].score}</p>
                    </button>
                  ))}
                </div>

                {/* Sensitivity Profile Box */}
                <div className={`mt-5 rounded-2xl border p-5 ${sensitivityMeta[sensitivity].color} transition-all duration-300`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                    <h4 className="text-xs font-bold uppercase tracking-wider">{sensitivityMeta[sensitivity].level}</h4>
                  </div>
                  <p className="mt-2.5 text-xs text-white/70 leading-5">
                    {sensitivityMeta[sensitivity].desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Silent Panic PIN Box */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    🚨 Silent Panic PIN
                    <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                      panicPin ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {panicPin ? 'Active Mode' : 'Not Configured'}
                    </span>
                  </h4>
                  <p className="text-xs text-white/50 mt-1 max-w-sm leading-4">
                    Coerced transfers? Inputting this custom PIN will complete the flow in the portal, but hold funds at the bank and alert Cyber police.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setTempPin('');
                    setShowPanicModal(true);
                  }}
                  className="rounded-full bg-amber-400 hover:bg-amber-500 transition px-5 py-2 text-xs font-bold text-slate-900 tracking-wide"
                >
                  {panicPin ? 'Reconfigure PIN' : 'Setup Duress PIN'}
                </button>
              </div>
            </div>
          </section>

          {/* Active Shields Checklist */}
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-[#0B2545]">Telemetry Streams</h2>
              <p className="text-xs text-slate-500 mt-2">Toggle specific SDK data streams sent to the real-time AI Risk Fusion Engine.</p>

              <div className="mt-6 space-y-3.5">
                {Object.keys(protections).map((key) => {
                  const isActive = protections[key];
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-[1.5rem] border border-slate-100 bg-slate-50 px-5 py-4 transition hover:bg-slate-100/50"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{key}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {key.includes('Typing') ? 'Interval analytics and backspaces' :
                           key.includes('Mouse') ? 'Velocity tracking and curvature' :
                           key.includes('Clipboard') ? 'Block suspect copy-pastes' :
                           key.includes('Arrest') ? 'Reference keywords monitoring' :
                           'Device key-binding & fingerprinting'}
                        </p>
                      </div>

                      {/* Custom Switch Toggle */}
                      <button
                        onClick={() => toggleProtection(key)}
                        className={`w-11 h-6 rounded-full p-0.5 transition duration-300 ${
                          isActive ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition duration-300 transform ${
                            isActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shield Status Message */}
            <div className="mt-8 border-t border-slate-100 pt-5 text-center text-[10px] text-slate-500 italic">
              ✔️ Session telemetry is securely encrypted at the local browser level. Raw entries are never logged.
            </div>
          </section>
        </div>

        {/* Modal: Setup Panic PIN */}
        {showPanicModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-6 backdrop-blur-sm animate-fadeIn">
            <div className="max-w-md w-full rounded-[2rem] bg-white border border-slate-100 p-6 text-slate-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-md font-bold tracking-wide text-[#0B2545]">🚨 Setup Silent Panic PIN</h3>
                <button onClick={() => setShowPanicModal(false)} className="text-slate-400 hover:text-slate-950 text-xl font-bold">×</button>
              </div>

              <form onSubmit={handlePanicSubmit} className="mt-4 space-y-4">
                <p className="text-xs text-slate-600 leading-5">
                  Choose a 4-digit Silent Panic PIN. If you are forced to make a transfer under duress (like scammers demanding immediate payments), entering this PIN instead of your standard PIN completes the transfer page visually, but will immediately hold/suspend the transaction on the core bank ledger and report a silent duress alert.
                </p>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">4-Digit Silent Panic PIN</label>
                  <input
                    required
                    type="password"
                    maxLength={4}
                    pattern="\d{4}"
                    className="rounded-xl border border-slate-200 px-3 py-2.5 text-center tracking-widest text-lg font-bold outline-none transition focus:border-slate-400"
                    placeholder="••••"
                    value={tempPin}
                    onChange={(e) => setTempPin(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-red-600 hover:bg-red-700 transition text-white py-3 text-xs font-bold uppercase tracking-wider"
                >
                  Register Duress Panic PIN
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </BankLayout>
  );
}