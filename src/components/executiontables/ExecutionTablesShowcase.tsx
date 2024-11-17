// src/components/executiontables/ExecutionTablesShowcase.tsx

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { ExecutionTables } from './ExecutionTables';

// Comprehensive sample data with various execution types and states
const SAMPLE_EXECUTIONS = [
  {
    id: '1',
    symbol: 'BTC-USD',
    side: 'buy',
    type: 'market',
    status: 'filled',
    price: 64223.89,
    size: 1.5,
    value: 96335.84,
    filled: 1.5,
    remaining: 0,
    fee: 48.17,
    timestamp: new Date().toISOString(),
    averagePrice: 64223.89
  },
  {
    id: '2',
    symbol: 'ETH-USD',
    side: 'sell',
    type: 'limit',
    status: 'partial',
    price: 3193.67,
    size: 10,
    value: 31936.70,
    filled: 7.5,
    remaining: 2.5,
    fee: 15.97,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    averagePrice: 3193.67
  },
  {
    id: '3',
    symbol: 'SOL-USD',
    side: 'buy',
    type: 'stop',
    status: 'filled',
    price: 108.75,
    size: 100,
    value: 10875.00,
    filled: 100,
    remaining: 0,
    fee: 5.44,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    averagePrice: 108.75,
    trigger: 'stop_loss'
  },
  {
    id: '4',
    symbol: 'BTC-USD',
    side: 'sell',
    type: 'limit',
    status: 'canceled',
    price: 65000.00,
    size: 0.5,
    value: 32500.00,
    filled: 0,
    remaining: 0.5,
    fee: 0,
    timestamp: new Date(Date.now() - 10800000).toISOString()
  },
  {
    id: '5',
    symbol: 'AVAX-USD',
    side: 'buy',
    type: 'market',
    status: 'filled',
    price: 35.42,
    size: 200,
    value: 7084.00,
    filled: 200,
    remaining: 0,
    fee: 3.54,
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    averagePrice: 35.42
  },
  {
    id: '6',
    symbol: 'MATIC-USD',
    side: 'sell',
    type: 'stop',
    status: 'filled',
    price: 0.92,
    size: 5000,
    value: 4600.00,
    filled: 5000,
    remaining: 0,
    fee: 2.30,
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    averagePrice: 0.92,
    trigger: 'take_profit'
  },
  {
    id: '7',
    symbol: 'ETH-USD',
    side: 'sell',
    type: 'market',
    status: 'rejected',
    price: 3195.00,
    size: 15,
    value: 47925.00,
    filled: 0,
    remaining: 15,
    fee: 0,
    timestamp: new Date(Date.now() - 21600000).toISOString()
  },
  {
    id: '8',
    symbol: 'BTC-USD',
    side: 'sell',
    type: 'market',
    status: 'filled',
    price: 64150.00,
    size: 2.5,
    value: 160375.00,
    filled: 2.5,
    remaining: 0,
    fee: 80.19,
    timestamp: new Date(Date.now() - 25200000).toISOString(),
    averagePrice: 64150.00,
    trigger: 'liquidation'
  },
  // Add more sample executions for comprehensive demo
  ...[...Array(12)].map((_, i) => ({
    id: `${i + 9}`,
    symbol: ['BTC-USD', 'ETH-USD', 'SOL-USD'][Math.floor(Math.random() * 3)],
    side: Math.random() > 0.5 ? 'buy' : 'sell',
    type: ['market', 'limit', 'stop'][Math.floor(Math.random() * 3)],
    status: ['filled', 'partial', 'canceled', 'rejected'][Math.floor(Math.random() * 4)],
    price: 64000 + (Math.random() * 1000),
    size: Math.random() * 5,
    value: Math.random() * 100000,
    filled: Math.random() * 5,
    remaining: Math.random() * 2,
    fee: Math.random() * 50,
    timestamp: new Date(Date.now() - (i * 3600000)).toISOString(),
    averagePrice: 64000 + (Math.random() * 1000)
  }))
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
          <option value="minimal">Minimal</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Page Size
        </label>
        <select
          value={values.pageSize}
          onChange={(e) => onChange({ ...values, pageSize: Number(e.target.value) })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="5">5 rows</option>
          <option value="10">10 rows</option>
          <option value="20">20 rows</option>
          <option value="50">50 rows</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showFilters}
            onChange={(e) => onChange({ ...values, showFilters: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Filters</span>
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
      <ExecutionTables
        executions={SAMPLE_EXECUTIONS}
        {...config}
      />
    </div>
  );
};

export const ExecutionTablesShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    pageSize: 10,
    showFilters: true
  });

  const generateCode = () => {
    const props = [];
    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (config.pageSize !== 10) props.push(`pageSize={${config.pageSize}}`);
    if (!config.showFilters) props.push('showFilters={false}');

    return `<ExecutionTables
  executions={[
    {
      id: '1',
      symbol: 'BTC-USD',
      side: 'buy',
      type: 'market',
      status: 'filled',
      price: 64223.89,
      size: 1.5,
      value: 96335.84,
      filled: 1.5,
      remaining: 0,
      fee: 48.17,
      timestamp: '2024-03-15T12:00:00Z',
      averagePrice: 64223.89
    },
    // ... more executions
  ]}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Execution Tables Component
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

export default ExecutionTablesShowcase;

