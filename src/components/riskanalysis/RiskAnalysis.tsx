// @ts-nocheck

// src/components/riskanalysis/RiskAnalysis.tsx

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingDown, Percent, DollarSign, Scale } from 'lucide-react';

interface RiskMetrics {
  valueAtRisk: number;  // 95% VaR
  expectedShortfall: number;  // CVaR/Expected Shortfall
  betaToMarket: number;
  correlations: {
    name: string;
    value: number;
  }[];
  exposures: {
    name: string;
    value: number;
    risk: number;
  }[];
  concentrationRisk: {
    name: string;
    allocation: number;
  }[];
}

interface RiskAnalysisProps {
  metrics: RiskMetrics;
  variant?: 'default' | 'detailed' | 'compact';
  theme?: 'light' | 'dark';
  showCharts?: boolean;
}

const formatPercent = (value: number) => {
  return `${value.toFixed(2)}%`;
};

const formatNumber = (value: number, decimals: number = 2) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const RiskAnalysis = ({
  metrics,
  variant = 'default',
  theme = 'light',
  showCharts = true
}: RiskAnalysisProps) => {
  const isDark = theme === 'dark';

  const baseClasses = `
    w-full overflow-hidden border rounded-lg
    ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}
    ${isDark ? 'text-neutral-100' : 'text-neutral-900'}
  `;

  const getRiskLevelClass = (value: number) => {
    if (value < 0.25) return 'text-emerald-500';
    if (value < 0.5) return 'text-yellow-500';
    if (value < 0.75) return 'text-orange-500';
    return 'text-rose-500';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className={`
        p-2 rounded-lg shadow-lg border
        ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}
      `}>
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-xs" style={{ color: item.color }}>
            {item.name}: {item.value.toFixed(2)}%
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
          <span className={`text-xs ${getRiskLevelClass(trend)}`}>
            {trend > 0 ? '+' : ''}{formatPercent(trend)}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
      )}
    </div>
  );

  const renderCorrelationChart = () => (
    <div className="p-4">
      <h3 className="text-sm font-medium mb-4">Correlations</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={metrics.correlations}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[-1, 1]}
              tickFormatter={(value) => formatNumber(value, 2)}
              stroke={isDark ? '#525252' : '#a3a3a3'}
            />
            <YAxis
              dataKey="name"
              type="category"
              stroke={isDark ? '#525252' : '#a3a3a3'}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderConcentrationChart = () => (
    <div className="p-4">
      <h3 className="text-sm font-medium mb-4">Concentration Risk</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={metrics.concentrationRisk}
              dataKey="allocation"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, value }) => `${name} (${formatPercent(value)})`}
            >
              {metrics.concentrationRisk.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`hsl(${index * (360 / metrics.concentrationRisk.length)}, 70%, ${isDark ? '45%' : '55%'})`} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderDetailedMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <MetricCard
        title="Value at Risk (95%)"
        value={formatCurrency(metrics.valueAtRisk)}
        icon={AlertTriangle}
        subtitle="Potential loss within 24h"
      />
      <MetricCard
        title="Expected Shortfall"
        value={formatCurrency(metrics.expectedShortfall)}
        icon={TrendingDown}
        subtitle="Average loss beyond VaR"
      />
      <MetricCard
        title="Beta to Market"
        value={formatNumber(metrics.betaToMarket)}
        icon={Scale}
        subtitle="Market sensitivity"
        trend={metrics.betaToMarket - 1}
      />
    </div>
  );

  const renderExposureTable = () => (
    <div className="p-4">
      <h3 className="text-sm font-medium mb-4">Risk Exposures</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Exposure
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Risk Level
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {metrics.exposures.map((exposure, idx) => (
              <tr key={exposure.name}>
                <td className="px-3 py-2 text-sm whitespace-nowrap">
                  {exposure.name}
                </td>
                <td className="px-3 py-2 text-sm text-right whitespace-nowrap">
                  {formatPercent(exposure.value)}
                </td>
                <td className="px-3 py-2 text-sm text-right whitespace-nowrap">
                  <span className={`${getRiskLevelClass(exposure.risk)}`}>
                    {formatNumber(exposure.risk * 100)}%
                  </span>
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
          <span>Risk Analysis</span>
          <span className={`px-2 py-1 rounded text-xs ${getRiskLevelClass(0.35)}`}>
            Moderate Risk
          </span>
        </div>
      </div>

      {renderDetailedMetrics()}

      {variant === 'detailed' && showCharts && (
        <>
          {renderExposureTable()}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {renderCorrelationChart()}
            {renderConcentrationChart()}
          </div>
        </>
      )}
    </div>
  );
};

export default RiskAnalysis;

