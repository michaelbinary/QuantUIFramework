// @ts-nocheck

// src/components/portfoliostats/PortfolioStats.tsx

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Briefcase, TrendingUp, BarChart2, Percent, DollarSign } from 'lucide-react';

interface Position {
  symbol: string;
  quantity: number;
  value: number;
  cost: number;
  pnl: number;
  weight: number;
  sector?: string;
  type?: string;
}

interface PortfolioStats {
  totalValue: number;
  totalCost: number;
  totalPnl: number;
  returns: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  allocations: {
    sectors: { name: string; value: number; }[];
    assetTypes: { name: string; value: number; }[];
  };
  positions: Position[];
}

interface PortfolioStatsProps {
  stats: PortfolioStats;
  variant?: 'default' | 'detailed' | 'compact';
  theme?: 'light' | 'dark';
  showCharts?: boolean;
  showPositions?: boolean;
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

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const PortfolioStats = ({
  stats,
  variant = 'default',
  theme = 'light',
  showCharts = true,
  showPositions = true,
}: PortfolioStatsProps) => {
  const isDark = theme === 'dark';

  const baseClasses = `
    w-full overflow-hidden border rounded-lg
    ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}
    ${isDark ? 'text-neutral-100' : 'text-neutral-900'}
  `;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className={`
        p-2 rounded-lg shadow-lg border
        ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}
      `}>
        <p className="text-sm font-medium mb-1">{payload[0].name}</p>
        <p className="text-xs">
          {formatPercent(payload[0].value)}
        </p>
      </div>
    );
  };

  const MetricCard = ({ title, value, icon: Icon, change }) => (
    <div className={`p-4 rounded-lg ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-neutral-500" />}
          <span className="text-sm font-medium text-neutral-500">{title}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-mono">{value}</span>
        {change && (
          <span className={`text-xs ${change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {formatPercent(change)}
          </span>
        )}
      </div>
    </div>
  );

  const renderMetricsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <MetricCard
        title="Total Value"
        value={formatCurrency(stats.totalValue)}
        icon={Briefcase}
        change={stats.returns.daily}
      />
      <MetricCard
        title="Total P&L"
        value={formatCurrency(stats.totalPnl)}
        icon={TrendingUp}
        change={(stats.totalPnl / stats.totalCost) * 100}
      />
      <MetricCard
        title="Monthly Return"
        value={formatPercent(stats.returns.monthly)}
        icon={BarChart2}
      />
      <MetricCard
        title="YTD Return"
        value={formatPercent(stats.returns.yearly)}
        icon={Percent}
      />
    </div>
  );

  const renderAllocationCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      {/* Sector Allocation */}
      <div>
        <h3 className="text-sm font-medium mb-4">Sector Allocation</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.allocations.sectors}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name} (${formatPercent(value)})`}
              >
                {stats.allocations.sectors.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`hsl(${index * (360 / stats.allocations.sectors.length)}, 70%, ${isDark ? '45%' : '55%'})`} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Type Allocation */}
      <div>
        <h3 className="text-sm font-medium mb-4">Asset Type Allocation</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.allocations.assetTypes}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
            >
              <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <YAxis type="category" dataKey="name" />
              <Tooltip
                formatter={(value) => `${value}%`}
                labelFormatter={(label) => `Asset Type: ${label}`}
              />
              <Bar
                dataKey="value"
                fill="#10B981"
                radius={[0, 4, 4, 0]}
                label={{ 
                  position: 'right',
                  formatter: (value) => `${value}%`,
                  fill: isDark ? '#fff' : '#000'
                }}
              >
                {stats.allocations.assetTypes.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(${index * (360 / stats.allocations.assetTypes.length)}, 70%, ${isDark ? '45%' : '55%'})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderPositionsTable = () => (
    <div className="p-4">
      <h3 className="text-sm font-medium mb-4">Positions</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                P&L
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Weight
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {stats.positions.map((position) => (
              <tr key={position.symbol}>
                <td className="px-3 py-2 text-sm whitespace-nowrap">
                  {position.symbol}
                </td>
                <td className="px-3 py-2 text-sm text-right whitespace-nowrap">
                  {formatNumber(position.quantity)}
                </td>
                <td className="px-3 py-2 text-sm text-right whitespace-nowrap">
                  {formatCurrency(position.value)}
                </td>
                <td className={`px-3 py-2 text-sm text-right whitespace-nowrap
                  ${position.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {formatCurrency(position.pnl)}
                </td>
                <td className="px-3 py-2 text-sm text-right whitespace-nowrap">
                  {formatPercent(position.weight)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={baseClasses}>
      <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex justify-between items-center text-sm">
          <span>Portfolio Statistics</span>
          <span className={`text-xs ${stats.totalPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {formatPercent((stats.totalPnl / stats.totalCost) * 100)} All Time
          </span>
        </div>
      </div>

      {renderMetricsGrid()}

      {variant === 'detailed' && (
        <>
          {showCharts && renderAllocationCharts()}
          {showPositions && renderPositionsTable()}
        </>
      )}
    </div>
  );
};

export default PortfolioStats;
