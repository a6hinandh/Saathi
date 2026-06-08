'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { accountCards, payees } from '@/lib/constants';
import { useRiskEngine } from '@/hooks/useRiskEngine';
import { FraudDecisionModal } from '@/components/modals/FraudDecisionModal';
import type { RiskEvaluationRequest, RiskEvaluationResponse, BehaviorFeatures } from '@/lib/types';
import { useSaathiTracker } from '@/saathi-sdk';

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

  // Initialize Saathi SDK Telemetry Tracker hook
  const { getSnapshot, recordAmountEdit, recordFocusSwitch, recordPaste } = useSaathiTracker();

  // State for live visual updates in the telemetry dashboard panel
  const [liveFeatures, setLiveFeatures] = useState<BehaviorFeatures>({
    avg_key_interval: 0,
    typing_variance: 0,
    backspace_rate: 0,
    mouse_speed: 950,
    confirmation_delay: 0,
    amount_edit_count: 0,
    focus_switch_count: 0,
    paste_count: 0,
    hesitation_delay: 0
  });

  // Poll the SDK tracker snapshot to update live visual dashboard in real time
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveFeatures(getSnapshot());
    }, 500);
    return () => clearInterval(timer);
  }, [getSnapshot]);

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

  const resetReviewOnly = () => {
    setReviewing(false);
    setEvalResponse(null);
  };

  const handleReview = async () => {
    const finalBeneficiary = payeeType === 'saved' ? selectedPayee.name : customPayee;
    const telemetryFeatures = getSnapshot();

    const payload: RiskEvaluationRequest = {
      customer_id: 'CUST-10021',
      session_id: sessionId,
      amount: parseFloat(amount) || 0,
      beneficiary: finalBeneficiary,
      beneficiary_type: payeeType === 'saved' ? 'SAVED' : 'CUSTOM',
      note: reference,
      device_id: 'demo-device',
      features: telemetryFeatures
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
        setModalTitle(effectiveResponse.action === 'BLOCK' ? 'Transaction Blocked' : 'Verification Required');
        setModalMessage(effectiveResponse.summary || 'Our AI security systems detected high indicators of coercion or scam. To protect your funds, this transfer has been blocked.');
        setModalExplanations(effectiveResponse.explanation || []);
        setModalAction(effectiveResponse.action);
        setModalOpen(true);
      } else if (effectiveResponse.action === 'WARNING') {
        setModalTitle('Security Alert');
        setModalMessage(effectiveResponse.summary || 'Some hesitation or unusual patterns were detected during this input.');
        setModalExplanations(effectiveResponse.explanation || []);
        setModalAction(effectiveResponse.action);
        setModalOpen(true);
      } else {
        // ALLOW
        setConfirmed(true);
      }
    } catch (err) {
      console.error(err);
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
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] animate-fadeIn">
      {/* Input panel */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div>
          <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#F37021]">Core Banking Net</p>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Initiate Transfer</h2>
        </div>

        {/* Info card */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200/60 p-4 flex justify-between items-center text-xs font-semibold text-slate-500">
          <div>
            Active Account: <strong className="text-slate-800">{selectedAccount.name}</strong>
          </div>
          <div className="text-slate-400">
            Limit: ₹1,50,000 / Day
          </div>
        </div>

        <div className="grid gap-5">
          {/* Source Account */}
          <label className="space-y-2 text-xs font-bold text-slate-600">
            Source account
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/15 text-slate-800 text-sm font-semibold"
              value={fromAccount}
              onChange={(event) => {
                setFromAccount(event.target.value);
                resetReviewOnly();
              }}
              onFocus={recordFocusSwitch}
            >
              {accountCards.map((account) => (
                <option key={account.name} value={account.name}>
                  {account.name} ({account.number}) — {account.balance}
                </option>
              ))}
            </select>
          </label>

          {/* Beneficiary Type */}
          <div className="space-y-2 text-xs font-bold text-slate-600">
            <span className="block">Beneficiary type</span>
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold border transition ${
                  payeeType === 'saved'
                    ? 'bg-[#0B2545] border-[#0B2545] text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
                onClick={() => {
                  setPayeeType('saved');
                  resetReviewOnly();
                  recordFocusSwitch();
                }}
              >
                Saved Payee
              </button>
              <button
                type="button"
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold border transition ${
                  payeeType === 'custom'
                    ? 'bg-[#0B2545] border-[#0B2545] text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
                onClick={() => {
                  setPayeeType('custom');
                  resetReviewOnly();
                  recordFocusSwitch();
                }}
              >
                Pay Custom UPI / Account
              </button>
            </div>
          </div>

          {/* Beneficiary Details */}
          <label className="space-y-2 text-xs font-bold text-slate-600">
            Beneficiary details
            {payeeType === 'saved' ? (
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/15 text-slate-800 text-sm font-semibold"
                value={payee}
                onChange={(event) => {
                  setPayee(event.target.value);
                  resetReviewOnly();
                }}
                onFocus={recordFocusSwitch}
              >
                {payees.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name} — {item.account}
                  </option>
                ))}
              </select>
            ) : (
              <div className="relative">
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/15 text-slate-800 text-sm font-semibold pr-10"
                  value={customPayee}
                  onChange={(event) => {
                    setCustomPayee(event.target.value);
                    resetReviewOnly();
                  }}
                  onFocus={recordFocusSwitch}
                  placeholder="Enter UPI ID (e.g. suspect_agent@upi) or Bank Account"
                />
              </div>
            )}
          </label>

          {/* Amount */}
          <label className="space-y-2 text-xs font-bold text-slate-600">
            Amount
            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/15 text-slate-800 text-sm font-semibold"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                resetReviewOnly();
                recordAmountEdit();
              }}
              onFocus={recordFocusSwitch}
              inputMode="numeric"
              placeholder="18500"
            />
          </label>

          {/* Transfer Mode */}
          <label className="space-y-2 text-xs font-bold text-slate-600">
            Transfer mode
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/15 text-slate-800 text-sm font-semibold"
              value={schedule}
              onChange={(event) => {
                setSchedule(event.target.value);
                resetReviewOnly();
              }}
              onFocus={recordFocusSwitch}
            >
              <option value="immediate">Immediate payment (IMPS/UPI)</option>
              <option value="scheduled">Schedule for later (NEFT)</option>
              <option value="recurring">Recurring transfer</option>
            </select>
          </label>

          {/* Reference Note */}
          <label className="space-y-2 text-xs font-bold text-slate-600">
            Reference note
            <div className="relative">
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0B2545]/40 focus:ring-2 focus:ring-[#0B2545]/15 text-slate-800 text-sm font-semibold"
                value={reference}
                onChange={(event) => {
                  setReference(event.target.value);
                  resetReviewOnly();
                }}
                onPaste={recordPaste}
                onFocus={recordFocusSwitch}
                placeholder="Rent payment, school fee, KYC update, digital arrest protection, etc."
              />
              {(liveFeatures.hesitation_delay ?? 0) > 4 && (
                <span className="absolute right-3.5 top-3.5 text-[10px] font-black text-amber-500 uppercase tracking-wider animate-pulse">
                  Hesitation Delay
                </span>
              )}
            </div>
          </label>
        </div>

        {/* Dynamic Summary Tags */}
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
          {[
            { label: 'From Account', value: selectedAccount.number },
            { label: 'Beneficiary', value: payeeType === 'saved' ? selectedPayee.name : customPayee || 'Not specified' },
            { label: 'Limit Usage', value: '12.3% Used' }
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3.5 shadow-2xs">
              <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">{item.label}</p>
              <p className="mt-1 text-xs font-bold text-slate-800 truncate">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            className="bg-[#0B2545] text-white hover:bg-[#134074] shadow-sm disabled:opacity-50 min-w-40 font-extrabold text-xs tracking-wider uppercase"
            onClick={handleReview}
            disabled={loading}
          >
            {loading ? 'Evaluating Risk...' : reviewing ? 'Confirm Transfer' : 'Review & Transfer'}
          </Button>
          <Link href="/beneficiary" className="rounded-full border border-slate-200 hover:bg-slate-50 px-5 py-3 text-xs font-extrabold text-slate-600 transition tracking-wider uppercase">
            Manage Payees
          </Link>
        </div>
      </section>

      {/* Saathi SDK Terminal HUD */}
      <aside className="space-y-6">
        {/* Telemetry Dashboard */}
        <div className="rounded-3xl border border-cyan-500/20 bg-slate-900 p-6 text-cyan-400 font-mono shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none z-0"></div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] font-black text-cyan-400">Saathi Telemetry HUD</span>
              </div>
              <span className="text-[9px] text-cyan-500/50 uppercase font-black tracking-wider">Active Capture Stream</span>
            </div>

            {/* Telemetry metrics list */}
            <div className="space-y-4 text-[11px]">
              {[
                { label: 'Avg Key Interval', value: `${liveFeatures.avg_key_interval} ms`, desc: 'Keystroke speed', status: liveFeatures.avg_key_interval > 300 ? 'SLOW / HESITANT' : 'NORMAL' },
                { label: 'Typing Variance', value: `${liveFeatures.typing_variance} ms²`, desc: 'Typing rhythm regularity', status: liveFeatures.typing_variance > 50000 ? 'UNSTABLE / STRESSED' : 'NORMAL' },
                { label: 'Backspace Rate', value: `${(liveFeatures.backspace_rate * 100).toFixed(0)}%`, desc: 'Ratio of deletes to total keys', status: liveFeatures.backspace_rate > 0.15 ? 'HIGH CORRECTIONS' : 'NORMAL' },
                { label: 'Focus Switch Count', value: liveFeatures.focus_switch_count ?? 0, desc: 'Switches outside browser window', status: (liveFeatures.focus_switch_count ?? 0) > 1 ? 'SUSPICIOUS / MULTITASK' : 'STABLE' },
                { label: 'Paste Event Count', value: liveFeatures.paste_count ?? 0, desc: 'Clipboard paste detections', status: (liveFeatures.paste_count ?? 0) > 0 ? 'PASTED TARGET' : 'MANUAL INPUT' },
                { label: 'Amount Edit Count', value: liveFeatures.amount_edit_count, desc: 'Number of times amount field updated', status: liveFeatures.amount_edit_count > 2 ? 'HIGH HESITATION' : 'STABLE' },
                { label: 'Hesitation Delay', value: `${liveFeatures.hesitation_delay ?? 0} s`, desc: 'Total idle time in focused input', status: (liveFeatures.hesitation_delay ?? 0) > 4 ? 'CRITICAL DELAY' : 'NORMAL' }
              ].map((metric) => {
                const isAlert = metric.status !== 'NORMAL' && metric.status !== 'STABLE' && metric.status !== 'MANUAL INPUT';
                return (
                  <div key={metric.label} className="border-b border-cyan-500/10 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-cyan-100 font-bold">{metric.label}:</span>
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="text-white">{metric.value}</span>
                        <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded-sm ${isAlert ? 'bg-amber-400/10 text-amber-400 border border-amber-400/25 animate-pulse' : 'bg-cyan-500/10 text-cyan-400'}`}>
                          {metric.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-[9px] text-cyan-300/50 mt-0.5">{metric.desc}</p>
                  </div>
                );
              })}

              {/* Live Evaluation Box */}
              {evalResponse ? (
                <div className="mt-5 p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-2.5">
                  <p className="text-cyan-400 text-xs font-black uppercase tracking-wider">Policy Engine Evaluation</p>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Risk Assessment Score:</span>
                    <span className={`font-mono font-black text-xs ${evalResponse.final_risk_score > 75 ? 'text-red-400' : evalResponse.final_risk_score > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {evalResponse.final_risk_score} / 100
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Risk Classification:</span>
                    <span className={`font-black ${evalResponse.risk_level === 'CRITICAL' || evalResponse.risk_level === 'HIGH' ? 'text-red-400' : evalResponse.risk_level === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {evalResponse.risk_level}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Assigned Policy Action:</span>
                    <span className={`font-black underline ${evalResponse.action === 'BLOCK' ? 'text-red-500' : evalResponse.action === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {evalResponse.action}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-5 p-3.5 rounded-xl border border-cyan-500/10 bg-cyan-950/5 text-center text-[10px] text-cyan-500/40 font-bold uppercase tracking-wider">
                  Waiting for transaction submission
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Demo Demonstration Script Guide */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#F37021] font-bold">Showcase Scripts</p>
          <h3 className="text-lg font-black text-slate-800 tracking-tight mt-1">Demonstration Guide</h3>
          <div className="mt-4 space-y-4 text-xs">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <p className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block text-[8px] text-white flex items-center justify-center font-black">A</span>
                Scenario A: Normal Flow (ALLOW)
              </p>
              <p className="text-slate-600 mt-1.5 leading-relaxed text-[11px] font-semibold">
                Type an amount like <strong className="text-slate-700">₹18,500</strong>, write note <strong className="text-slate-700">"Rent payment"</strong> at a steady speed. Click Transfer. Risk score will be low, allowing immediate completion.
              </p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50/30 p-4">
              <p className="font-extrabold text-red-800 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block text-[8px] text-white flex items-center justify-center font-black">B</span>
                Scenario B: Scam/Coerced Flow (BLOCK)
              </p>
              <p className="text-slate-600 mt-1.5 leading-relaxed text-[11px] font-semibold">
                1. Select <strong className="text-slate-700">Pay Custom UPI</strong> and paste a custom ID (e.g. <code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded font-mono">agent_99@upi</code>).<br/>
                2. Write note: <code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded font-mono">KYC update fee</code> or <code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded font-mono">digital arrest protection</code>.<br/>
                3. Type slowly, use backspaces repeatedly to change numbers, and click outside the window/inputs multiple times. Click Transfer.<br/>
                4. Saathi will intercept the transaction and trigger a warning/block modal.
              </p>
            </div>
          </div>
        </div>

        {/* Transfer Confirmation State */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-black text-[#0B2545] tracking-tight border-b pb-3 mb-3 uppercase">Review Ledger Status</h3>
          {confirmed ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-relaxed text-emerald-955 font-bold flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Payment completed successfully. The transaction has been broadcast and verified. SMS notification dispatched.
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs leading-relaxed text-slate-500 font-semibold">
              Fill in the beneficiary details, enter payment amount, and submit transfer review. The Saathi telemetry engine is ready to capture inputs.
            </div>
          )}
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
