import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Copy, Check, Code } from 'lucide-react';
import { PriceTicker } from './PriceTicker';

const SAMPLE_TICKERS = [
  { symbol: 'BTC', price: 64223.89, change: 3.55, volume: '2.1B' },
  { symbol: 'ETH', price: 3193.67, change: -3.96, volume: '1.4B' },
  { symbol: 'SOL', price: 36.82, change: 3.23, volume: '845M' },
  { symbol: 'DOGE', price: 0.1582, change: 1.24, volume: '445M' },
  { symbol: 'XRP', price: 0.5934, change: -2.15, volume: '912M' }
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
          <option value="compact">Compact</option>
          <option value="detailed">Detailed</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showVolume}
            onChange={(e) => onChange({ ...values, showVolume: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Volume</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SAMPLE_TICKERS.map((data) => (
          <PriceTicker
            key={data.symbol}
            {...data}
            {...config}
          />
        ))}
      </div>
    </div>
  );
};

export const TickerShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    showVolume: false
  });

  const generateCode = () => {
    const isDark = config.theme === 'dark';
    
    if (config.variant === 'compact') {
      return `<div className="${isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'}
  p-3 rounded-lg border flex items-center justify-between">
  <span className="font-mono">BTC</span>
  <span className="font-mono">$64,223.89</span>
</div>`;
    }

    if (config.variant === 'detailed') {
      return `<div className="${isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'}
  p-4 rounded-lg border">
  <div className="flex justify-between items-start">
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="font-mono">BTC</span>
        <span className="opacity-60">USD</span>
      </div>
      ${config.showVolume ? `<div className="text-xs opacity-60">
        Vol: 2.1B
      </div>` : ''}
    </div>
    <div className="text-right">
      <div className="font-mono">$64,223.89</div>
      <div className="flex items-center justify-end text-xs mt-1 text-emerald-500">
        <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" 
             stroke="currentColor" strokeWidth="2">
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
        +3.55%
      </div>
    </div>
  </div>
</div>`;
    }

    // Default variant
    return `<div className="${isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'}
  p-4 rounded-lg border flex items-center justify-between">
  <div className="flex flex-col">
    <span className="font-mono">BTC</span>
    <span className="opacity-60">USD</span>
  </div>
  <div className="flex flex-col items-end">
    <span className="font-mono">$64,223.89</span>
    <div className="flex items-center text-xs text-emerald-500">
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" 
           stroke="currentColor" strokeWidth="2">
        <path d="M7 17L17 7M17 7H7M17 7V17" />
      </svg>
      <span>+3.55%</span>
    </div>
  </div>
</div>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        {/* Header */}
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Price Ticker Component
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          {/* Controls */}
          <div className="lg:col-span-1">
            <Controls values={config} onChange={setConfig} />
          </div>

          {/* Preview/Code Area */}
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

export default TickerShowcase;