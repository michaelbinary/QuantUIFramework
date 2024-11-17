// @ts-nocheck

// src/components/orderentry/OrderEntry.tsx

import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle,
  Percent,
  DollarSign,
  Calculator,
  Clock
} from 'lucide-react';

interface MarketData {
  symbol: string;
  lastPrice: number;
  bidPrice: number;
  askPrice: number;
  dailyChange: number;
  volume: number;
}

interface OrderEntryProps {
  marketData: MarketData;
  balance?: number;
  leverage?: number;
  variant?: 'default' | 'advanced' | 'compact';
  theme?: 'light' | 'dark';
  onSubmit?: (order: any) => void;
  showEstimates?: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercent = (value: number) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

export const OrderEntry = ({
  marketData,
  balance = 0,
  leverage = 1,
  variant = 'default',
  theme = 'light',
  onSubmit,
  showEstimates = true,
}: OrderEntryProps) => {
  const isDark = theme === 'dark';
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [stopPrice, setStopPrice] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const baseClasses = `
    w-full overflow-hidden border rounded-lg
    ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}
    ${isDark ? 'text-neutral-100' : 'text-neutral-900'}
  `;

  const buttonClasses = {
    buy: `
      w-full py-2 px-4 rounded-lg font-medium transition-colors
      ${side === 'buy'
        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300'}
    `,
    sell: `
      w-full py-2 px-4 rounded-lg font-medium transition-colors
      ${side === 'sell'
        ? 'bg-rose-500 hover:bg-rose-600 text-white'
        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300'}
    `,
  };

  useEffect(() => {
    if (quantity && (orderType === 'market' || (orderType !== 'market' && price))) {
      const priceToUse = orderType === 'market' 
        ? (side === 'buy' ? marketData.askPrice : marketData.bidPrice)
        : parseFloat(price);
      setTotal(parseFloat(quantity) * priceToUse);
    } else {
      setTotal(0);
    }
  }, [quantity, price, orderType, side, marketData]);

  const validateOrder = () => {
    if (!quantity || parseFloat(quantity) <= 0) {
      setError('Please enter a valid quantity');
      return false;
    }

    if (orderType !== 'market' && (!price || parseFloat(price) <= 0)) {
      setError('Please enter a valid price');
      return false;
    }

    if (orderType === 'stop' && (!stopPrice || parseFloat(stopPrice) <= 0)) {
      setError('Please enter a valid stop price');
      return false;
    }

    if (total > balance * leverage) {
      setError('Insufficient balance');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (!validateOrder()) return;

    const order = {
      side,
      type: orderType,
      quantity: parseFloat(quantity),
      price: orderType === 'market' ? null : parseFloat(price),
      stopPrice: orderType === 'stop' ? parseFloat(stopPrice) : null,
      total,
      symbol: marketData.symbol,
      timestamp: new Date().toISOString(),
    };

    onSubmit?.(order);
  };

  const renderMarketInfo = () => (
    <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{marketData.symbol}</h3>
          <p className={`text-sm ${marketData.dailyChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {formatCurrency(marketData.lastPrice)}{' '}
            <span className="ml-1">
              {formatPercent(marketData.dailyChange)}
            </span>
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="text-neutral-500">
            Bid: <span className="text-rose-500">{formatCurrency(marketData.bidPrice)}</span>
          </p>
          <p className="text-neutral-500">
            Ask: <span className="text-emerald-500">{formatCurrency(marketData.askPrice)}</span>
          </p>
        </div>
      </div>
    </div>
  );

  const renderOrderTypeSelector = () => (
    <div className="grid grid-cols-3 gap-2 p-4">
      {(['market', 'limit', 'stop'] as const).map((type) => (
        <button
          key={type}
          onClick={() => setOrderType(type)}
          className={`
            py-1 px-3 rounded-md text-sm font-medium transition-colors
            ${orderType === type
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'}
          `}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );

  const renderInputField = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    icon: React.ReactNode,
    placeholder: string = ''
  ) => (
    <div className="relative">
      <label className="block text-sm font-medium text-neutral-500 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
          {icon}
        </div>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-4 py-2 rounded-lg
            ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}
            border focus:outline-none focus:ring-2 focus:ring-neutral-500
          `}
        />
      </div>
    </div>
  );

  const renderOrderForm = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button className={buttonClasses.buy} onClick={() => setSide('buy')}>
          <ArrowUpRight className="h-4 w-4 inline-block mr-2" />
          Buy
        </button>
        <button className={buttonClasses.sell} onClick={() => setSide('sell')}>
          <ArrowDownRight className="h-4 w-4 inline-block mr-2" />
          Sell
        </button>
      </div>

      {renderOrderTypeSelector()}

      <div className="space-y-4">
        {renderInputField('Quantity', quantity, setQuantity, <Calculator className="h-4 w-4" />)}
        
        {orderType !== 'market' && (
          renderInputField('Limit Price', price, setPrice, <DollarSign className="h-4 w-4" />)
        )}
        
        {orderType === 'stop' && (
          renderInputField('Stop Price', stopPrice, setStopPrice, <DollarSign className="h-4 w-4" />)
        )}

        {showEstimates && (
          <div className="mt-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Estimated Total:</span>
              <span className="font-medium">{formatCurrency(total)}</span>
            </div>
            {leverage > 1 && (
              <div className="flex justify-between text-sm mt-2">
                <span className="text-neutral-500">Leverage:</span>
                <span className="font-medium">{leverage}x</span>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-rose-500 mt-2">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className={`
            w-full py-3 rounded-lg font-medium
            ${side === 'buy'
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
              : 'bg-rose-500 hover:bg-rose-600 text-white'}
          `}
        >
          {orderType === 'market' ? 'Place Market Order' : `Place ${orderType.charAt(0).toUpperCase() + orderType.slice(1)} Order`}
        </button>
      </div>
    </div>
  );

  return (
    <div className={baseClasses}>
      {renderMarketInfo()}
      {renderOrderForm()}
    </div>
  );
};

export default OrderEntry;

