// @ts-nocheck

// src/components/performancemetrics/PerformanceMetrics.tsx

import React, { useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

interface TradeMetric {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

interface EquityCurvePoint {
  timestamp: string;
  equity: number;
  drawdown: number;
  return: number;
}

interface PerformanceMetricsProps {
  metrics: TradeMetric;
  equityCurve: EquityCurvePoint[];
  variant?: 'default' | 'detailed' | 'compact';
  theme?: 'light' | 'dark';
  showChart?: boolean;
  period?: 'day' | 'week' | 'month' | 'year' | 'all';
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercent = (value: number) => {
  return `${value.toFixed(2)}%`;
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const PerformanceMetrics = ({
  metrics,
  equityCurve,
  variant = 'default',
  theme = 'light',
  showChart = true,
  period = 'month'
}: PerformanceMetricsProps) => {
  const isDark = theme === 'dark';

  const baseClasses = `
    w-full overflow-hidden border rounded-lg
    ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}
    ${isDark ? 'text-neutral-100' : 'text-neutral-900'}
  `;

  const positiveMetricClasses = `text-emerald-500 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`;
  const negativeMetricClasses = `text-rose-500 ${isDark ? 'bg-rose-500/10' : 'bg-rose-50'}`;
  const neutralMetricClasses = `text-neutral-500 ${isDark ? 'bg-neutral-800' : 'bg-neutral-100'}`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className={`
        p-2 rounded-lg shadow-lg border
        ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}
      `}>
        <p className="text-sm font-mono mb-1">
          {new Date(label).toLocaleDateString()}
        </p>
        {payload.map((item, index) => (
          <p key={index} className="text-xs" style={{ color: item.color }}>
            {item.name}: {item.name === 'Drawdown' ? formatPercent(item.value) : formatCurrency(item.value)}
          </p>
        ))}
      </div>
    );
  };

  const renderMetricsGrid = () => {
    if (variant === 'detailed') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
          <MetricCard
            title="Win Rate"
            value={formatPercent(metrics.winRate)}
            className={metrics.winRate > 50 ? positiveMetricClasses : negativeMetricClasses}
            icon={metrics.winRate > 50 ? TrendingUp : TrendingDown}
          />
          <MetricCard
            title="Profit Factor"
            value={formatNumber(metrics.profitFactor)}
            className={metrics.profitFactor > 1 ? positiveMetricClasses : negativeMetricClasses}
            icon={metrics.profitFactor > 1 ? ArrowUpRight : ArrowDownRight}
          />
          <MetricCard
            title="Sharpe Ratio"
            value={formatNumber(metrics.sharpeRatio)}
            className={metrics.sharpeRatio > 1 ? positiveMetricClasses : negativeMetricClasses}
            icon={Activity}
          />
          <MetricCard
            title="Max Drawdown"
            value={formatPercent(metrics.maxDrawdown)}
            className={negativeMetricClasses}
            icon={TrendingDown}
          />
          <MetricCard
            title="Total Trades"
            value={metrics.totalTrades}
            className={neutralMetricClasses}
          />
          <MetricCard
            title="Average Win"
            value={formatCurrency(metrics.avgWin)}
            className={positiveMetricClasses}
          />
          <MetricCard
            title="Average Loss"
            value={formatCurrency(metrics.avgLoss)}
            className={negativeMetricClasses}
          />
          <MetricCard
            title="Largest Win"
            value={formatCurrency(metrics.largestWin)}
            className={positiveMetricClasses}
          />
        </div>
      );
    }

    // Default variant
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <MetricCard
          title="Win Rate"
          value={formatPercent(metrics.winRate)}
          className={metrics.winRate > 50 ? positiveMetricClasses : negativeMetricClasses}
          icon={metrics.winRate > 50 ? TrendingUp : TrendingDown}
        />
        <MetricCard
          title="Profit Factor"
          value={formatNumber(metrics.profitFactor)}
          className={metrics.profitFactor > 1 ? positiveMetricClasses : negativeMetricClasses}
          icon={metrics.profitFactor > 1 ? ArrowUpRight : ArrowDownRight}
        />
        <MetricCard
          title="Sharpe Ratio"
          value={formatNumber(metrics.sharpeRatio)}
          className={metrics.sharpeRatio > 1 ? positiveMetricClasses : negativeMetricClasses}
          icon={Activity}
        />
        <MetricCard
          title="Max Drawdown"
          value={formatPercent(metrics.maxDrawdown)}
          className={negativeMetricClasses}
          icon={TrendingDown}
        />
      </div>
    );
  };

  const MetricCard = ({ title, value, className, icon: Icon }) => (
    <div className={`p-4 rounded-lg ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium opacity-75">{title}</p>
          <p className="text-lg font-mono mt-1">{value}</p>
        </div>
        {Icon && <Icon className="h-4 w-4" />}
      </div>
    </div>
  );

  return (
    <div className={baseClasses}>
      <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex justify-between items-center text-sm">
          <span>Performance Metrics</span>
          <select
            value={period}
            onChange={(e) => console.log('Period changed:', e.target.value)}
            className={`
              text-sm border-0 bg-transparent focus:ring-0 
              ${isDark ? 'text-neutral-400' : 'text-neutral-500'}
            `}
          >
            <option value="day">24H</option>
            <option value="week">1W</option>
            <option value="month">1M</option>
            <option value="year">1Y</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      {renderMetricsGrid()}

      {showChart && (
        <div className="p-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={equityCurve}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                  stroke={isDark ? '#525252' : '#a3a3a3'}
                />
                <YAxis
                  yAxisId="equity"
                  tickFormatter={formatCurrency}
                  stroke={isDark ? '#525252' : '#a3a3a3'}
                />
                <YAxis
                  yAxisId="drawdown"
                  orientation="right"
                  tickFormatter={formatPercent}
                  stroke={isDark ? '#525252' : '#a3a3a3'}
                />
                <Tooltip content={<CustomTooltip />} />
                
                <defs>
                  <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                
                <Area
                  type="monotone"
                  dataKey="equity"
                  yAxisId="equity"
                  stroke="#10B981"
                  fill="url(#equityGradient)"
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="drawdown"
                  yAxisId="drawdown"
                  stroke="#EF4444"
                  strokeDasharray="3 3"
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetrics;

