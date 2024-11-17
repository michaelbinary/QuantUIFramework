// src/components/portfoliostats/PortfolioStatsShowcase.tsx

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { PortfolioStats } from './PortfolioStats';

const SAMPLE_STATS = {
  totalValue: 1250000,
  totalCost: 1000000,
  totalPnl: 250000,
  returns: {
    daily: 1.25,
    weekly: 3.75,
    monthly: 8.50,
    yearly: 25.00
  },
  allocations: {
    sectors: [
      { name: 'Technology', value: 35 },
      { name: 'Financials', value: 25 },
      { name: 'Healthcare', value: 20 },
      { name: 'Consumer', value: 15 },
      { name: 'Energy', value: 5 }
    ],
    assetTypes: [
      { name: 'Stocks', value: 60 },
      { name: 'ETFs', value: 20 },
      { name: 'Options', value: 10 },
      { name: 'Crypto', value: 7 },
      { name: 'Cash', value: 3 }
    ]
  },
  positions: [
    {
      symbol: 'AAPL',
      quantity: 500,
      value: 95000,
      cost: 75000,
      pnl: 20000,
      weight: 7.6,
      sector: 'Technology',
      type: 'Stock'
    },
    {
      symbol: 'MSFT',
      quantity: 300,
      value: 85000,
      cost: 65000,
      pnl: 20000,
      weight: 6.8,
      sector: 'Technology',
      type: 'Stock'
    },
    {
      symbol: 'SPY',
      quantity: 1000,
      value: 450000,
      cost: 400000,
      pnl: 50000,
      weight: 36,
      sector: 'ETF',
      type: 'ETF'
    },
    {
      symbol: 'BTC',
      quantity: 5,
      value: 175000,
      cost: 150000,
      pnl: 25000,
      weight: 14,
      sector: 'Crypto',
      type: 'Crypto'
    },
    {
      symbol: 'JPM',
      quantity: 750,
      value: 95000,
      cost: 85000,
      pnl: 10000,
      weight: 7.6,
      sector: 'Financials',
      type: 'Stock'
    }
  ]
};

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
            checked={values.showCharts}
            onChange={(e) => onChange({ ...values, showCharts: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Charts</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showPositions}
            onChange={(e) => onChange({ ...values, showPositions: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Positions</span>
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
      <PortfolioStats
        stats={SAMPLE_STATS}
        {...config}
      />
    </div>
  );
};

export const PortfolioStatsShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    showCharts: true,
    showPositions: true
  });

  const generateCode = () => {
    const props = [];
    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (!config.showCharts) props.push('showCharts={false}');
    if (!config.showPositions) props.push('showPositions={false}');

    return `<PortfolioStats
  stats={{
    totalValue: 1250000,
    totalCost: 1000000,
    totalPnl: 250000,
    returns: {
      daily: 1.25,
      weekly: 3.75,
      monthly: 8.50,
      yearly: 25.00
    },
    allocations: {
      sectors: [
        { name: 'Technology', value: 35 },
        // ... more sectors
      ],
      assetTypes: [
        { name: 'Stocks', value: 60 },
        // ... more asset types
      ]
    },
    positions: [
      {
        symbol: 'AAPL',
        quantity: 500,
        value: 95000,
        cost: 75000,
        pnl: 20000,
        weight: 7.6
      },
      // ... more positions
    ]
  }}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Portfolio Stats Component
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

export default PortfolioStatsShowcase;
