'use client';

import { useState } from 'react';
import { BankLayout } from '@/components/layout/BankLayout';
import { cardPortfolio as initialCards } from '@/lib/constants';

export default function CardsPage() {
  const [cardsList, setCardsList] = useState(initialCards);
  const [frozenCards, setFrozenCards] = useState<string[]>([]);
  const [limits, setLimits] = useState<Record<string, number>>({
    '•• 2287': 150000,
    '•• 6643': 200000
  });

  // Modal States
  const [pinCard, setPinCard] = useState<string | null>(null);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinSuccess, setPinSuccess] = useState<string>('');
  const [keypadOrder] = useState(() => [...Array(10).keys()].sort(() => Math.random() - 0.5));

  const [travelCard, setTravelCard] = useState<string | null>(null);
  const [travelCountry, setTravelCountry] = useState('United States');
  const [travelSuccess, setTravelSuccess] = useState('');

  const [limitCard, setLimitCard] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState<number>(150000);

  const toggleFreeze = (cardNumber: string) => {
    if (frozenCards.includes(cardNumber)) {
      setFrozenCards(frozenCards.filter(c => c !== cardNumber));
    } else {
      setFrozenCards([...frozenCards, cardNumber]);
    }
  };

  const handlePinSubmit = () => {
    if (enteredPin.length === 4) {
      setPinSuccess(`PIN for Card ending in ${pinCard?.slice(-4)} has been successfully updated.`);
      setEnteredPin('');
      setTimeout(() => {
        setPinCard(null);
        setPinSuccess('');
      }, 2000);
    }
  };

  const handleTravelSubmit = () => {
    setTravelSuccess(`International Travel Notice activated for ${travelCountry} on Card ending in ${travelCard?.slice(-4)}.`);
    setTimeout(() => {
      setTravelCard(null);
      setTravelSuccess('');
    }, 3000);
  };

  const handleLimitSubmit = () => {
    if (limitCard) {
      setLimits({ ...limits, [limitCard]: tempLimit });
      setLimitCard(null);
    }
  };

  return (
    <BankLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-xs uppercase tracking-[0.28em] text-[#F37021] font-bold">Cards</p>
          <h1 className="mt-2 text-4xl font-semibold text-[#0B2545]">Card controls</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 font-medium">
            Review debit and credit cards, toggle security locks, adjust spending caps, and schedule global travel notices instantly.
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {cardsList.map((card) => {
              const isFrozen = frozenCards.includes(card.number);
              const currentLimit = limits[card.number] || 150000;
              const isRuPay = card.name.includes('RuPay');

              return (
                <article
                  key={card.name}
                  className={`relative rounded-[2rem] border p-6 text-white shadow-2xl transition duration-300 overflow-hidden flex flex-col justify-between min-h-[360px] ${
                    isFrozen
                      ? 'border-slate-800 bg-slate-950/90 shadow-none'
                      : isRuPay
                      ? 'border-blue-950 bg-gradient-to-br from-[#040D1A] via-[#0B2545] to-[#134074] shadow-[#0B2545]/20 hover:scale-[1.01]'
                      : 'border-slate-900 bg-gradient-to-br from-[#0D0D11] via-[#1E1E24] to-[#2B2D42] shadow-slate-800/10 hover:scale-[1.01]'
                  }`}
                >
                  {/* Frost Lock Overlay */}
                  {isFrozen && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-10 flex flex-col items-center justify-center text-center p-6 transition-all duration-300">
                      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 text-lg animate-pulse mb-3">
                        <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-red-500 tracking-wider uppercase">CARD FROZEN</h3>
                      <p className="mt-1.5 text-xs text-slate-400 max-w-xs font-semibold">
                        All domestic, international, and online purchase channels are locked. Click below to unfreeze.
                      </p>
                      <button
                        onClick={() => toggleFreeze(card.number)}
                        className="mt-4 rounded-full bg-red-600 hover:bg-red-700 transition px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-white"
                      >
                        Unfreeze Card
                      </button>
                    </div>
                  )}

                  {/* Card Front Top */}
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-black tracking-[0.25em] text-[#F37021]">
                          {isRuPay ? 'Saathi Secure Net' : 'Saathi Select'}
                        </span>
                        <h2 className="mt-1 text-2xl font-black tracking-tight text-white">{card.name}</h2>
                        <p className="mt-1 text-sm font-mono text-white/50 tracking-widest">{card.number}</p>
                      </div>
                      <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-400">
                        {card.status}
                      </span>
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/5 pt-4 text-xs text-white/70">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Cardholder</p>
                        <p className="font-extrabold text-white mt-0.5">ASHA MENON</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Active limit</p>
                        <p className="font-bold text-amber-400 mt-0.5">
                          {isRuPay ? `₹${currentLimit.toLocaleString('en-IN')} Daily` : `Outstanding: ₹24,860.00`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Front Actions */}
                  <div className="mt-8 grid grid-cols-2 gap-3 text-xs">
                    <button
                      onClick={() => toggleFreeze(card.number)}
                      className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition px-4 py-3 text-left font-bold flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Freeze Card
                      </span>
                      <span className="text-[9px] text-[#F37021] font-black uppercase">Lock</span>
                    </button>

                    <button
                      onClick={() => {
                        setLimitCard(card.number);
                        setTempLimit(currentLimit);
                      }}
                      className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition px-4 py-3 text-left font-bold flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                        </svg>
                        Set Limits
                      </span>
                      <span className="text-[9px] text-emerald-400 font-black uppercase">Adjust</span>
                    </button>

                    <button
                      onClick={() => {
                        setPinCard(card.number);
                        setEnteredPin('');
                      }}
                      className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition px-4 py-3 text-left font-bold flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m-3.418 3.84a6 6 0 111.414-1.414l5.382 5.382a2 2 0 010 2.828l-1.414 1.414a2 2 0 01-2.828 0L14.582 12.84z" />
                        </svg>
                        Change PIN
                      </span>
                      <span className="text-[9px] text-cyan-400 font-black uppercase">Reset</span>
                    </button>

                    <button
                      onClick={() => {
                        setTravelCard(card.number);
                      }}
                      className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition px-4 py-3 text-left font-bold flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V8a2 2 0 00-2-2h-1.5a2 2 0 01-2-2V3.07M12 21a9 9 0 100-18 9 9 0 000 18z" />
                        </svg>
                        Global Notice
                      </span>
                      <span className="text-[9px] text-amber-400 font-black uppercase">Travel</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Modal: Change PIN Keypad */}
        {pinCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-6 backdrop-blur-sm animate-fadeIn">
            <div className="max-w-sm w-full rounded-[2rem] bg-slate-900 border border-slate-800 p-6 text-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-md font-bold tracking-wide flex items-center gap-2">
                  <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure PIN Update
                </h3>
                <button onClick={() => setPinCard(null)} className="text-slate-400 hover:text-white text-lg font-black">×</button>
              </div>

              {pinSuccess ? (
                <div className="my-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold text-center leading-5 flex flex-col items-center justify-center gap-2">
                  <svg className="w-6 h-6 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{pinSuccess}</span>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <p className="text-xs text-slate-400 leading-5">
                    For enhanced protection against screen-capturing, keycodes are randomized on load. Enter your new 4-digit card PIN.
                  </p>

                  <div className="flex justify-center gap-3 py-2">
                    {[0, 1, 2, 3].map((idx) => (
                      <span
                        key={idx}
                        className={`w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center ${
                          enteredPin.length > idx ? 'bg-[#F37021] border-[#F37021]' : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Secure Keypad Grid */}
                  <div className="grid grid-cols-3 gap-2 py-2">
                    {keypadOrder.map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          if (enteredPin.length < 4) setEnteredPin(enteredPin + num);
                        }}
                        className="bg-slate-800 hover:bg-slate-700 transition active:bg-slate-600 rounded-xl py-3 font-semibold text-lg"
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      onClick={() => setEnteredPin(enteredPin.slice(0, -1))}
                      className="bg-slate-800/50 hover:bg-slate-700 text-slate-400 transition rounded-xl py-3 text-xs font-bold uppercase tracking-wider"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handlePinSubmit}
                      disabled={enteredPin.length !== 4}
                      className="col-span-2 bg-[#F37021] hover:bg-[#E05A17] disabled:opacity-40 transition rounded-xl py-3 text-xs font-bold uppercase tracking-wider text-white"
                    >
                      Confirm PIN
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Travel Notice */}
        {travelCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-6 backdrop-blur-sm animate-fadeIn">
            <div className="max-w-md w-full rounded-[2rem] bg-white border border-slate-100 p-6 text-slate-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-md font-bold tracking-wide text-[#0B2545] flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V8a2 2 0 00-2-2h-1.5a2 2 0 01-2-2V3.07M12 21a9 9 0 100-18 9 9 0 000 18z" />
                  </svg>
                  Add Travel Notice
                </h3>
                <button onClick={() => setTravelCard(null)} className="text-slate-400 hover:text-slate-950 text-xl font-bold">×</button>
              </div>

              {travelSuccess ? (
                <div className="my-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center leading-5 flex flex-col items-center justify-center gap-2">
                  <svg className="w-6 h-6 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{travelSuccess}</span>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <p className="text-xs text-slate-600 leading-5">
                    Saathi&apos;s AI engine automatically monitors foreign transaction locations. Inform us in advance to prevent false positives.
                  </p>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Destination Country</label>
                    <select
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-slate-400 font-semibold text-slate-800"
                      value={travelCountry}
                      onChange={(e) => setTravelCountry(e.target.value)}
                    >
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Singapore</option>
                      <option>United Arab Emirates</option>
                      <option>Germany</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
                      <input type="date" className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none text-slate-700 font-semibold" defaultValue="2026-05-25" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">End Date</label>
                      <input type="date" className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none text-slate-700 font-semibold" defaultValue="2026-06-10" />
                    </div>
                  </div>

                  <button
                    onClick={handleTravelSubmit}
                    className="w-full mt-2 rounded-xl bg-[#0B2545] hover:bg-[#134074] transition text-white py-3 text-xs font-bold uppercase tracking-wider"
                  >
                    Activate Notice
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Set Limit Slider */}
        {limitCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-6 backdrop-blur-sm animate-fadeIn">
            <div className="max-w-md w-full rounded-[2rem] bg-white border border-slate-100 p-6 text-slate-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-md font-bold tracking-wide text-[#0B2545] flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                  </svg>
                  Set Retail Limit
                </h3>
                <button onClick={() => setLimitCard(null)} className="text-slate-400 hover:text-slate-950 text-xl font-bold">×</button>
              </div>

              <div className="mt-4 space-y-5">
                <p className="text-xs text-slate-600 leading-5 font-semibold">
                  Slide below to calibrate the active daily transaction limits for Card ending in {limitCard.slice(-4)}. Adjustments reflect instantly.
                </p>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Daily Cap</p>
                  <p className="text-2xl font-bold text-[#0B2545] mt-1">₹{tempLimit.toLocaleString('en-IN')}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="10000"
                    className="w-full accent-[#F37021] cursor-pointer"
                    value={tempLimit}
                    onChange={(e) => setTempLimit(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>₹10,000</span>
                    <span>₹5,00,000</span>
                  </div>
                </div>

                <button
                  onClick={handleLimitSubmit}
                  className="w-full rounded-xl bg-[#0B2545] hover:bg-[#134074] transition text-white py-3 text-xs font-bold uppercase tracking-wider"
                >
                  Save Active Limits
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </BankLayout>
  );
}
