// src/components/scrollingticker/ScrollingTicker.tsx

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  marketCap?: string;
  volume?: string;
  sentiment?: number; // -1 to 1
}

interface ScrollingTickerProps {
  data: TickerItem[];
  variant?: 'default' | 'detailed' | 'sentiment';
  theme?: 'light' | 'dark';
  speed?: 'slow' | 'normal' | 'fast';
  pauseOnHover?: boolean;
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatChange = (value: number) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

const getSentimentColor = (sentiment: number) => {
  if (sentiment > 0.5) return 'text-emerald-500';
  if (sentiment > 0) return 'text-emerald-400';
  if (sentiment === 0) return 'text-neutral-400';
  if (sentiment > -0.5) return 'text-rose-400';
  return 'text-rose-500';
};

export const ScrollingTicker = ({
  data,
  variant = 'default',
  theme = 'light',
  speed = 'normal',
  pauseOnHover = true,
}: ScrollingTickerProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isDark = theme === 'dark';

  // Animation speed based on the speed prop
  const getAnimationDuration = () => {
    const baseTime = data.length * 5; // 5 seconds per item base time
    switch (speed) {
      case 'slow': return baseTime * 1.5;
      case 'fast': return baseTime * 0.5;
      default: return baseTime;
    }
  };

  useEffect(() => {
    // Clone items for seamless scrolling
    if (scrollerRef.current) {
      const content = scrollerRef.current.querySelector('.scroller-content');
      if (content) {
        content.innerHTML += content.innerHTML;
      }
    }
  }, [data]);

  const baseClasses = `
    w-full overflow-hidden border-y
    ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}
    ${isDark ? 'text-neutral-100' : 'text-neutral-900'}
  `;

  const renderTickerItem = (item: TickerItem) => {
    if (variant === 'detailed') {
      return (
        <div 
          key={item.symbol} 
          className="flex items-center space-x-6 px-6"
        >
          <span className="font-mono whitespace-nowrap">{item.symbol}</span>
          <span className="font-mono whitespace-nowrap">{formatPrice(item.price)}</span>
          <span className={`flex items-center ${item.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {item.change >= 0 ? 
              <ArrowUpRight className="h-4 w-4 mr-1" /> : 
              <ArrowDownRight className="h-4 w-4 mr-1" />
            }
            {formatChange(item.change)}
          </span>
          <span className="text-neutral-500">Vol: {item.volume}</span>
          <span className="text-neutral-500">MCap: {item.marketCap}</span>
        </div>
      );
    }

    if (variant === 'sentiment') {
      return (
        <div 
          key={item.symbol}
          className="flex items-center space-x-6 px-6"
        >
          <span className="font-mono whitespace-nowrap">{item.symbol}</span>
          <span className="font-mono whitespace-nowrap">{formatPrice(item.price)}</span>
          <span className={`flex items-center ${getSentimentColor(item.sentiment || 0)}`}>
            {item.sentiment && item.sentiment > 0 ? 
              <TrendingUp className="h-4 w-4 mr-1" /> : 
              <TrendingDown className="h-4 w-4 mr-1" />
            }
            {item.sentiment ? `${(item.sentiment * 100).toFixed(1)}%` : '0%'}
          </span>
        </div>
      );
    }

    // Default variant
    return (
      <div 
        key={item.symbol}
        className="flex items-center space-x-4 px-4"
      >
        <span className="font-mono whitespace-nowrap">{item.symbol}</span>
        <span className="font-mono whitespace-nowrap">{formatPrice(item.price)}</span>
        <span className={`flex items-center ${item.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {item.change >= 0 ? 
            <ArrowUpRight className="h-4 w-4 mr-1" /> : 
            <ArrowDownRight className="h-4 w-4 mr-1" />
          }
          {formatChange(item.change)}
        </span>
      </div>
    );
  };

  return (
    <div className={baseClasses}>
      <div 
        ref={scrollerRef}
        className="relative h-12"
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      >
        <div 
          className={`scroller-content absolute top-0 flex items-center h-full
            animate-scroll ${isPaused ? 'animation-paused' : ''}`}
          style={{ animationDuration: `${getAnimationDuration()}s` }}
        >
          {data.map(item => renderTickerItem(item))}
        </div>
      </div>
    </div>
  );
};

export default ScrollingTicker;