import { BankLayout } from '@/components/layout/BankLayout';

export default function SettingsPage() {
  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <p className="text-xs uppercase tracking-[0.28em] text-bank-600">Settings</p>
            <h1 className="mt-2 text-4xl">Profile and preferences</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Update contact details, notification choices, and language preferences.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" defaultValue="Asha Menon" placeholder="Full name" />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" defaultValue="asha.menon@example.com" placeholder="Email address" />
              <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" defaultValue="+91 98765 43210" placeholder="Mobile number" />
              <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200" defaultValue="English">
                <option>English</option>
                <option>Hindi</option>
                <option>Marathi</option>
                <option>Tamil</option>
              </select>
            </div>

            <button className="mt-6 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white">
              Save changes
            </button>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <h2 className="text-3xl">Notifications</h2>
            <div className="mt-6 space-y-3">
              {['Card payments', 'Large transfers', 'Bill reminders', 'Security alerts'].map((item) => (
                <label key={item} className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
                  <span>{item}</span>
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-400" defaultChecked />
                </label>
              ))}
            </div>
          </section>
        </div>
      </main>
    </BankLayout>
  );
}