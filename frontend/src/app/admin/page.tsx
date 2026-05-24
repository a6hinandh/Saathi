'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AlertTable, DashboardAlertItem } from '@/components/dashboard/AlertTable';
import { FraudOverviewCards } from '@/components/dashboard/FraudOverviewCards';
import { FraudHeatmap } from '@/components/dashboard/FraudHeatmap';
import { FraudTimeline } from '@/components/dashboard/FraudTimeline';
import { RiskSignalRail } from '@/components/dashboard/RiskSignalRail';
import { FraudInsightPanel } from '@/components/dashboard/FraudInsightPanel';
import { ShapWaterfallChart } from '@/components/charts/ShapWaterfallChart';
import { api } from '@/lib/api';


export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [alerts, setAlerts] = useState<DashboardAlertItem[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<DashboardAlertItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch overview stats and live threat feed
  const fetchData = useCallback(async (isInitial = false) => {
    try {
      const res = await api.get('/admin/overview');
      setStats(res.data.stats);
      setAlerts(res.data.recent_alerts);
      
      if (res.data.recent_alerts.length > 0) {
        // If initial load or currently selected alert is no longer in feed, select first one
        if (isInitial || !selectedAlert) {
          setSelectedAlert(res.data.recent_alerts[0]);
        } else {
          // Sync selectedAlert with fresh data if it exists in the new list
          const currentInNewList = res.data.recent_alerts.find(
            (a: any) => a.session_id === selectedAlert.session_id
          );
          if (currentInNewList) {
            setSelectedAlert(currentInNewList);
          }
        }
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching admin overview:', err);
      if (isInitial) {
        setError('Failed to load dashboard data. Ensure the backend FastAPI server is running on port 8000.');
      }
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  }, [selectedAlert]);

  // Poll for live alerts updates every 3 seconds
  useEffect(() => {
    const initialLoad = setTimeout(() => {
      void fetchData(true);
    }, 0);
    const interval = setInterval(() => {
      void fetchData(false);
    }, 3000);
    return () => {
      clearTimeout(initialLoad);
      clearInterval(interval);
    };
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060D1A] text-cyan-400 font-mono">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm tracking-widest uppercase">Initializing Saathi Fraud Command Console...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060D1A] text-red-400 font-mono p-6">
        <div className="max-w-md text-center space-y-4 border border-red-500/20 p-8 rounded-3xl bg-red-950/10">
          <p className="text-4xl">⚠️</p>
          <h2 className="text-xl font-bold uppercase tracking-wider">Connection Failure</h2>
          <p className="text-xs text-slate-400 leading-5">{error}</p>
          <button
            onClick={() => fetchData(true)}
            className="mt-4 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Map backend stats to cards format
  const statsCards = stats
    ? [
        {
          label: 'Active Portal Sessions',
          value: stats.active_sessions.toString(),
          hint: 'Live user telemetry streams',
          tone: 'safe' as const
        },
        {
          label: 'Critical Blocks',
          value: stats.critical_blocks.toString(),
          hint: 'Coercion scam vectors blocked',
          tone: 'block' as const
        },
        {
          label: 'Flagged Warn / StepUp',
          value: (stats.warning_count + stats.step_up_count).toString(),
          hint: 'Threat indicators warned',
          tone: 'warn' as const
        },
        {
          label: 'Average Risk Score',
          value: `${stats.average_risk_score}%`,
          hint: 'System-wide risk index',
          tone: 'safe' as const
        }
      ]
    : [];

  // Map selected alert details to other components
  const heatmapCells = selectedAlert
    ? [
        {
          label: 'Typing Rhythm',
          value: selectedAlert.explanation.some(
            (e) => e.includes('typing') || e.includes('edits') || e.includes('variance')
          )
            ? 86
            : 24,
          detail: selectedAlert.explanation.some(
            (e) => e.includes('typing') || e.includes('edits') || e.includes('variance')
          )
            ? 'Irregular keystroke rhythm'
            : 'Normal key intervals'
        },
        {
          label: 'Hesitation Pace',
          value: selectedAlert.explanation.some(
            (e) => e.includes('hesitation') || e.includes('pause') || e.includes('delay')
          )
            ? 91
            : 18,
          detail: selectedAlert.explanation.some(
            (e) => e.includes('hesitation') || e.includes('pause') || e.includes('delay')
          )
            ? 'Hesitation signature matching scam'
            : 'Direct payment pace'
        },
        {
          label: 'Clipboard Activity',
          value: selectedAlert.explanation.some((e) => e.includes('paste') || e.includes('Note'))
            ? 95
            : 0,
          detail: selectedAlert.explanation.some((e) => e.includes('paste') || e.includes('Note'))
            ? 'Suspected clipboard paste action'
            : 'Direct keyboard input'
        },
        {
          label: 'Scam Context Probability',
          value: selectedAlert.risk_score >= 80 ? 98 : selectedAlert.risk_score >= 50 ? 60 : 14,
          detail: selectedAlert.risk_score >= 80 ? 'High scam keywords hit' : 'Standard note verified'
        }
      ]
    : [
        { label: 'Typing Rhythm', value: 12, detail: 'Calibrated baseline' },
        { label: 'Hesitation Pace', value: 15, detail: 'Fluent pace' },
        { label: 'Clipboard Activity', value: 0, detail: 'Inactive' },
        { label: 'Scam Context Probability', value: 8, detail: 'Benign note content' }
      ];

  const signals = selectedAlert
    ? [
        {
          label: 'Coercion Classification',
          score: selectedAlert.risk_score / 100,
          tone: selectedAlert.action === 'BLOCK' ? ('block' as const) : selectedAlert.action === 'WARNING' ? ('warn' as const) : ('safe' as const)
        },
        {
          label: 'Scam Note Classifier',
          score: selectedAlert.coercion_label === 'SCAM_GUIDED' ? 0.99 : selectedAlert.coercion_label === 'UNCERTAIN' ? 0.56 : 0.18,
          tone: selectedAlert.coercion_label === 'SCAM_GUIDED' ? ('block' as const) : selectedAlert.coercion_label === 'UNCERTAIN' ? ('warn' as const) : ('safe' as const)
        },
        {
          label: 'Behavioral Anomaly Engine',
          score: selectedAlert.explanation.length > 2 ? 0.88 : selectedAlert.explanation.length > 0 ? 0.48 : 0.22,
          tone: selectedAlert.explanation.length > 2 ? ('block' as const) : selectedAlert.explanation.length > 0 ? ('warn' as const) : ('safe' as const)
        }
      ]
    : [];

  const timelineEvents = selectedAlert
    ? [
        {
          title: 'Secure Session Bound',
          detail: `Bound device_id: demo-device, session_id: ${selectedAlert.session_id}`,
          time: '10:15:42 IST',
          tone: 'safe' as const
        },
        {
          title: 'Beneficiary Analysis completed',
          detail: `Beneficiary checked: ${selectedAlert.beneficiary}`,
          time: 'T-10s',
          tone: selectedAlert.beneficiary.includes('@upi') ? ('warn' as const) : ('safe' as const)
        },
        {
          title: 'Behavior Signature Extracted',
          detail: 'Hesitation delays and backspace editing counts captured',
          time: 'T-4s',
          tone: selectedAlert.explanation.length > 1 ? ('warn' as const) : ('safe' as const)
        },
        {
          title: 'Isolation Forest Policy Intercepted',
          detail: `Transaction action set to: ${selectedAlert.action} (Risk Score: ${selectedAlert.risk_score})`,
          time: 'T-0s',
          tone: selectedAlert.action === 'BLOCK' ? ('block' as const) : selectedAlert.action === 'WARNING' ? ('warn' as const) : ('safe' as const)
        }
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#060D1A] text-slate-100 p-6 xl:p-8 font-sans">
      {/* Top Console Bar */}
      <header className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F37021] text-white shadow-lg shadow-[#F37021]/20 font-bold text-lg">
            S⚙️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#F37021]">Saathi Bank of India</p>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                Model: Operational
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-0.5">Fraud Operations Control Center</h1>
          </div>
        </div>
        <div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-5 py-2.5 text-xs font-bold text-slate-200 transition hover:bg-slate-700 hover:text-white"
          >
            ← Return to Customer Portal
          </Link>
        </div>
      </header>

      {/* Stats Summary Panel */}
      <section className="mt-8">
        <FraudOverviewCards cards={statsCards} />
      </section>

      {/* Main Console Interface Grid */}
      <div className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          {/* Active alerts threat list */}
          <AlertTable
            alerts={alerts}
            selectedAlert={selectedAlert}
            onSelectAlert={setSelectedAlert}
          />
          {/* Risk Heatmap block (Full Width - UP) */}
          <FraudHeatmap cells={heatmapCells} />
          
          {/* AI Decision Explainability SHAP Chart (Full Width - DOWN) */}
          <ShapWaterfallChart shapData={selectedAlert?.metadata?.shap_explanation} />
        </div>

        <aside className="space-y-6">
          {/* Telemetry and Signals side by side on tablet/laptop but stacked on xl and mobile */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
            {/* Session telemetry inspector styled as a clean white card */}
            {selectedAlert ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-lg font-semibold text-[#0B2545]">Session Telemetry Inspector</h2>
                  <span className="text-[10px] text-slate-400 font-mono">Console Log V1.0.8</span>
                </div>
                <div className="mt-4 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium font-sans">SESSION ID  :</span> <span className="text-slate-800 font-semibold font-mono">{selectedAlert.session_id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium font-sans">CUSTOMER ID :</span> <span className="text-slate-800 font-semibold font-mono">{selectedAlert.customer_id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium font-sans">BENEFICIARY :</span> <span className="text-slate-800 font-semibold font-mono">{selectedAlert.beneficiary}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium font-sans">TX AMOUNT   :</span> <span className="text-slate-800 font-semibold font-mono">₹{selectedAlert.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium font-sans">COERCION LBL:</span> <span className={`font-bold font-mono ${selectedAlert.coercion_label === 'SCAM_GUIDED' ? 'text-red-600' : 'text-amber-600'}`}>{selectedAlert.coercion_label}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium font-sans">TIMESTAMP   :</span> <span className="text-slate-800 font-semibold font-mono">{selectedAlert.timestamp}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-500 text-xs shadow-sm">
                Select an alert from the Threat Feed to inspect deep behavior metrics.
              </div>
            )}

            {/* Component Risk Signal Rails */}
            {selectedAlert && <RiskSignalRail signals={signals} />}
          </div>

          {/* Explainability Insight Box & Timeline side-by-side on tablet/laptop but stacked on xl and mobile */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
            {/* Explainability Insight Box */}
            {selectedAlert && (
              <FraudInsightPanel
                title={selectedAlert.coercion_label === 'SCAM_GUIDED' ? 'Critical Scam Intercept' : 'Coercion Evaluation'}
                summary={selectedAlert.summary}
                bullets={selectedAlert.explanation}
              />
            )}

            {/* Timeline chart */}
            {selectedAlert && <FraudTimeline events={timelineEvents} />}
          </div>
        </aside>
      </div>
    </div>
  );
}
