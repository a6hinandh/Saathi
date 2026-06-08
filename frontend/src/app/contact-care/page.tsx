'use client';

import { useState } from 'react';
import Link from 'next/link';
import { bankName } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

export default function ContactCarePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'support',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen text-slate-900 bg-slate-50">
      {/* Top Utility Bar */}
      <div className="bg-[#0B2545] text-white py-2 text-xs border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-4 h-2.5 bg-[#FF9933] inline-block rounded-xs"></span>
              <span className="w-4 h-2.5 bg-white inline-block rounded-xs flex items-center justify-center">
                <svg className="w-2 h-2 text-[#000080]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
                </svg>
              </span>
              <span className="w-4 h-2.5 bg-[#128807] inline-block rounded-xs"></span>
              Govt. of India Undertaking
            </span>
            <span className="text-white/40">|</span>
            <span className="text-white/75">Toll Free: 1800-11-2211 / 1800-425-3800</span>
            <span className="text-white/40">|</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Cyber Fraud Helpline: 1930
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white/90 hover:text-white font-medium hover:underline">
              Home
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/login" className="text-amber-400 hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Safety Alert Marquee */}
      <div className="bg-[#F37021]/10 border-b border-[#F37021]/20 py-2.5 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 relative flex items-center">
          <div className="absolute left-6 z-10 bg-[#F37021] text-white px-3 py-0.5 rounded-md text-xs font-bold shadow-sm uppercase tracking-wider">
            Alert
          </div>
          <div className="w-full pl-20 overflow-hidden flex">
            <div className="animate-marquee inline-flex gap-16 text-xs font-medium text-[#7c3008]">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#F37021] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Security Alert: Saathi Bank never asks for your OTP, UPI PIN, CVV, Password, or Aadhaar details. Do not share them with anyone.
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#F37021] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Safeguard Your Account: Beware of scam calls or SMS requesting KYC verification or PAN updates. Report immediately at 1930.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-slate-200 bg-white/80 px-6 py-4 shadow-[0_20px_50px_rgba(11,37,69,0.04)] backdrop-blur mb-10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Saathi Logo" className="h-11 w-11 object-contain rounded-xl shadow-md bg-white p-1" />
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#0B2545]">{bankName}</p>
              <p className="text-[0.72rem] text-slate-500 font-medium">Public Care & Self-Service Portal</p>
            </div>
          </div>
          <div className="flex gap-3 text-sm font-semibold">
            <Link href="/" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-[#0B2545] transition hover:border-[#0B2545]/30 hover:bg-slate-50">
              Back to Home
            </Link>
            <Link href="/login" className="rounded-full bg-[#0B2545] px-5 py-2.5 text-white transition hover:bg-[#134074] shadow-sm">
              Sign In to Portal
            </Link>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: Contact Form */}
          <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F37021]">Get In Touch</p>
            <h2 className="mt-3 text-3xl font-bold text-[#0B2545]">Contact Care Centre</h2>
            <p className="mt-2 text-sm text-slate-500">
              Submit your inquiry or report an issue. For security reasons, please do not share account numbers, PINs, or passwords.
            </p>

            {submitted ? (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950 text-center space-y-4 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Query Submitted Successfully</h3>
                <p className="text-sm max-w-md mx-auto">
                  Thank you for contacting Saathi Bank. A support representative will get back to you shortly at the email address provided. Your reference ID is <strong>STH-{Math.floor(100000 + Math.random() * 900000)}</strong>.
                </p>
                <Button 
                  onClick={() => setSubmitted(false)}
                  className="bg-[#0B2545] text-white hover:bg-[#134074] mt-4"
                >
                  Submit Another Query
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/10"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Mobile Number</label>
                    <input
                      type="tel"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/10"
                      placeholder="10-digit number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/10"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
                  <select
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/10"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="support">General Support & Accounts</option>
                    <option value="password">Forgot PIN / Password Help</option>
                    <option value="fraud">Report Unauthorized Transaction / Cyber Fraud</option>
                    <option value="feedback">Portal Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Message Details</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/10 resize-none"
                    placeholder="Describe your query in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#0B2545] text-white hover:bg-[#134074] py-3.5"
                >
                  Send Message
                </Button>
              </form>
            )}
          </section>

          {/* Right: Forgot Password Help & Official Support Details */}
          <aside className="space-y-6">
            {/* Forgot PIN / Password Guide */}
            <div className="rounded-[2rem] border border-amber-500/25 bg-amber-500/5 p-6 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m-2 2a2 2 0 00-2 2v2.586a1 1 0 01-.293.707l-2 2a1 1 0 00-.293.707V19a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1a1 1 0 00-.293-.707l-2-2A1 1 0 003 13.586V11a8 8 0 1112 0z" />
                </svg>
              </div>
              <h3 className="mt-3 text-xl font-bold text-[#0B2545]">Forgot PIN or Password?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                To protect retail banking accounts from social engineering scams and digital coercion, password resets cannot be done entirely online without behavioral verification.
              </p>
              <div className="mt-4 space-y-3">
                {[
                  'Option A: Call our toll-free support helpline and ask for credentials verification.',
                  'Option B: Visit your nearest Saathi Bank branch with valid Government ID (Aadhaar/PAN).',
                  'Option C: Reset via secure OTP if you have registered behavioral biometrics enabled.'
                ].map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-700 leading-relaxed shadow-2xs">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Official Support Helpline */}
            <div className="rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-[#081220] via-[#0B2545] to-[#134074] p-8 text-white shadow-[0_24px_50px_rgba(11,37,69,0.15)] relative overflow-hidden">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/55 font-bold">Official Channels</p>
              <h3 className="mt-2 text-2xl font-bold text-amber-400">Emergency Helpline</h3>
              
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 text-amber-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-white/50 uppercase">TOLL FREE NUMBERS</p>
                    <p className="text-xs font-bold mt-0.5">1800-11-2211 / 1800-425-3800</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/5 p-4 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 text-amber-400 animate-pulse">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-white/50 uppercase">CYBER CRIME POLICE</p>
                    <p className="text-xs font-bold text-amber-400 mt-0.5">Call 1930 Immediately</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/5 p-4 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 text-amber-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-white/50 uppercase">EMAIL SUPPORT</p>
                    <p className="text-xs font-bold mt-0.5">care@saathibank.co.in / cybercell@saathibank.co.in</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
