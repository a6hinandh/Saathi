'use client';

import { useState } from 'react';
import { BankLayout } from '@/components/layout/BankLayout';
import { Button } from '@/components/ui/Button';

const triggersList = [
  { 
    key: 'cardPayments' as const, 
    label: 'Card Transactions', 
    desc: 'Notify via SMS & email for card swipe events.',
    icon: (
      <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  { 
    key: 'largeTransfers' as const, 
    label: 'Large Value Transfers (> ₹10K)', 
    desc: 'Notify immediately on transfer approvals.',
    icon: (
      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    key: 'billReminders' as const, 
    label: 'Bill Autopay reminders', 
    desc: 'Receive reminders 3 days before payment schedules.',
    icon: (
      <svg className="w-4 h-4 text-[#F37021] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    key: 'securityAlerts' as const, 
    label: 'Cyber Security Logs', 
    desc: 'Critical alert for unverified device connections.',
    icon: (
      <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  }
];

export default function SettingsPage() {
  // Mock states
  const [name, setName] = useState('Asha Menon');
  const [email, setEmail] = useState('asha.menon@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [language, setLanguage] = useState('English');

  const [notificationToggles, setNotificationToggles] = useState({
    cardPayments: true,
    largeTransfers: true,
    billReminders: false,
    securityAlerts: true
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleNotification = (key: keyof typeof notificationToggles) => {
    setNotificationToggles((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
  };

  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 space-y-8 animate-fadeIn">
        {/* Banner Section */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.02)]">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#F37021] font-bold">Preferences</p>
          <h1 className="mt-2 text-4xl font-black text-slate-800 tracking-tight">Profile & Settings</h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-3xl font-medium">
            Manage your personal profile records, update secure contact coordinates, and configure threshold notification alerts.
          </p>
        </section>

        {saveSuccess && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-950 animate-fadeIn flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>Settings updated successfully! Profile changes saved to secure session store.</span>
          </div>
        )}

        {/* Layout Grid */}
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          {/* Profile Form */}
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#F37021]">Personal Info</p>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Profile Details</h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold leading-relaxed">
                Update details matching your KYC profile folder. Mobile number changes require Aadhaar biometrics.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">Full Name</label>
                  <input 
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/15 text-slate-800 text-xs font-semibold"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">Email Address</label>
                  <input 
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/15 text-slate-800 text-xs font-semibold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">Mobile Number (KYC linked)</label>
                  <input 
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/15 text-slate-800 text-xs font-semibold bg-slate-50 text-slate-500"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled 
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">Portal Language</label>
                  <select 
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/15 text-slate-800 text-xs font-semibold"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option>English</option>
                    <option>Hindi (हिन्दी)</option>
                    <option>Marathi (मराठी)</option>
                    <option>Tamil (தமிழ்)</option>
                  </select>
                </div>
              </div>

              <Button type="submit" className="bg-[#0B2545] text-white hover:bg-[#134074] py-3 px-8 text-xs font-extrabold uppercase tracking-wider">
                Save Changes
              </Button>
            </form>
          </section>

          {/* Alerts & Notifications */}
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#F37021]">Alert Settings</p>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Notification Triggers</h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold leading-relaxed">
                Toggle channels for security reports and transaction warnings. Critical alerts remain active permanently.
              </p>
            </div>

            <div className="space-y-4">
              {triggersList.map((notif) => (
                <div key={notif.key} className="flex items-center justify-between gap-6 py-2 border-b last:border-0 border-slate-100 pb-3 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                      {notif.icon}
                    </span>
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">{notif.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-semibold">{notif.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleNotification(notif.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      notificationToggles[notif.key] ? 'bg-[#0B2545]' : 'bg-slate-200'
                    }`}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        notificationToggles[notif.key] ? 'translate-x-5' : 'translate-x-0'
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