

// src/components/marketdepth/MarketDepthShowcase.tsx

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { MarketDepth } from './MarketDepth';

const SAMPLE_DATA = {
  bids: [
    { price: 64200, size: 1.5, total: 1.5, side: 'bid' },
    { price: 64150, size: 2.2, total: 3.7, side: 'bid' },
    { price: 64100, size: 3.1, total: 6.8, side: 'bid' },
    { price: 64050, size: 2.8, total: 9.6, side: 'bid' },
    { price: 64000, size: 4.2, total: 13.8, side: 'bid' },
    { price: 63950, size: 3.7, total: 17.5, side: 'bid' },
    { price: 63900, size: 5.1, total: 22.6, side: 'bid' },
  ],
  asks: [
    { price: 64250, size: 1.8, total: 1.8, side: 'ask' },
    { price: 64300, size: 2.5, total: 4.3, side: 'ask' },
    { price: 64350, size: 3.3, total: 7.6, side: 'ask' },
    { price: 64400, size: 2.9, total: 10.5, side: 'ask' },
    { price: 64450, size: 3.8, total: 14.3, side: 'ask' },
    { price: 64500, size: 4.1, total: 18.4, side: 'ask' },
    { price: 64550, size: 4.8, total: 23.2, side: 'ask' },
  ],
  midPrice: 64225
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
          <option value="gradient">Gradient</option>
          <option value="compact">Compact</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Height
        </label>
        <select
          value={values.height}
          onChange={(e) => onChange({ ...values, height: Number(e.target.value) })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="300">Small (300px)</option>
          <option value="400">Medium (400px)</option>
          <option value="500">Large (500px)</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showMidPrice}
            onChange={(e) => onChange({ ...values, showMidPrice: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Mid Price</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showTooltip}
            onChange={(e) => onChange({ ...values, showTooltip: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Tooltip</span>
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
      <MarketDepth
        {...SAMPLE_DATA}
        {...config}
      />
    </div>
  );
};

export const MarketDepthShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    height: 400,
    showMidPrice: true,
    showTooltip: true
  });

  const generateCode = () => {
    const props = [];
    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (config.height !== 400) props.push(`height={${config.height}}`);
    if (!config.showMidPrice) props.push('showMidPrice={false}');
    if (!config.showTooltip) props.push('showTooltip={false}');

    return `<MarketDepth
    bids={[
      { price: 64200, size: 1.5, total: 1.5, side: 'bid' },
      { price: 64150, size: 2.2, total: 3.7, side: 'bid' },
      // ... more bids
    ]}
    asks={[
      { price: 64250, size: 1.8, total: 1.8, side: 'ask' },
      { price: 64300, size: 2.5, total: 4.3, side: 'ask' },
      // ... more asks
    ]}
    midPrice={64225}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
  />`;
    };
  
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="border-b border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">
                Market Depth Component
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
  
  export default MarketDepthShowcase;
  
