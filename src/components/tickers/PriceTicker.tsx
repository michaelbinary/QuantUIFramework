import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PriceTickerProps {
  symbol: string;
  price: number;
  change: number;
  variant?: 'default' | 'compact' | 'detailed';
  theme?: 'light' | 'dark';
  showVolume?: boolean;
  volume?: string;
  onClick?: () => void;
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

export const PriceTicker = ({
  symbol,
  price,
  change,
  variant = 'default',
  theme = 'light',
  showVolume = false,
  volume,
  onClick
}: PriceTickerProps) => {
  const [priceClass, setPriceClass] = useState('');
  const prevPrice = useRef(price);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (price !== prevPrice.current) {
      setPriceClass(price > prevPrice.current ? 'price-up' : 'price-down');
      const timer = setTimeout(() => setPriceClass(''), 1000);
      prevPrice.current = price;
      return () => clearTimeout(timer);
    }
  }, [price]);

  const getBaseClasses = () => {
    const themeClass = isDark ? 'ticker-card-dark' : 'ticker-card-light';
    return `ticker-card ${themeClass} rounded-lg border ${onClick ? 'cursor-pointer' : ''}`;
  };

  if (variant === 'compact') {
    return (
      <div 
        className={`${getBaseClasses()} p-3 flex items-center justify-between`}
        onClick={onClick}
      >
        <span className="font-mono">{symbol}</span>
        <span className={`font-mono ${priceClass}`}>
          {formatPrice(price)}
        </span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`${getBaseClasses()} p-4`} onClick={onClick}>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono">{symbol}</span>
              <span className="opacity-60">USD</span>
            </div>
            {showVolume && volume && (
              <div className="text-xs opacity-60">
                Vol: {volume}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className={`font-mono ${priceClass}`}>
              {formatPrice(price)}
            </div>
            <div className={`flex items-center justify-end text-xs mt-1 
              ${change >= 0 ? 'text-up' : 'text-down'}`}>
              {change >= 0 ? 
                <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                <ArrowDownRight className="h-3 w-3 mr-1" />
              }
              {formatChange(change)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${getBaseClasses()} p-4 flex items-center justify-between`}
      onClick={onClick}
    >
      <div className="flex flex-col">
        <span className="font-mono">{symbol}</span>
        <span className="opacity-60">USD</span>
      </div>
      <div className="flex flex-col items-end">
        <span className={`font-mono ${priceClass}`}>
          {formatPrice(price)}
        </span>
        <div className={`flex items-center text-xs 
          ${change >= 0 ? 'text-up' : 'text-down'}`}>
          {change >= 0 ? 
            <ArrowUpRight className="h-3 w-3" /> : 
            <ArrowDownRight className="h-3 w-3" />
          }
          <span>{formatChange(change)}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceTicker;