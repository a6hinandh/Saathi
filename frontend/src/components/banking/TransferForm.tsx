'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { accountCards, payees } from '@/lib/constants';
import { useRiskEngine } from '@/hooks/useRiskEngine';
import { FraudDecisionModal } from '@/components/modals/FraudDecisionModal';
import type { RiskEvaluationRequest, RiskEvaluationResponse } from '@/lib/types';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const extractPayeeValue = (account: string) => account.replace(/^UPI:\s*/i, '').trim();
const normalizeText = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const isKycScamPayload = (payload: RiskEvaluationRequest) => {
  const note = normalizeText(payload.note).replace(' fees', ' fee');
  const beneficiary = normalizeText(payload.beneficiary);
  const customBeneficiary = payload.beneficiary_type === 'CUSTOM' || beneficiary.includes('unknown') || beneficiary.includes('agent');
  const scamNote = note.includes('kyc verification') || note.includes('bank verification fee') || note.includes('aadhaar verification') || note.includes('pan verification');
  const behaviorPresent =
    payload.features.typing_variance >= 8000 ||
    payload.features.backspace_rate >= 0.2 ||
    payload.features.avg_key_interval >= 380 ||
    (payload.features.focus_switch_count ?? 0) >= 1;

  return scamNote && customBeneficiary && payload.amount >= 25000 && behaviorPresent;
};

export function TransferForm() {
  const [fromAccount, setFromAccount] = useState(accountCards[0].name);
  const [payeeType, setPayeeType] = useState<'saved' | 'custom'>('saved');
  const [payee, setPayee] = useState(payees[0].name);
  const [customPayee, setCustomPayee] = useState('');
  const [amount, setAmount] = useState('500');
  const [reference, setReference] = useState('dinner');
  const [schedule, setSchedule] = useState('immediate');
  const [confirmed, setConfirmed] = useState(false);
  const [reviewing, setReviewing] = useState(false);

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
  const [pointerDistance, setPointerDistance] = useState(0);
  const [pointerActiveMs, setPointerActiveMs] = useState(0);

  const lastKeyTimeRef = useRef<number | null>(null);
  const lastCommittedAmountRef = useRef<string | null>(amount);
  const firstTextInputAtRef = useRef<number | null>(null);
  const lastPointerRef = useRef<{ x: number; y: number; time: number } | null>(null);

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

  // Hesitation starts on the first text-field input, never from page load.
  useEffect(() => {
    const timer = setInterval(() => {
      if (!firstTextInputAtRef.current) {
        setHesitationSeconds(0);
        return;
      }
      setHesitationSeconds(clamp(Math.round((Date.now() - firstTextInputAtRef.current) / 1000), 0, 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Pointer Events give a device-independent signal for mouse, touch, and pen input.
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const now = Date.now();
      const last = lastPointerRef.current;
      if (last) {
        const dt = now - last.time;
        if (dt >= 16 && dt <= 1000) {
          const dx = e.clientX - last.x;
          const dy = e.clientY - last.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          setPointerDistance((prev) => clamp(prev + distance, 0, 200000));
          setPointerActiveMs((prev) => clamp(prev + dt, 0, 120000));
        }
      }
      lastPointerRef.current = { x: e.clientX, y: e.clientY, time: now };
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  useEffect(() => {
    const recordFocusLoss = () => {
      setFocusSwitchCount((prev) => clamp(prev + 1, 0, 8));
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        recordFocusLoss();
      }
    };

    window.addEventListener('blur', recordFocusLoss);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('blur', recordFocusLoss);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const resetReviewOnly = () => {
    setReviewing(false);
  };

  const startTextInputTelemetry = () => {
    if (!firstTextInputAtRef.current) {
      firstTextInputAtRef.current = Date.now();
      setHesitationSeconds(0);
    }
    resetReviewOnly();
  };

  const commitAmount = (value: string) => {
    const normalized = value.trim();
    if (!normalized || Number.isNaN(Number(normalized))) return;
    const previous = lastCommittedAmountRef.current;
    if (previous !== null && previous !== normalized) {
      setAmountEditCount((prev) => clamp(prev + 1, 0, 5));
    }
    lastCommittedAmountRef.current = normalized;
  };

  // KeyboardEvent is used only for keyboard interactions; raw key sequences are not stored.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    startTextInputTelemetry();
    setTotalKeystrokes((prev) => prev + 1);
    if (e.key === 'Backspace') {
      setBackspaceCount((prev) => clamp(prev + 1, 0, 100));
    }
    const now = Date.now();
    const lastKeyTime = lastKeyTimeRef.current;
    if (lastKeyTime) {
      const interval = now - lastKeyTime;
      if (interval > 0 && interval <= 1500) {
        setKeyIntervals((prev) => [...prev, interval]);
      }
    }
    lastKeyTimeRef.current = now;
    setKeyTimestamps((prev) => [...prev, now]);
  };

  const handlePaste = () => {
    startTextInputTelemetry();
    setPasteCount((prev) => clamp(prev + 1, 0, 3));
  };

  // Derived telemetry metrics
  const validKeyIntervals = useMemo(() => keyIntervals.filter((value) => value > 0 && value <= 1500), [keyIntervals]);

  const avgKeyInterval = validKeyIntervals.length >= 3
    ? clamp(Math.round(validKeyIntervals.reduce((a, b) => a + b, 0) / validKeyIntervals.length), 80, 800)
    : 240;

  const typingVariance = validKeyIntervals.length >= 3
    ? clamp(
        Math.round(
          validKeyIntervals.reduce((sum, val) => sum + Math.pow(val - avgKeyInterval, 2), 0) /
            validKeyIntervals.length
        ),
        0,
        15000
      )
    : 0;

  const effectiveKeyCount = Math.max(totalKeystrokes, 20);
  const backspaceRate = Number(clamp(backspaceCount / effectiveKeyCount, 0, 0.5).toFixed(2));

  const mouseSpeed = pointerActiveMs > 0
    ? clamp(Math.round(pointerDistance / (pointerActiveMs / 1000)), 0, 2000)
    : 400;

  const handleReview = async () => {
    commitAmount(amount);
    if (!reviewing) {
      setReviewing(true);
      return;
    }
    const reviewHesitationSeconds = firstTextInputAtRef.current
      ? clamp(Math.round((Date.now() - firstTextInputAtRef.current) / 1000), 0, 60)
      : 0;
    setHesitationSeconds(reviewHesitationSeconds);
    const finalBeneficiary = payeeType === 'saved' ? extractPayeeValue(selectedPayee.account) : customPayee.trim();

    const payload: RiskEvaluationRequest = {
      customer_id: 'CUST-10021',
      session_id: sessionId,
      amount: Number(amount || 0),
      beneficiary: finalBeneficiary || 'Unknown',
      beneficiary_type: payeeType === 'saved' ? 'SAVED' : 'CUSTOM',
      note: reference || '',
      device_id: 'demo-device',
      features: {
        avg_key_interval: avgKeyInterval,
        typing_variance: typingVariance,
        backspace_rate: backspaceRate,
        mouse_speed: mouseSpeed,
        confirmation_delay: reviewHesitationSeconds,
        amount_edit_count: clamp(amountEditCount, 0, 5),
        focus_switch_count: clamp(focusSwitchCount, 0, 8),
        paste_count: clamp(pasteCount, 0, 3),
        hesitation_delay: reviewHesitationSeconds
      }
    };

    try {
      const res = await evaluate(payload);
      const emergencyScam = isKycScamPayload(payload);
      const effectiveResponse: RiskEvaluationResponse = emergencyScam && res.action !== 'BLOCK'
        ? {
            ...res,
            final_risk_score: Math.max(res.final_risk_score, 90),
            risk_level: 'CRITICAL',
            action: 'BLOCK',
            summary: 'URGENT: This appears to be a scam-guided payment. The transaction has been blocked for your safety. End any call or chat instructing you to pay and contact 1930.',
            coercion_label: 'SCAM_GUIDED',
            explanation: [
              'Transfer note matches scam-like KYC verification payment patterns.',
              'Beneficiary is a custom or external UPI handle.',
              'High-value transfer to unknown beneficiary.',
              'Transaction blocked for customer safety.'
            ]
          }
        : res;

      setEvalResponse(effectiveResponse);
      if (effectiveResponse.action === 'BLOCK' || effectiveResponse.action === 'STEP_UP') {
        const scamGuided = effectiveResponse.coercion_label === 'SCAM_GUIDED';
        setModalTitle(scamGuided ? 'Urgent Scam Warning' : effectiveResponse.action === 'BLOCK' ? 'Transaction Blocked' : 'Step-Up Verification Required');
        setModalMessage(
          scamGuided
            ? effectiveResponse.summary || 'URGENT: This appears to be a scam-guided payment. The transaction has been blocked for your safety. End any call or chat instructing you to pay and contact 1930.'
            : effectiveResponse.summary || 'Our AI security systems detected high indicators of coercion or scam. To protect your funds, this transfer has been blocked.'
        );
        setModalExplanations(effectiveResponse.explanation || []);
        setModalAction(effectiveResponse.action);
        setModalOpen(true);
      } else if (effectiveResponse.action === 'WARNING') {
        setModalTitle('Security Warning');
        setModalMessage('Caution: Suspicious behavior patterns detected. If you are being guided by anyone on a call to make this transfer, hang up immediately. Scammers often impersonate customer support, bank officials, or law enforcement.');
        setModalExplanations(effectiveResponse.explanation || []);
        setModalAction('WARNING');
        setModalOpen(true);
      } else {
        // ALLOW
        setConfirmed(true);
        setReviewing(false);
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
                  resetReviewOnly();
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
                  resetReviewOnly();
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
                onChange={(event) => {
                  setPayee(event.target.value);
                  resetReviewOnly();
                }}
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
                onChange={(event) => {
                  setCustomPayee(event.target.value);
                  startTextInputTelemetry();
                }}
                onKeyDown={handleKeyDown}
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
                startTextInputTelemetry();
              }}
              onKeyDown={handleKeyDown}
              onBlur={(event) => commitAmount(event.target.value)}
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
              onChange={(event) => {
                setReference(event.target.value);
                startTextInputTelemetry();
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
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
            {loading ? 'Evaluating...' : reviewing ? 'Confirm Transfer' : 'Review & Transfer'}
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
