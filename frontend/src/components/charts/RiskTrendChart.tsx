'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { time: '09:00', risk: 18 },
  { time: '10:00', risk: 27 },
  { time: '11:00', risk: 38 },
  { time: '12:00', risk: 64 },
  { time: '13:00', risk: 91 }
];

export function RiskTrendChart() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Risk trend</h2>
      <p className="mt-2 text-sm text-slate-500">Behavioral and transaction risk across active sessions.</p>
      <div className="mt-6 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#163f9f" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#163f9f" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Area type="monotone" dataKey="risk" stroke="#163f9f" fill="url(#riskFill)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
