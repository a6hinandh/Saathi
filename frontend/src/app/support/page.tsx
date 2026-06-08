'use client';

import { useState } from 'react';
import { BankLayout } from '@/components/layout/BankLayout';
import { supportTopics } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

export default function SupportPage() {
  // Mock states
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx((prev) => (prev === idx ? null : idx));
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    setTicketId(`STH-TKT-${Math.floor(100000 + Math.random() * 900000)}`);
    setTicketSuccess(true);
    setTicketSubject('');
    setTicketMessage('');

    setTimeout(() => {
      setTicketSuccess(false);
    }, 5000);
  };

  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 space-y-8 animate-fadeIn">
        {/* Banner Section */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.02)]">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#F37021] font-bold">Secure Help Desk</p>
          <h1 className="mt-2 text-4xl font-black text-slate-800 tracking-tight">Customer Support</h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-3xl font-medium">
            Contact our dedicated retail help desk. Report vishing threats, lock cards, and submit secure service requests directly.
          </p>
        </section>

        {/* Layout Grid */}
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          {/* FAQ Accordions & Helplines */}
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-xl font-black text-slate-800 tracking-tight border-b pb-4">Common Requests</h2>
              
              <div className="space-y-2">
                {supportTopics.map((faq, idx) => {
                  const isOpen = openFaqIdx === idx;
                  return (
                    <article key={faq.title} className="rounded-2xl border border-slate-200 bg-slate-50/30 overflow-hidden transition">
                      <button 
                        onClick={() => toggleFaq(idx)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:bg-slate-50 transition outline-none"
                      >
                        <span>{faq.title}</span>
                        <span className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </button>
                      
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-[11px] text-slate-500 leading-relaxed font-semibold border-t border-slate-200/50 bg-white animate-fadeIn">
                          {faq.detail}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Helpline Contacts Card */}
            <section className="rounded-3xl border border-slate-200 bg-[#081220] p-6 text-white shadow-lg space-y-4 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/50 font-black">Direct Contacts</p>
              <h3 className="text-lg font-black tracking-tight text-white mt-1">Care Center Helplines</h3>

              <div className="grid gap-4 sm:grid-cols-2 text-xs font-semibold text-slate-300 pt-2">
                <div className="rounded-2xl bg-white/5 border border-white/8 p-4">
                  <p className="text-[9px] text-[#F37021] font-black uppercase">Toll-Free Helpline</p>
                  <p className="text-sm font-black text-white mt-1">1800 123 4444</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Available 24x7 for general account service.</p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/8 p-4">
                  <p className="text-[9px] text-amber-400 font-black uppercase">Cyber Fraud Helpline</p>
                  <p className="text-sm font-black text-amber-400 mt-1">Dial 1930</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Call immediately for transaction reversals.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Secure Message Ticket Submission */}
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#F37021]">Secure Inbox</p>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Submit Ticket</h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold leading-relaxed">
                Send a secure message directly to your home branch. Service tickets are routed via internal security nets.
              </p>
            </div>

            {ticketSuccess && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-900 animate-fadeIn space-y-2 flex items-start gap-2.5">
                <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p>Ticket Submitted Successfully!</p>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                    Your request has been filed under ID <strong className="text-emerald-950 font-mono">{ticketId}</strong>. A support executive will update your inbox within 12 business hours.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">Inquiry Subject</label>
                <input 
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/15 text-slate-800 text-xs font-semibold"
                  placeholder="e.g. Request Cheque Book dispatch" 
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  required 
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">Message details</label>
                <textarea 
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/15 text-slate-800 text-xs font-semibold resize-none"
                  placeholder="Describe your request in details..." 
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  required 
                ></textarea>
              </div>

              <Button type="submit" className="w-full bg-[#0B2545] text-white hover:bg-[#134074] py-3 text-xs font-extrabold uppercase tracking-wider">
                Send Secure Message
              </Button>
            </form>
          </section>
        </div>
      </main>
    </BankLayout>
  );
}