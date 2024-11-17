// src/components/tradehistory/TradeHistory.tsx

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Trade {
  id: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
  timestamp: string;
  maker?: boolean;
  taker?: boolean;
  liquidation?: boolean;
}

interface TradeHistoryProps {
  trades: Trade[];
  variant?: 'default' | 'detailed' | 'minimal';
  theme?: 'light' | 'dark';
  maxItems?: number;
  grouping?: boolean;
  showTimestamp?: 'full' | 'time' | 'relative' | 'none';
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatSize = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);
};

const formatTime = (timestamp: string, format: 'full' | 'time' | 'relative' | 'none') => {
  if (format === 'none') return '';
  
  const date = new Date(timestamp);
  
  if (format === 'relative') {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  }
  
  if (format === 'time') {
    return date.toLocaleTimeString();
  }
  
  return date.toLocaleString();
};

export const TradeHistory = ({
  trades,
  variant = 'default',
  theme = 'light',
  maxItems = 50,
  grouping = false,
  showTimestamp = 'relative',
}: TradeHistoryProps) => {
  const isDark = theme === 'dark';
  const [groupedTrades, setGroupedTrades] = useState<Trade[]>([]);
  
  useEffect(() => {
    if (grouping) {
      // Group trades by price and side within a small time window
      const timeWindow = 1000; // 1 second window
      const groups = new Map<string, Trade>();
      
      trades.forEach(trade => {
        const key = `${trade.price}-${trade.side}-${Math.floor(Date.parse(trade.timestamp) / timeWindow)}`;
        if (groups.has(key)) {
          const existing = groups.get(key)!;
          groups.set(key, {
            ...existing,
            size: existing.size + trade.size,
          });
        } else {
          groups.set(key, trade);
        }
      });
      
      setGroupedTrades(Array.from(groups.values()));
    }
  }, [trades, grouping]);

  const displayTrades = grouping ? groupedTrades : trades;
  const baseClasses = `
    w-full overflow-hidden border rounded-lg
    ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}
    ${isDark ? 'text-neutral-100' : 'text-neutral-900'}
  `;

  const renderTrade = (trade: Trade) => {
    if (variant === 'detailed') {
      return (
        <div className="grid grid-cols-5 gap-2 py-1.5 px-3 text-sm font-mono hover:bg-neutral-50 dark:hover:bg-neutral-800">
          <div className={`flex items-center ${trade.side === 'buy' ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trade.side === 'buy' ? 
              <ArrowUpRight className="h-4 w-4 mr-1" /> : 
              <ArrowDownRight className="h-4 w-4 mr-1" />
            }
            {formatPrice(trade.price)}
          </div>
          <div className="text-right">{formatSize(trade.size)}</div>
          <div className="text-neutral-500 text-right">{formatTime(trade.timestamp, showTimestamp)}</div>
          <div className="text-right">{trade.maker ? 'Maker' : 'Taker'}</div>
          <div className="text-right">
            {trade.liquidation && (
              <span className="px-1.5 py-0.5 rounded text-xs bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400">
                Liq
              </span>
            )}
          </div>
        </div>
      );
    }

    if (variant === 'minimal') {
      return (
        <div className="flex items-center justify-between py-1 px-2 text-sm font-mono">
          <span className={trade.side === 'buy' ? 'text-emerald-500' : 'text-rose-500'}>
            {formatPrice(trade.price)}
          </span>
          <span>{formatSize(trade.size)}</span>
        </div>
      );
    }

    // Default variant
    return (
      <div className="grid grid-cols-3 gap-2 py-1.5 px-3 text-sm font-mono hover:bg-neutral-50 dark:hover:bg-neutral-800">
        <div className={`flex items-center ${trade.side === 'buy' ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trade.side === 'buy' ? 
            <ArrowUpRight className="h-4 w-4 mr-1" /> : 
            <ArrowDownRight className="h-4 w-4 mr-1" />
          }
          {formatPrice(trade.price)}
        </div>
        <div className="text-right">{formatSize(trade.size)}</div>
        <div className="text-neutral-500 text-right">{formatTime(trade.timestamp, showTimestamp)}</div>
      </div>
    );
  };

  return (
    <div className={baseClasses}>
      <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex justify-between items-center text-sm">
          <span>Recent Trades</span>
          {grouping && (
            <span className="text-neutral-500 text-xs">Grouped by price</span>
          )}
        </div>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {displayTrades.slice(0, maxItems).map((trade) => (
          <div key={trade.id}>
            {renderTrade(trade)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeHistory;
