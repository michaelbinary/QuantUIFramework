// @ts-nocheck

// src/components/tradingsession/TradingSession.tsx

import React, { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  Clock, TrendingUp, Activity, Scale,
  Wallet, BarChart2
} from 'lucide-react';

interface SessionData {
  timestamp: string;
  price: number;
  volume: number;
  vwap: number;
  cumVolume: number;
  trades: number;
  high: number;
  low: number;
}

interface SessionStats {
  sessionVolume: number;
  averagePrice: number;
  priceRange: {
    high: number;
    low: number;
    range: number;
  };
  tradeCount: number;
  volumeProfile: Array<{
    price: number;
    volume: number;
    buyVolume: number;
    sellVolume: number;
  }>;
  vwap: number;
  largeTradesCount: number;
  smallTradesCount: number;
}

interface TradingSessionProps {
  data: SessionData[];
  stats: SessionStats;
  theme?: 'light' | 'dark';
  interval?: '1m' | '5m' | '15m' | '1h';
  height?: number;
  showVolume?: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number, precision: number = 0) => {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: precision
  }).format(value);
};

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const TradingSession: React.FC<TradingSessionProps> = ({
  data,
  stats,
  theme = 'light',
  interval = '5m',
  height = 500,
  showVolume = true
}) => {
  const isDark = theme === 'dark';

  const sessionSummary = useMemo(() => {
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    const priceChange = ((lastPrice - firstPrice) / firstPrice) * 100;

    return {
      priceChange,
      isPositive: priceChange >= 0,
      volumeTotal: stats.sessionVolume,
      tradeCount: stats.tradeCount,
      priceRange: stats.priceRange.range,
      vwap: stats.vwap
    };
  }, [data, stats]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className={`p-3 rounded-lg shadow-lg border ${
        isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'
      }`}>
        <p className="text-sm font-medium mb-2">{formatTime(label)}</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between gap-4">
            <span>Price:</span>
            <span className="font-medium">{formatCurrency(payload[0].value)}</span>
          </div>
          {showVolume && (
            <div className="flex items-center justify-between gap-4">
              <span>Volume:</span>
              <span className="font-medium">{formatNumber(payload[1].value)}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <span>VWAP:</span>
            <span className="font-medium">{formatCurrency(payload[2].value)}</span>
          </div>
        </div>
      </div>
    );
  };

  const MetricCard = ({ title, value, icon: Icon, secondary }) => (
    <div className={`p-4 rounded-lg ${
      isDark ? 'bg-neutral-800' : 'bg-neutral-50'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-blue-500" />}
          <span className="text-sm font-medium text-neutral-500">{title}</span>
        </div>
      </div>
      <div className="mt-2">
        <span className="text-2xl font-medium">{value}</span>
        {secondary && (
          <span className="text-xs text-neutral-500 ml-2">{secondary}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className={`w-full rounded-lg border ${
      isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'
    }`}>
      <div className={`px-4 py-3 border-b ${
        isDark ? 'border-neutral-800' : 'border-neutral-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Session Analysis</span>
          </div>
          <select
            value={interval}
            className={`text-sm border-0 bg-transparent focus:ring-0 ${
              isDark ? 'text-neutral-400' : 'text-neutral-500'
            }`}
          >
            <option value="1m">1 Min</option>
            <option value="5m">5 Min</option>
            <option value="15m">15 Min</option>
            <option value="1h">1 Hour</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <MetricCard
          title="Price Change"
          value={`${sessionSummary.priceChange >= 0 ? '+' : ''}${sessionSummary.priceChange.toFixed(2)}%`}
          icon={TrendingUp}
          secondary={formatCurrency(data[data.length - 1].price)}
        />
        <MetricCard
          title="Volume"
          value={formatNumber(sessionSummary.volumeTotal)}
          icon={BarChart2}
        />
        <MetricCard
          title="VWAP"
          value={formatCurrency(sessionSummary.vwap)}
          icon={Scale}
        />
        <MetricCard
          title="Trades"
          value={formatNumber(sessionSummary.tradeCount)}
          icon={Activity}
          secondary={`Range: ${formatCurrency(sessionSummary.priceRange)}`}
        />
      </div>

      <div className="p-4" style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#404040' : '#e5e5e5'}
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTime}
              stroke={isDark ? '#525252' : '#a3a3a3'}
            />
            <YAxis
              yAxisId="price"
              orientation="right"
              tickFormatter={formatCurrency}
              stroke={isDark ? '#525252' : '#a3a3a3'}
            />
            {showVolume && (
              <YAxis
                yAxisId="volume"
                orientation="left"
                tickFormatter={formatNumber}
                stroke={isDark ? '#525252' : '#a3a3a3'}
              />
            )}
            <Tooltip content={<CustomTooltip />} />

            <Line
              yAxisId="price"
              type="monotone"
              dataKey="price"
              stroke="#3B82F6"
              dot={false}
              strokeWidth={2}
            />
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="vwap"
              stroke="#F59E0B"
              strokeDasharray="3 3"
              dot={false}
            />
            {showVolume && (
              <Bar
                yAxisId="volume"
                dataKey="volume"
                fill="#3B82F6"
                opacity={0.3}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TradingSession;
