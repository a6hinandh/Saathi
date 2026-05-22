'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { accountCards, payees } from '@/lib/constants';
import { useRiskEngine } from '@/hooks/useRiskEngine';
import { FraudDecisionModal } from '@/components/modals/FraudDecisionModal';
import type { RiskEvaluationResponse } from '@/lib/types';

export function TransferForm() {
  const [fromAccount, setFromAccount] = useState(accountCards[0].name);
  const [payeeType, setPayeeType] = useState<'saved' | 'custom'>('saved');
  const [payee, setPayee] = useState(payees[0].name);
  const [customPayee, setCustomPayee] = useState('');
  const [amount, setAmount] = useState('18500');
  const [reference, setReference] = useState('School fee payment');
  const [schedule, setSchedule] = useState('immediate');
  const [confirmed, setConfirmed] = useState(false);

  // Behavioral Telemetry State
  const [sessionId] = useState(() => 'sess_' + Math.random().toString(36).substring(2, 10));
  const [keyTimestamps, setKeyTimestamps] = useState<number[]>([]);
  const [keyIntervals, setKeyIntervals] = useState<number[]>([]);
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [amountEditCount, setAmountEditCount] = useState(0);
  const [focusSwitchCount, setFocusSwitchCount] = useState(0);
  const [pasteCount, setPasteCount] = useState(0);
  const [hesitationSeconds, setHesitationSeconds] = useState(0);
  const [mouseSpeedSamples, setMouseSpeedSamples] = useState<number[]>([]);

  // API Evaluation State
  const [evalResponse, setEvalResponse] = useState<RiskEvaluationResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState<'ALLOW' | 'WARNING' | 'STEP_UP' | 'BLOCK'>('ALLOW');
  const [modalExplanations, setModalExplanations] = useState<string[]>([]);

  const selectedAccount = accountCards.find((item) => item.name === fromAccount) ?? accountCards[0];
  const selectedPayee = payees.find((item) => item.name === payee) ?? payees[0];

  const { evaluate, loading } = useRiskEngine();

  // Seconds hesitation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setHesitationSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mouse speed tracker
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (lastTime > 0) {
        const dt = now - lastTime;
        if (dt > 10) {
          const dx = e.clientX - lastX;
          const dy = e.clientY - lastY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const speed = (dist / dt) * 1000; // pixels per second
          setMouseSpeedSamples((prev) => [...prev.slice(-19), speed]);
        }
      }
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle typing keystroke latency
  const handleKeyDown = (e: React.KeyboardEvent) => {
    setTotalKeystrokes((prev) => prev + 1);
    if (e.key === 'Backspace') {
      setBackspaceCount((prev) => prev + 1);
    }
    const now = Date.now();
    if (keyTimestamps.length > 0) {
      const interval = now - keyTimestamps[keyTimestamps.length - 1];
      if (interval < 2000) {
        setKeyIntervals((prev) => [...prev, interval]);
      }
    }
    setKeyTimestamps((prev) => [...prev, now]);
  };

  const handlePaste = () => {
    setPasteCount((prev) => prev + 1);
  };

  // Derived telemetry metrics
  const avgKeyInterval = keyIntervals.length > 0
    ? Math.round(keyIntervals.reduce((a, b) => a + b, 0) / keyIntervals.length)
    : 0;

  const typingVariance = keyIntervals.length > 0
    ? Math.round(
        keyIntervals.reduce((sum, val) => sum + Math.pow(val - avgKeyInterval, 2), 0) /
          keyIntervals.length
      )
    : 0;

  const backspaceRate = totalKeystrokes > 0 ? Number((backspaceCount / totalKeystrokes).toFixed(2)) : 0;

  const mouseSpeed = mouseSpeedSamples.length > 0
    ? Math.round(mouseSpeedSamples.reduce((sum, speed) => sum + speed, 0) / mouseSpeedSamples.length)
    : 950;

  const handleReview = async () => {
    const finalBeneficiary = payeeType === 'saved' ? selectedPayee.name : customPayee;

    const payload = {
      customer_id: 'CUST-10021',
      session_id: sessionId,
      amount: Number(amount || 0),
      beneficiary: finalBeneficiary || 'Unknown',
      note: reference || '',
      device_id: 'demo-device',
      features: {
        avg_key_interval: avgKeyInterval || 250,
        typing_variance: typingVariance || 30,
        backspace_rate: backspaceRate,
        mouse_speed: mouseSpeed,
        confirmation_delay: hesitationSeconds, // in seconds
        amount_edit_count: amountEditCount,
        focus_switch_count: focusSwitchCount,
        paste_count: pasteCount,
        hesitation_delay: hesitationSeconds
      }
    };

    try {
      const res = await evaluate(payload);
      setEvalResponse(res);
      if (res.action === 'BLOCK' || res.action === 'STEP_UP') {
        setModalTitle(res.action === 'BLOCK' ? 'Transaction Blocked' : 'Step-Up Verification Required');
        setModalMessage(res.summary || 'Our AI security systems detected high indicators of coercion or scam. To protect your funds, this transfer has been blocked.');
        setModalExplanations(res.explanation || []);
        setModalAction(res.action);
        setModalOpen(true);
      } else if (res.action === 'WARNING') {
        setModalTitle('Security Warning');
        setModalMessage('Caution: Suspicious behavior patterns detected. If you are being guided by anyone on a call to make this transfer, hang up immediately. Scammers often impersonate customer support, bank officials, or law enforcement.');
        setModalExplanations(res.explanation || []);
        setModalAction('WARNING');
        setModalOpen(true);
      } else {
        // ALLOW
        setConfirmed(true);
      }
    } catch (err) {
      console.error('Risk Evaluation Error, proceeding with default allowance:', err);
      setConfirmed(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleProceedAfterWarning = () => {
    setModalOpen(false);
    setConfirmed(true);
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#F37021] font-bold">Payments</p>
            <h1 className="mt-2 text-4xl font-semibold text-[#0B2545]">Transfer funds</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Choose the source account, verify the beneficiary, and complete the transfer with the adaptive AI security layer enabled.
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 font-medium">
            Daily limit: ₹1,50,000
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
            Source account
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              value={fromAccount}
              onChange={(event) => setFromAccount(event.target.value)}
              onFocus={() => setFocusSwitchCount((prev) => prev + 1)}
            >
              {accountCards.map((account) => (
                <option key={account.name} value={account.name}>
                  {account.name} - {account.number} (Balance: {account.balance})
                </option>
              ))}
            </select>
          </label>

          <div className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
            <span className="block mb-2 text-slate-700">Beneficiary Type</span>
            <div className="flex gap-3">
              <button
                type="button"
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                  payeeType === 'saved'
                    ? 'bg-[#0B2545] border-[#0B2545] text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => {
                  setPayeeType('saved');
                  setFocusSwitchCount((prev) => prev + 1);
                }}
              >
                Saved Beneficiary
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                  payeeType === 'custom'
                    ? 'bg-[#0B2545] border-[#0B2545] text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => {
                  setPayeeType('custom');
                  setFocusSwitchCount((prev) => prev + 1);
                }}
              >
                Pay Custom UPI / Account
              </button>
            </div>
          </div>

          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
            Beneficiary Details
            {payeeType === 'saved' ? (
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                value={payee}
                onChange={(event) => setPayee(event.target.value)}
                onFocus={() => setFocusSwitchCount((prev) => prev + 1)}
              >
                {payees.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name} - {item.account}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                value={customPayee}
                onChange={(event) => setCustomPayee(event.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocusSwitchCount((prev) => prev + 1)}
                placeholder="Enter UPI ID (e.g. unknown_agent@upi) or Bank Account No"
              />
            )}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Amount
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setAmountEditCount((prev) => prev + 1);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocusSwitchCount((prev) => prev + 1)}
              inputMode="numeric"
              placeholder="18500"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Transfer mode
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              value={schedule}
              onChange={(event) => setSchedule(event.target.value)}
              onFocus={() => setFocusSwitchCount((prev) => prev + 1)}
            >
              <option value="immediate">Immediate payment (IMPS/UPI)</option>
              <option value="scheduled">Schedule for later (NEFT)</option>
              <option value="recurring">Recurring transfer</option>
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
            Reference note
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onFocus={() => setFocusSwitchCount((prev) => prev + 1)}
              placeholder="School fee payment, KYC verification fee, etc."
            />
          </label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'From Account', value: selectedAccount.number },
            { label: 'To Beneficiary', value: payeeType === 'saved' ? selectedPayee.account : customPayee || 'Not specified' },
            { label: 'Mode', value: schedule.replace(/^[a-z]/, (letter) => letter.toUpperCase()) }
          ].map((item) => (
            <div key={item.label} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500 font-semibold">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-900 truncate">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            className="bg-[#0B2545] text-white hover:bg-[#134074] shadow-sm disabled:opacity-50"
            onClick={handleReview}
            disabled={loading}
          >
            {loading ? 'Evaluating...' : 'Review & Transfer'}
          </Button>
          <Link href="/beneficiary" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            Manage payees
          </Link>
        </div>
      </section>

      <aside className="space-y-4">
        {/* Real-Time Telemetry Monitor */}
        <div className="rounded-[2rem] border border-cyan-500/25 bg-slate-950 p-6 text-[#00ffcc] font-mono shadow-[0_15px_35px_rgba(6,22,52,0.15)] relative overflow-hidden">
          <div className="absolute inset-0 bg-scanline pointer-events-none opacity-[0.03]"></div>
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-cyan-400">Saathi Telemetry Monitor</span>
            </div>
            <span className="text-[10px] text-cyan-500/60 uppercase font-semibold">Live SDK Stream</span>
          </div>

          <div className="mt-5 space-y-3.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Avg Key Interval:</span>
              <span className="font-bold text-white">{avgKeyInterval} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Typing Variance:</span>
              <span className="font-bold text-white">{typingVariance} ms²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Backspace Rate:</span>
              <span className="font-bold text-white">{(backspaceRate * 100).toFixed(0)}% ({backspaceCount} BS)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Mouse Speed:</span>
              <span className="font-bold text-white">{mouseSpeed} px/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Amount Edits:</span>
              <span className="font-bold text-white">{amountEditCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Focus Switches:</span>
              <span className="font-bold text-white">{focusSwitchCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Paste Events:</span>
              <span className="font-bold text-white">{pasteCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hesitation Delay:</span>
              <span className="font-bold text-white">{hesitationSeconds} s</span>
            </div>

            {evalResponse && (
              <div className="mt-4 pt-3 border-t border-cyan-500/25 space-y-2">
                <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Evaluation Result</p>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Score:</span>
                  <span className={`font-bold ${evalResponse.final_risk_score > 75 ? 'text-red-400' : evalResponse.final_risk_score > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {evalResponse.final_risk_score} / 100
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Level:</span>
                  <span className={`font-bold ${evalResponse.risk_level === 'CRITICAL' || evalResponse.risk_level === 'HIGH' ? 'text-red-400' : evalResponse.risk_level === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {evalResponse.risk_level}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Action:</span>
                  <span className={`font-bold ${evalResponse.action === 'BLOCK' ? 'text-red-500 underline' : evalResponse.action === 'WARNING' ? 'text-amber-500 underline' : 'text-emerald-400'}`}>
                    {evalResponse.action}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transfer Review Card */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-xs uppercase tracking-[0.28em] text-[#F37021] font-bold">Transfer review</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#0B2545]">Confirm details</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Verify payment summary below. The Saathi AI Shield constantly monitors authorization safety.
          </p>

          <div className="mt-5 space-y-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="flex items-center justify-between gap-4">
              <span>Beneficiary</span>
              <span className="font-semibold text-slate-900 truncate">
                {payeeType === 'saved' ? selectedPayee.name : customPayee || 'None'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Account/UPI</span>
              <span className="font-semibold text-slate-900 truncate">
                {payeeType === 'saved' ? selectedPayee.account : customPayee || 'None'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Amount</span>
              <span className="font-semibold text-slate-900">₹{Number(amount || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Reference</span>
              <span className="font-semibold text-slate-900 truncate">{reference || 'None'}</span>
            </div>
          </div>

          {confirmed ? (
            <div className="mt-5 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
              ✔️ Transfer completed successfully. Transaction reference number has been generated and SMS sent to registered mobile.
            </div>
          ) : (
            <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
              Choose beneficiary type, verify amount, and type in a reference note to activate safety checks.
            </div>
          )}
        </div>

        {/* Payment Rails Info Card */}
        <div className="rounded-[2rem] border border-slate-200 bg-[#081326] p-6 text-white shadow-[0_18px_50px_rgba(8,19,38,0.22)]">
          <p className="text-xs uppercase tracking-[0.28em] text-[#F4B41A] font-bold">Secure Payment Rails</p>
          <div className="mt-4 grid gap-3">
            {['UPI for instant secure bank-to-bank transfers', 'IMPS for immediate 24x7 settlements', 'NEFT / RTGS with RBI liquidity limits'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/80 font-medium leading-5">
                {item}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Fraud Response / Safety Intercept Modal */}
      <FraudDecisionModal
        open={modalOpen}
        title={modalTitle}
        message={modalMessage}
        action={modalAction}
        explanations={modalExplanations}
        onClose={handleCloseModal}
        onProceed={handleProceedAfterWarning}
      />
    </div>
  );
}
