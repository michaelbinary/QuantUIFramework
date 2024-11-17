// src/components/positioncards/PositionCards.tsx

import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Clock, Percent, DollarSign, XCircle, AlertOctagon } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Position {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  currentPrice: number;
  liquidationPrice?: number;
  margin: number;
  leverage: number;
  pnl: number;
  pnlPercent: number;
  unrealizedPnl: number;
  realizedPnl: number;
  fees: number;
  timestamp: string;
  priceHistory: { time: string; price: number; }[];
  markPrice?: number;
  fundingRate?: number;
  nextFunding?: string;
  stopLoss?: number;
  takeProfit?: number;
  margin24h?: number;
  volume24h?: number;
}

interface PositionCardsProps {
  positions: Position[];
  variant?: 'default' | 'compact' | 'detailed';
  theme?: 'light' | 'dark';
  showChart?: boolean;
  onPositionClose?: (positionId: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatNumber = (value: number, decimals: number = 2) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

const formatPercent = (value: number) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export const PositionCards = ({
  positions,
  variant = 'default',
  theme = 'light',
  showChart = true,
  onPositionClose,
}: PositionCardsProps) => {
  const isDark = theme === 'dark';

  const baseClasses = `
    grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4
  `;

  const cardClasses = `
    relative overflow-hidden border rounded-lg
    ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}
    ${isDark ? 'text-neutral-100' : 'text-neutral-900'}
  `;

  const PositionChart = ({ data, isProfit }: { data: any[], isProfit: boolean }) => (
    <div className="h-16">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="price"
            stroke={isProfit ? '#10B981' : '#EF4444'}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderPositionCard = (position: Position) => {
    const isProfit = position.pnl >= 0;
    const riskLevel = position.liquidationPrice
      ? (Math.abs(position.currentPrice - position.liquidationPrice) / position.currentPrice) * 100
      : 100;

    return (
      <div key={position.id} className={cardClasses}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {position.symbol}
                <span className={`text-sm px-2 py-0.5 rounded-full 
                  ${position.side === 'long' 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300'}`}
                >
                  {position.side.toUpperCase()}
                </span>
              </h3>
              <p className="text-sm text-neutral-500">
                {formatNumber(position.size)} @ {formatCurrency(position.entryPrice)}
              </p>
            </div>
            {onPositionClose && (
              <button
                onClick={() => onPositionClose(position.id)}
                className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <XCircle className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
              </button>
            )}
          </div>
        </div>

        {/* Chart */}
        {showChart && (
          <div className="px-4 py-2">
            <PositionChart
              data={position.priceHistory}
              isProfit={isProfit}
            />
          </div>
        )}

        {/* Main Stats */}
        <div className="px-4 py-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-500">Current Price</p>
            <p className="font-mono">
              {formatCurrency(position.currentPrice)}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">PnL</p>
            <p className={`font-mono ${isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>
              {formatCurrency(position.pnl)}
              <span className="text-sm ml-1">
                ({formatPercent(position.pnlPercent)})
              </span>
            </p>
          </div>
        </div>

        {/* Additional Details */}
        {variant === 'detailed' && (
          <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-500">Leverage</p>
                <p className="font-mono">{position.leverage}x</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Margin</p>
                <p className="font-mono">{formatCurrency(position.margin)}</p>
              </div>
              {position.liquidationPrice && (
                <div className="col-span-2">
                  <p className="text-sm text-neutral-500 flex items-center gap-1">
                    <AlertOctagon className="h-4 w-4" />
                    Liquidation Price
                  </p>
                  <p className={`font-mono ${riskLevel < 10 ? 'text-rose-500' : ''}`}>
                    {formatCurrency(position.liquidationPrice)}
                  </p>
                </div>
              )}
              {position.fundingRate && (
                <div className="col-span-2">
                  <p className="text-sm text-neutral-500">Funding</p>
                  <p className="font-mono">
                    {formatPercent(position.fundingRate * 100)} 
                    {position.nextFunding && (
                      <span className="text-sm text-neutral-500 ml-2">
                        (Next: {new Date(position.nextFunding).toLocaleTimeString()})
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Risk Indicator */}
        {position.liquidationPrice && (
          <div 
            className={`h-1 bg-neutral-100 dark:bg-neutral-800 w-full`}
          >
            <div
              className={`h-full transition-all ${
                riskLevel < 10 
                  ? 'bg-rose-500' 
                  : riskLevel < 25 
                    ? 'bg-orange-500' 
                    : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (100 - riskLevel))}%` }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={baseClasses}>
      {positions.map(renderPositionCard)}
    </div>
  );
};

export default PositionCards;

