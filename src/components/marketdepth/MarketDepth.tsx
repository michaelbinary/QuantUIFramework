// @ts-nocheck

// src/components/marketdepth/MarketDepth.tsx

import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface PriceLevel {
  price: number;
  size: number;
  total: number;
  side: 'bid' | 'ask';
}

interface MarketDepthProps {
  bids: PriceLevel[];
  asks: PriceLevel[];
  midPrice?: number;
  theme?: 'light' | 'dark';
  variant?: 'default' | 'gradient' | 'compact';
  height?: number;
  showMidPrice?: boolean;
  showTooltip?: boolean;
  precision?: number;
}

const formatPrice = (value: number, precision: number = 2) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
};

const formatSize = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
  return value.toFixed(2);
};

export const MarketDepth = ({
  bids,
  asks,
  midPrice,
  theme = 'light',
  variant = 'default',
  height = 400,
  showMidPrice = true,
  showTooltip = true,
  precision = 2,
}: MarketDepthProps) => {
  const isDark = theme === 'dark';

  // Process and combine data for the chart
  const chartData = useMemo(() => {
    const processedBids = bids
      .sort((a, b) => b.price - a.price)
      .map(bid => ({
        price: bid.price,
        bidTotal: bid.total,
        askTotal: 0
      }));

    const processedAsks = asks
      .sort((a, b) => a.price - b.price)
      .map(ask => ({
        price: ask.price,
        bidTotal: 0,
        askTotal: ask.total
      }));

    return [...processedBids, ...processedAsks];
  }, [bids, asks]);

  const baseClasses = `
    w-full overflow-hidden border rounded-lg
    ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}
    ${isDark ? 'text-neutral-100' : 'text-neutral-900'}
  `;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const bidTotal = data.bidTotal || 0;
    const askTotal = data.askTotal || 0;

    return (
      <div className={`
        p-2 rounded-lg shadow-lg border
        ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}
      `}>
        <p className="text-sm font-mono mb-1">
          {formatPrice(data.price, precision)}
        </p>
        {bidTotal > 0 && (
          <p className="text-xs text-emerald-500">
            Bid Total: {formatSize(bidTotal)}
          </p>
        )}
        {askTotal > 0 && (
          <p className="text-xs text-rose-500">
            Ask Total: {formatSize(askTotal)}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={baseClasses}>
      <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex justify-between items-center text-sm">
          <span>Market Depth</span>
          {midPrice && showMidPrice && (
            <span className="text-neutral-500">
              Mid: {formatPrice(midPrice, precision)}
            </span>
          )}
        </div>
      </div>

      <div style={{ height: `${height}px` }} className="p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <XAxis
              dataKey="price"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => formatPrice(value, 0)}
              stroke={isDark ? '#525252' : '#a3a3a3'}
            />
            <YAxis
              tickFormatter={formatSize}
              stroke={isDark ? '#525252' : '#a3a3a3'}
            />
            {showTooltip && (
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: isDark ? '#525252' : '#a3a3a3' }}
              />
            )}
            
            {variant === 'gradient' ? (
              <>
                <defs>
                  <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="askGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area
                  type="stepAfter"
                  dataKey="bidTotal"
                  stroke="#10B981"
                  fill="url(#bidGradient)"
                  isAnimationActive={false}
                />
                <Area
                  type="stepAfter"
                  dataKey="askTotal"
                  stroke="#EF4444"
                  fill="url(#askGradient)"
                  isAnimationActive={false}
                />
              </>
            ) : (
              <>
                <Area
                  type="stepAfter"
                  dataKey="bidTotal"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.1}
                  isAnimationActive={false}
                />
                <Area
                  type="stepAfter"
                  dataKey="askTotal"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.1}
                  isAnimationActive={false}
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketDepth;

