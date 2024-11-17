// src/components/positioncards/PositionCardsShowcase.tsx

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { PositionCards } from './PositionCards';

// Comprehensive sample data with various position types and states
const SAMPLE_POSITIONS = [
  {
    id: '1',
    symbol: 'BTC-USD',
    side: 'long',
    size: 1.5,
    entryPrice: 63500,
    currentPrice: 64223.89,
    liquidationPrice: 58900,
    margin: 25000,
    leverage: 3,
    pnl: 1085.83,
    pnlPercent: 1.71,
    unrealizedPnl: 985.83,
    realizedPnl: 100,
    fees: 45.50,
    timestamp: new Date().toISOString(),
    fundingRate: 0.0001,
    nextFunding: new Date(Date.now() + 3600000).toISOString(),
    stopLoss: 62500,
    takeProfit: 66000,
    margin24h: 24500,
    volume24h: 125000,
    priceHistory: Array.from({ length: 24 }, (_, i) => ({
      time: new Date(Date.now() - i * 3600000).toISOString(),
      price: 64223.89 + (Math.random() - 0.5) * 1000
    })).reverse()
  },
  {
    id: '2',
    symbol: 'ETH-USD',
    side: 'short',
    size: 10,
    entryPrice: 3300,
    currentPrice: 3193.67,
    liquidationPrice: 3650,
    margin: 15000,
    leverage: 5,
    pnl: 1063.30,
    pnlPercent: 3.22,
    unrealizedPnl: 963.30,
    realizedPnl: 100,
    fees: 35.80,
    timestamp: new Date().toISOString(),
    fundingRate: -0.0002,
    nextFunding: new Date(Date.now() + 3600000).toISOString(),
    stopLoss: 3400,
    takeProfit: 3000,
    margin24h: 14800,
    volume24h: 85000,
    priceHistory: Array.from({ length: 24 }, (_, i) => ({
      time: new Date(Date.now() - i * 3600000).toISOString(),
      price: 3193.67 - (Math.random() - 0.5) * 50
    })).reverse()
  },
  {
    id: '3',
    symbol: 'SOL-USD',
    side: 'long',
    size: 100,
    entryPrice: 110.50,
    currentPrice: 108.75,
    liquidationPrice: 98.20,
    margin: 5000,
    leverage: 2,
    pnl: -175,
    pnlPercent: -1.58,
    unrealizedPnl: -175,
    realizedPnl: 0,
    fees: 12.50,
    timestamp: new Date().toISOString(),
    fundingRate: 0.0003,
    nextFunding: new Date(Date.now() + 3600000).toISOString(),
    stopLoss: 105,
    takeProfit: 120,
    margin24h: 5100,
    volume24h: 25000,
    priceHistory: Array.from({ length: 24 }, (_, i) => ({
      time: new Date(Date.now() - i * 3600000).toISOString(),
      price: 108.75 + (Math.random() - 0.5) * 2
    })).reverse()
  },
  {
    id: '4',
    symbol: 'MATIC-USD',
    side: 'long',
    size: 5000,
    entryPrice: 0.85,
    currentPrice: 0.92,
    liquidationPrice: 0.75,
    margin: 2000,
    leverage: 10,
    pnl: 350,
    pnlPercent: 8.24,
    unrealizedPnl: 350,
    realizedPnl: 0,
    fees: 8.50,
    timestamp: new Date().toISOString(),
    fundingRate: 0.0001,
    nextFunding: new Date(Date.now() + 3600000).toISOString(),
    margin24h: 1950,
    volume24h: 15000,
    priceHistory: Array.from({ length: 24 }, (_, i) => ({
      time: new Date(Date.now() - i * 3600000).toISOString(),
      price: 0.92 + (Math.random() - 0.5) * 0.02
    })).reverse()
  },
  {
    id: '5',
    symbol: 'AVAX-USD',
    side: 'short',
    size: 200,
    entryPrice: 35.50,
    currentPrice: 35.42,
    liquidationPrice: 39.20,
    margin: 3000,
    leverage: 4,
    pnl: 16,
    pnlPercent: 0.23,
    unrealizedPnl: 16,
    realizedPnl: 0,
    fees: 5.80,
    timestamp: new Date().toISOString(),
    fundingRate: -0.0001,
    nextFunding: new Date(Date.now() + 3600000).toISOString(),
    margin24h: 3020,
    volume24h: 18000,
    priceHistory: Array.from({ length: 24 }, (_, i) => ({
      time: new Date(Date.now() - i * 3600000).toISOString(),
      price: 35.42 + (Math.random() - 0.5) * 0.5
    })).reverse()
  }
];

const FrameworkSelector = () => {
  return (
    <div className="relative inline-block text-left mr-4">
      <select 
        className="pl-3 pr-8 py-1 text-sm border border-neutral-200 rounded-md bg-white text-neutral-700 font-medium
                   appearance-none cursor-pointer hover:border-neutral-300 focus:outline-none focus:ring-2 
                   focus:ring-neutral-900 focus:ring-offset-1"
        defaultValue="react"
      >
        <option value="react">React</option>
        <option value="vue" disabled>Vue (Coming Soon)</option>
        <option value="html" disabled>HTML (Coming Soon)</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

const Controls = ({ values, onChange }) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-neutral-200">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Theme
        </label>
        <select
          value={values.theme}
          onChange={(e) => onChange({ ...values, theme: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Variant
        </label>
        <select
          value={values.variant}
          onChange={(e) => onChange({ ...values, variant: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="default">Default</option>
          <option value="detailed">Detailed</option>
          <option value="compact">Compact</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showChart}
            onChange={(e) => onChange({ ...values, showChart: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Charts</span>
        </label>
      </div>
    </div>
  );
};

const CodeBlock = ({ code, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 
                 text-neutral-400 hover:text-neutral-200 transition-colors"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
};

const LivePreview = ({ config }) => {
  const bgColor = config.theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-50';
  
  return (
    <div className={`p-6 rounded-lg ${bgColor}`}>
      <PositionCards
        positions={SAMPLE_POSITIONS}
        {...config}
        onPositionClose={(id) => console.log('Close position:', id)}
      />
    </div>
  );
};

export const PositionCardsShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    showChart: true
  });

  const generateCode = () => {
    const props = [];
    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (!config.showChart) props.push('showChart={false}');

    return `<PositionCards
  positions={[
    {
      id: '1',
      symbol: 'BTC-USD',
      side: 'long',
      size: 1.5,
      entryPrice: 63500,
      currentPrice: 64223.89,
      liquidationPrice: 58900,
      margin: 25000,
      leverage: 3,
      pnl: 1085.83,
      pnlPercent: 1.71,
      // ... more position data
    },
    // ... more positions
  ]}
  onPositionClose={(id) => console.log('Close position:', id)}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Position Cards Component
            </h2>
            <div className="flex items-center">
              <FrameworkSelector />
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
                    ${activeTab === 'preview' 
                      ? 'bg-neutral-900 text-white' 
                      : 'text-neutral-600 hover:text-neutral-900'}`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
                    ${activeTab === 'code' 
                      ? 'bg-neutral-900 text-white' 
                      : 'text-neutral-600 hover:text-neutral-900'}`}
                >
                  Code
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          <div className="lg:col-span-1">
            <Controls values={config} onChange={setConfig} />
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'preview' ? (
              <LivePreview config={config} />
            ) : (
              <CodeBlock 
                code={generateCode()}
                onCopy={() => navigator.clipboard.writeText(generateCode())}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionCardsShowcase;

