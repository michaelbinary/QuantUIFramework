// src/components/scrollingticker/ScrollingTickerShowcase.tsx

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { ScrollingTicker } from './ScrollingTicker';

const SAMPLE_DATA = [
  { symbol: 'BTC', price: 64223.89, change: 3.55, volume: '2.1B', marketCap: '1.2T', sentiment: 0.75 },
  { symbol: 'ETH', price: 3193.67, change: -3.96, volume: '1.4B', marketCap: '385B', sentiment: -0.2 },
  { symbol: 'SOL', price: 36.82, change: 3.23, volume: '845M', marketCap: '15.7B', sentiment: 0.45 },
  { symbol: 'DOGE', price: 0.1582, change: 1.24, volume: '445M', marketCap: '21.2B', sentiment: 0.1 },
  { symbol: 'XRP', price: 0.5934, change: -2.15, volume: '912M', marketCap: '32.1B', sentiment: -0.5 },
  { symbol: 'ADA', price: 0.7821, change: 0.95, volume: '523M', marketCap: '27.5B', sentiment: 0.3 },
  { symbol: 'AVAX', price: 35.42, change: 5.67, volume: '378M', marketCap: '12.8B', sentiment: 0.8 },
  { symbol: 'MATIC', price: 0.9234, change: -1.23, volume: '289M', marketCap: '9.1B', sentiment: -0.1 }
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
          <option value="sentiment">Sentiment</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Speed
        </label>
        <select
          value={values.speed}
          onChange={(e) => onChange({ ...values, speed: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="slow">Slow</option>
          <option value="normal">Normal</option>
          <option value="fast">Fast</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.pauseOnHover}
            onChange={(e) => onChange({ ...values, pauseOnHover: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Pause on Hover</span>
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
      <ScrollingTicker
        data={SAMPLE_DATA}
        {...config}
      />
    </div>
  );
};

export const ScrollingTickerShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    speed: 'normal',
    pauseOnHover: true
  });

  const generateCode = () => {
    const isDark = config.theme === 'dark';
    const props = [];

    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (config.speed !== 'normal') props.push(`speed="${config.speed}"`);
    if (!config.pauseOnHover) props.push('pauseOnHover={false}');

    return `<ScrollingTicker
  data={[
    { symbol: 'BTC', price: 64223.89, change: 3.55${config.variant === 'detailed' ? ', volume: "2.1B", marketCap: "1.2T"' : ''}${config.variant === 'sentiment' ? ', sentiment: 0.75' : ''} },
    { symbol: 'ETH', price: 3193.67, change: -3.96${config.variant === 'detailed' ? ', volume: "1.4B", marketCap: "385B"' : ''}${config.variant === 'sentiment' ? ', sentiment: -0.2' : ''} },
    // ... more data
  ]}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Scrolling Ticker Component
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

export default ScrollingTickerShowcase;