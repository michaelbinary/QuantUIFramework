// @ts-nocheck

// src/components/pnltracking/PnLTracking.tsx

import React, { useMemo } from 'react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

interface PnLData {
  date: string;
  realized: number;
  unrealized: number;
  cumulative: number;
  fees?: number;
}

interface PnLStats {
  dailyData: PnLData[];
  totalRealized: number;
  totalUnrealized: number;
  bestDay: {
    date: string;
    value: number;
  };
  worstDay: {
    date: string;
    value: number;
  };
  profitDays: number;
  lossDays: number;
}

interface PnLTrackingProps {
  data: PnLStats;
  variant?: 'default' | 'detailed' | 'compact';
  theme?: 'light' | 'dark';
  period?: 'day' | 'week' | 'month' | 'year' | 'all';
  showFees?: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercent = (value: number) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

export const PnLTracking = ({
  data,
  variant = 'default',
  theme = 'light',
  period = 'month',
  showFees = false,
}: PnLTrackingProps) => {
  const isDark = theme === 'dark';

  const baseClasses = `
    w-full overflow-hidden border rounded-lg
    ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}
    ${isDark ? 'text-neutral-100' : 'text-neutral-900'}
  `;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className={`
        p-2 rounded-lg shadow-lg border
        ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}
      `}>
        <p className="text-sm font-medium mb-1">
          {formatDate(label)}
        </p>
        {payload.map((item, index) => (
          <p key={index} className="text-xs" style={{ color: item.color }}>
            {item.name}: {formatCurrency(item.value)}
          </p>
        ))}
      </div>
    );
  };

  const MetricCard = ({ title, value, icon: Icon, subtitle, trend }) => (
    <div className={`p-4 rounded-lg ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-neutral-500" />}
          <span className="text-sm font-medium text-neutral-500">{title}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-mono">{value}</span>
        {trend && (
          <span className={`text-xs ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
      )}
    </div>
  );

  const renderPnLChart = () => (
    <div className="h-64 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data.dailyData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke={isDark ? '#525252' : '#a3a3a3'}
          />
          <YAxis
            tickFormatter={formatCurrency}
            stroke={isDark ? '#525252' : '#a3a3a3'}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <defs>
            <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#10B981"
            fill="url(#pnlGradient)"
            isAnimationActive={false}
          />
          
          {variant === 'detailed' && (
            <>
              <Line
                type="monotone"
                dataKey="realized"
                stroke="#2563EB"
                strokeDasharray="3 3"
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="unrealized"
                stroke="#9333EA"
                strokeDasharray="3 3"
                dot={false}
                isAnimationActive={false}
              />
            </>
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const renderDailyPnLChart = () => (
    <div className="h-48 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data.dailyData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke={isDark ? '#525252' : '#a3a3a3'}
          />
          <YAxis
            tickFormatter={formatCurrency}
            stroke={isDark ? '#525252' : '#a3a3a3'}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="realized"
            radius={[4, 4, 0, 0]}
          >
            {data.dailyData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.realized >= 0 ? '#10B981' : '#EF4444'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderMetricsGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      <MetricCard
        title="Total P&L"
        value={formatCurrency(data.totalRealized + data.totalUnrealized)}
        icon={DollarSign}
        trend={formatPercent(((data.totalRealized + data.totalUnrealized) / Math.abs(data.totalRealized)) * 100)}
      />
      <MetricCard
        title="Realized"
        value={formatCurrency(data.totalRealized)}
        icon={TrendingUp}
      />
      <MetricCard
        title="Best Day"
        value={formatCurrency(data.bestDay.value)}
        subtitle={formatDate(data.bestDay.date)}
        icon={TrendingUp}
      />
      <MetricCard
        title="Worst Day"
        value={formatCurrency(data.worstDay.value)}
        subtitle={formatDate(data.worstDay.date)}
        icon={TrendingDown}
      />
    </div>
  );

  return (
    <div className={baseClasses}>
      <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex justify-between items-center text-sm">
          <span>Profit & Loss</span>
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
      {renderPnLChart()}
      
      {variant === 'detailed' && (
        <>
          <div className="px-4 pt-4">
            <h3 className="text-sm font-medium">Daily P&L</h3>
          </div>
          {renderDailyPnLChart()}
          
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm">
                <span className="text-neutral-500">Profit Days:</span>{' '}
                <span className="text-emerald-500 font-medium">{data.profitDays}</span>
              </div>
              <div className="text-sm text-right">
                <span className="text-neutral-500">Loss Days:</span>{' '}
                <span className="text-rose-500 font-medium">{data.lossDays}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PnLTracking;

