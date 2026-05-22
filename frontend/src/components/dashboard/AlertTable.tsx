export interface DashboardAlertItem {
  customer_id: string;
  session_id: string;
  beneficiary: string;
  amount: number;
  risk_score: number;
  risk_level: string;
  action: string;
  coercion_label?: string;
  summary: string;
  explanation: string[];
  timestamp: string;
}

interface AlertTableProps {
  alerts?: DashboardAlertItem[];
  selectedAlert?: DashboardAlertItem | null;
  onSelectAlert?: (alert: DashboardAlertItem) => void;
}

const mockRows: DashboardAlertItem[] = [
  {
    customer_id: 'CUST-10021',
    session_id: 'sess_91ad',
    beneficiary: 'unknown_agent@upi',
    amount: 25000,
    risk_score: 91,
    risk_level: 'CRITICAL',
    action: 'BLOCK',
    coercion_label: 'SCAM_GUIDED',
    summary: 'Possible scam-guided payment detected',
    explanation: ['Repeated amount edits', 'High hesitation', 'Scam-like note detected'],
    timestamp: new Date().toISOString()
  },
  {
    customer_id: 'CUST-10022',
    session_id: 'sess_81bc',
    beneficiary: 'trusted_contact@upi',
    amount: 12500,
    risk_score: 56,
    risk_level: 'MEDIUM',
    action: 'WARNING',
    coercion_label: 'UNCERTAIN',
    summary: 'Uncertain payment intent',
    explanation: ['Some hesitation', 'External transfer context'],
    timestamp: new Date().toISOString()
  }
];

export function AlertTable({ alerts = mockRows, selectedAlert, onSelectAlert }: AlertTableProps) {
  const getActionColor = (action: string) => {
    switch (action) {
      case 'BLOCK':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'WARNING':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#0B2545]">Active Threat Feed</h2>
          <p className="text-xs text-slate-500 mt-1">Select a threat log row to inspect behavior vector signatures.</p>
        </div>
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-600 animate-pulse">
          Live Stream
        </span>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold">
            <tr>
              <th className="px-4 py-3">Customer ID</th>
              <th className="px-4 py-3">Beneficiary</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {alerts.map((row, idx) => {
              const isSelected = selectedAlert && selectedAlert.session_id === row.session_id;
              const timeString = new Date(row.timestamp).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              });

              return (
                <tr
                  key={`${row.customer_id}-${idx}`}
                  onClick={() => onSelectAlert?.(row)}
                  className={`cursor-pointer transition hover:bg-slate-50/80 ${isSelected ? 'bg-slate-100 font-medium' : ''}`}
                >
                  <td className="px-4 py-4 text-[#0B2545] font-semibold">{row.customer_id}</td>
                  <td className="px-4 py-4 truncate max-w-[140px] text-slate-600">{row.beneficiary}</td>
                  <td className="px-4 py-4 font-medium text-slate-900">₹{row.amount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-4 font-bold text-slate-800">{row.risk_score}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide ${getActionColor(row.action)}`}>
                      {row.action}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-500 text-xs">{timeString}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
