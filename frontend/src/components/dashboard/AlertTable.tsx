const rows = [
  { customer: 'Priya Sharma', action: 'COMPLETED', score: 91, label: 'UPI transfer', time: '09:42' },
  { customer: 'Raghav Iyer', action: 'PENDING', score: 74, label: 'Scheduled payment', time: '10:18' },
  { customer: 'Meera Nair', action: 'POSTED', score: 22, label: 'Salary credit', time: '10:51' }
];

export function AlertTable() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent activity</h2>
        <span className="text-sm text-slate-500">Live feed</span>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.map((row) => (
              <tr key={`${row.customer}-${row.time}`}>
                <td className="px-4 py-4 font-medium">{row.customer}</td>
                <td className="px-4 py-4">INR 18,500</td>
                <td className="px-4 py-4">{row.label}</td>
                <td className="px-4 py-4">{row.action}</td>
                <td className="px-4 py-4 text-slate-500">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
