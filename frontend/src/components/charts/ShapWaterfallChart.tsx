'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

export interface ShapContribution {
  feature: string;
  display_name: string;
  value: number;
  evidence?: string;
}

export interface ShapData {
  base_score: number;
  final_score: number;
  contributions: ShapContribution[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPositive = data.rawValue >= 0;
    const scoreChange = isPositive ? `+${data.contribution}%` : `${data.contribution}%`;
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-3 font-sans text-xs shadow-lg">
        <p className="font-bold text-slate-900 mb-1">{data.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Risk Contribution:</span>
          <span className={isPositive ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}>
            {scoreChange}
          </span>
        </div>
        {data.evidence && (
          <p className="mt-1 text-[10px] text-slate-500 border-t border-slate-100 pt-1">
            Evidence: <span className="text-slate-700 font-medium">{data.evidence}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

interface ShapWaterfallChartProps {
  shapData?: ShapData;
}

export function ShapWaterfallChart({ shapData }: ShapWaterfallChartProps) {
  // If there is no SHAP data, show a clean fallback UI state matching the card style
  if (!shapData || !shapData.contributions || shapData.contributions.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#0B2545] border-b border-slate-100 pb-3">
          AI Decision Explainability (SHAP)
        </h3>
        <p className="text-xs text-slate-500 font-mono mt-4 text-center py-4">
          No explainability data available for this session profile.
        </p>
      </div>
    );
  }

  // Pre-process the data for the Recharts BarChart.
  const chartData = shapData.contributions.map((c) => ({
    name: c.display_name,
    contribution: parseFloat(c.value.toFixed(1)),
    evidence: c.evidence || '',
    rawValue: c.value
  }));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-lg font-semibold text-[#0B2545]">
          AI Decision Explainability (SHAP)
        </h3>
        <span className="text-[10px] text-slate-500 font-mono font-semibold">
          Base: {shapData.base_score}% → Final: {shapData.final_score}%
        </span>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-3 my-4 text-center font-mono text-xs border-b border-slate-100 pb-4">
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-2">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">BASE RISK</p>
          <p className="text-sm font-bold text-slate-700">{shapData.base_score}%</p>
        </div>
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-2">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">NET CHANGE</p>
          {shapData.final_score - shapData.base_score >= 0 ? (
            <p className="text-sm font-bold text-red-600">+{shapData.final_score - shapData.base_score}%</p>
          ) : (
            <p className="text-sm font-bold text-emerald-600">{shapData.final_score - shapData.base_score}%</p>
          )}
        </div>
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-2">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">FINAL SCORE</p>
          <p className="text-sm font-bold text-[#0B2545]">{shapData.final_score}%</p>
        </div>
      </div>

      {/* Recharts Horizontal Bar Chart */}
      <div className="h-64 w-full mt-2 select-none">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 15, left: -10, bottom: 5 }}
          >
            <XAxis 
              type="number" 
              stroke="#94a3b8" 
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} 
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              stroke="#94a3b8" 
              tick={{ fill: '#0f172a', fontSize: 10, fontFamily: 'sans-serif' }}
              width={140}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(15, 23, 42, 0.03)' }} />
            <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1} />
            <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.rawValue >= 0 ? '#ef4444' : '#10b981'} 
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Guide */}
      <div className="mt-2 flex items-center justify-center gap-4 text-[10px] font-sans text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded bg-[#ef4444]"></div>
          <span>Risk Escalator (SHAP +)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded bg-[#10b981]"></div>
          <span>Risk Mitigator (SHAP -)</span>
        </div>
      </div>
    </div>
  );
}
