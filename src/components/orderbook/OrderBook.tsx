// @ts-nocheck

// src/components/orderbook/OrderBook.tsx

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
  percentageOfTotal?: number;
}

interface OrderBookProps {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  variant?: 'default' | 'depth' | 'compact';
  theme?: 'light' | 'dark';
  precision?: number;
  grouping?: number;
}

const formatPrice = (value: number, precision: number = 2) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
};

const formatNumber = (value: number, precision: number = 2) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
};

export const OrderBook = ({
  bids,
  asks,
  variant = 'default',
  theme = 'light',
  precision = 2,
  grouping = 0.01,
}: OrderBookProps) => {
  const isDark = theme === 'dark';
  const [spreadValue, setSpreadValue] = useState(0);
  const [spreadPercentage, setSpreadPercentage] = useState(0);

  useEffect(() => {
    if (asks.length && bids.length) {
      const spread = asks[0].price - bids[0].price;
      const percentage = (spread / asks[0].price) * 100;
      setSpreadValue(spread);
      setSpreadPercentage(percentage);
    }
  }, [asks, bids]);

  const baseClasses = `
    w-full overflow-hidden border rounded-lg
    ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}
    ${isDark ? 'text-neutral-100' : 'text-neutral-900'}
  `;

  const renderOrderBookEntry = (entry: OrderBookEntry, side: 'ask' | 'bid') => {
    const colorClass = side === 'ask' ? 'text-rose-500' : 'text-emerald-500';
    
    if (variant === 'depth') {
      return (
        <div className="relative grid grid-cols-4 gap-2 py-1 px-2 text-sm font-mono">
          <div className={`text-right ${colorClass}`}>
            {formatPrice(entry.price, precision)}
          </div>
          <div className="text-right">{formatNumber(entry.size)}</div>
          <div className="text-right">{formatNumber(entry.total)}</div>
          <div className="text-right">{entry.percentageOfTotal?.toFixed(1)}%</div>
          <div 
            className={`absolute left-0 top-0 bottom-0 opacity-10
              ${side === 'ask' ? 'bg-rose-500' : 'bg-emerald-500'}`}
            style={{ width: `${entry.percentageOfTotal}%` }}
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-2 py-1 px-2 text-sm font-mono">
        <div className={`text-right ${colorClass}`}>
          {formatPrice(entry.price, precision)}
        </div>
        <div className="text-right">{formatNumber(entry.size)}</div>
        <div className="text-right">{formatNumber(entry.total)}</div>
      </div>
    );
  };

  return (
    <div className={baseClasses}>
      <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex justify-between items-center text-sm">
          <span>Order Book</span>
          <span className="text-neutral-500">
            Spread: {formatPrice(spreadValue)} ({spreadPercentage.toFixed(2)}%)
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 divide-y divide-neutral-200 dark:divide-neutral-800">
        <div className="max-h-[300px] overflow-y-auto">
          {asks.slice().reverse().map((ask, idx) => (
            <div key={`ask-${idx}`}>
              {renderOrderBookEntry(ask, 'ask')}
            </div>
          ))}
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {bids.map((bid, idx) => (
            <div key={`bid-${idx}`}>
              {renderOrderBookEntry(bid, 'bid')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;