import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2, PieChart as PieIcon } from 'lucide-react';

// Refined, calm category palette (muted, non-glare colors)
const PALETTE_COLORS = [
  '#149A8C', // Primary Ocean Teal
  '#4A8894', // Slate Teal
  '#CFA055', // Soft Saffron Amber
  '#8E87D4', // Soft Lilac
  '#D97560', // Muted Coral
  '#2EA068', // Muted Sage
  '#4578C9', // Soft Blue
  '#B8764B', // Ochre
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface border border-border px-3 py-2 rounded-lg shadow-popover text-xs text-textPrimary animate-fade-in backdrop-blur-md">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: payload[0].color || payload[0].fill }}
          />
          <span className="text-textSecondary uppercase tracking-wider text-[10px] font-bold">
            {data.category}
          </span>
        </div>
        <p className="text-textPrimary text-xs font-bold font-mono">
          ₹{payload[0].value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

// Compact currency formatter for donut center (e.g., 57100 -> 57.1k)
function formatCompactCurrency(val) {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
  return `₹${val}`;
}

/**
 * 1. One-Row Financial Summary (4 Equal Cards)
 * Matches the reference mockup with compact height and clean typography.
 */
export function MetricCards({ summary }) {
  const { totalIncome, totalExpenses, netBalance } = summary;

  const formatVal = (val) => {
    return `₹${Math.abs(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const savingsRate = totalIncome > 0 ? Math.round((netBalance / totalIncome) * 100) : 0;

  const getSavingsBadge = () => {
    if (totalIncome === 0 && totalExpenses === 0) {
      return { label: 'NO DATA', color: 'text-textSecondary border-border' };
    }
    if (netBalance < 0) {
      return { label: 'DEFICIT', color: 'text-error border-error/30' };
    }
    if (savingsRate >= 50) {
      return { label: 'EXCELLENT', color: 'text-success border-success/30' };
    }
    if (savingsRate >= 20) {
      return { label: 'ON TRACK', color: 'text-primary border-primary/30' };
    }
    return { label: 'TIGHT', color: 'text-tertiary border-tertiary/30' };
  };

  const badge = getSavingsBadge();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {/* 1. Total Inflow */}
      <div className="bg-surface border border-border rounded-xl p-3 sm:p-3.5 shadow-card flex flex-col justify-between">
        <span className="text-[10px] uppercase font-bold tracking-wider text-textSecondary">
          Total Inflow
        </span>
        <div className="my-1.5">
          <h4 className="text-lg sm:text-xl xl:text-2xl font-bold font-mono text-textPrimary tracking-tight">
            {formatVal(totalIncome)}
          </h4>
        </div>
        <p className="text-[11px] font-medium text-success flex items-center gap-1">
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          <span>Income this month</span>
        </p>
      </div>

      {/* 2. Total Outflow */}
      <div className="bg-surface border border-border rounded-xl p-3 sm:p-3.5 shadow-card flex flex-col justify-between">
        <span className="text-[10px] uppercase font-bold tracking-wider text-textSecondary">
          Total Outflow
        </span>
        <div className="my-1.5">
          <h4 className="text-lg sm:text-xl xl:text-2xl font-bold font-mono text-textPrimary tracking-tight">
            {formatVal(totalExpenses)}
          </h4>
        </div>
        <p className="text-[11px] font-medium text-error flex items-center gap-1">
          <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
          <span>Spending recorded</span>
        </p>
      </div>

      {/* 3. Net Cash Flow */}
      <div className="bg-surface border border-border rounded-xl p-3 sm:p-3.5 shadow-card flex flex-col justify-between">
        <span className="text-[10px] uppercase font-bold tracking-wider text-textSecondary">
          Net Cash Flow
        </span>
        <div className="my-1.5">
          <h4 className="text-lg sm:text-xl xl:text-2xl font-bold font-mono text-textPrimary tracking-tight">
            {netBalance < 0 ? '-' : ''}{formatVal(netBalance)}
          </h4>
        </div>
        <p className={`text-[11px] font-medium flex items-center gap-1.5 ${netBalance >= 0 ? 'text-primary' : 'text-error'}`}>
          <span className={`w-2 h-2 rounded-[2px] shrink-0 ${netBalance >= 0 ? 'bg-primary' : 'bg-error'}`} />
          <span>{netBalance >= 0 ? 'Surplus retained' : 'Operating deficit'}</span>
        </p>
      </div>

      {/* 4. Savings Rate */}
      <div className="bg-surface border border-border rounded-xl p-3 sm:p-3.5 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-textSecondary">
            Savings Rate
          </span>
          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${badge.color}`}>
            {badge.label}
          </span>
        </div>
        <div className="my-1.5 flex items-baseline justify-between">
          <h4 className="text-lg sm:text-xl xl:text-2xl font-bold font-mono text-textPrimary tracking-tight">
            {Math.max(savingsRate, 0)}%
          </h4>
          <span className="text-[10px] font-medium text-textSecondary">
            {savingsRate >= 20 ? 'Healthy · 20-50%' : savingsRate >= 50 ? 'High Reserve' : 'Deficit / Low'}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-surface-sunken h-1.5 rounded-full overflow-hidden border border-border/80">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              netBalance < 0
                ? 'bg-error'
                : savingsRate >= 50
                ? 'bg-success'
                : 'bg-primary'
            }`}
            style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * 2. Spending Breakdown (Donut & Bar view with horizontal legend)
 * Matches the reference mockup with center total and clean category pills.
 */
export function SpendingAnalytics({ summary }) {
  const { totalExpenses, expensesByCategory } = summary;
  const [chartType, setChartType] = useState('donut');

  const hasExpenses = expensesByCategory && expensesByCategory.length > 0;

  return (
    <div className="bg-surface border border-border rounded-xl p-3 sm:p-4 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full border border-primary/60 bg-primary/20" />
          <h3 className="text-xs sm:text-sm font-bold text-textPrimary tracking-tight">
            Spending Breakdown
          </h3>
          <span className="text-[10px] text-textSecondary font-medium ml-1">
            {expensesByCategory?.length || 0} active categories
          </span>
        </div>

        {hasExpenses && (
          <div className="flex items-center gap-1 p-0.5 bg-surface-sunken rounded-lg border border-border text-[11px]">
            <button
              type="button"
              onClick={() => setChartType('donut')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all font-semibold ${
                chartType === 'donut'
                  ? 'bg-surface text-textPrimary shadow-sm border border-border font-bold'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
              title="Donut Chart"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Donut</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all font-semibold ${
                chartType === 'bar'
                  ? 'bg-surface text-textPrimary shadow-sm border border-border font-bold'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
              title="Bar Chart"
            >
              <BarChart2 className="w-3 h-3" />
              <span>Bar</span>
            </button>
          </div>
        )}
      </div>

      {!hasExpenses ? (
        <div className="h-28 flex flex-col items-center justify-center text-center p-4 bg-surface-sunken/40 border border-dashed border-border rounded-lg select-none">
          <p className="text-xs font-semibold text-textPrimary">No spending recorded yet</p>
          <p className="text-[10px] text-textSecondary mt-0.5">
            Add expense entries on the left to populate category analytics.
          </p>
        </div>
      ) : (
        <div>
          {/* Chart View */}
          <div className="h-32 sm:h-36 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'donut' ? (
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={54}
                    paddingAngle={3}
                    dataKey="total"
                    nameKey="category"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell
                        key={`donut-cell-${index}`}
                        fill={PALETTE_COLORS[index % PALETTE_COLORS.length]}
                        stroke="var(--surface)"
                        strokeWidth={1.5}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              ) : (
                <BarChart
                  data={expensesByCategory}
                  margin={{ top: 8, right: 10, left: -15, bottom: 0 }}
                >
                  <XAxis
                    dataKey="category"
                    tick={{ fill: 'var(--text-muted)', fontSize: 9, fontWeight: 500 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--text-muted)', fontSize: 9, fontWeight: 500 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--border)', opacity: 0.15 }} />
                  <Bar
                    dataKey="total"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={30}
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PALETTE_COLORS[index % PALETTE_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>

            {/* Donut Center Label */}
            {chartType === 'donut' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] sm:text-xs font-bold font-mono text-textPrimary tracking-tight">
                  {formatCompactCurrency(totalExpenses)}
                </span>
              </div>
            )}
          </div>

          {/* Horizontal Category Legend Row (Matching Mockup) */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-2 border-t border-border mt-1">
            {expensesByCategory.map((item, idx) => {
              const color = PALETTE_COLORS[idx % PALETTE_COLORS.length];
              return (
                <div key={item.category} className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-textSecondary">{item.category}</span>
                  <span className="text-textPrimary font-mono font-semibold">
                    ₹{Math.round(item.total).toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ summary }) {
  return (
    <div>
      <MetricCards summary={summary} />
      <SpendingAnalytics summary={summary} />
    </div>
  );
}
