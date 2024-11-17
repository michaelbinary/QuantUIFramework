// src/components/liquidityflow/LiquidityFlowShowcase.tsx

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { LiquidityFlow } from './LiquidityFlow';

// Generate some sample data
const generateSampleData = (points = 50) => {
  const data = [];
  let timestamp = new Date();
  timestamp.setHours(timestamp.getHours() - points);
  
  for (let i = 0; i < points; i++) {
    const baseVolume = 1000 + Math.random() * 2000;
    const buyVolume = baseVolume * (0.8 + Math.random() * 0.4);
    const sellVolume = baseVolume * (0.8 + Math.random() * 0.4);
    const largeOrders = Math.floor(Math.random() * 10);
    const smallOrders = Math.floor(Math.random() * 20);
    
    data.push({
      timestamp: new Date(timestamp.getTime() + i * 300000).toISOString(),
      buyVolume,
      sellVolume,
      avgBuySize: buyVolume / (largeOrders + smallOrders),
      avgSellSize: sellVolume / (largeOrders + smallOrders),
      largeOrders,
      smallOrders,
      imbalanceScore: ((buyVolume - sellVolume) / (buyVolume + sellVolume)) * 100,
      dominantSide: buyVolume > sellVolume ? 'buy' : 'sell',
      vwap: 50000 + Math.random() * 1000,
      totalVolume: buyVolume + sellVolume
    });
  }
  
  return data;
};

const SAMPLE_DATA = generateSampleData();

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
          Interval
        </label>
        <select
          value={values.interval}
          onChange={(e) => onChange({ ...values, interval: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="1m">1 Min</option>
          <option value="5m">5 Min</option>
          <option value="15m">15 Min</option>
          <option value="1h">1 Hour</option>
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
            checked={values.showMetrics}
            onChange={(e) => onChange({ ...values, showMetrics: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Metrics</span>
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

export const LiquidityFlowShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    interval: '5m',
    height: 400,
    showMetrics: true
  });

  const generateCode = () => {
    const props = [];
    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.interval !== '5m') props.push(`interval="${config.interval}"`);
    if (config.height !== 400) props.push(`height={${config.height}}`);
    if (!config.showMetrics) props.push('showMetrics={false}');

    return `<LiquidityFlow
  data={[
    {
      timestamp: "2024-03-17T09:30:00Z",
      buyVolume: 2150.45,
      sellVolume: 1850.32,
      avgBuySize: 215.04,
      avgSellSize: 185.03,
      largeOrders: 5,
      smallOrders: 15,
      imbalanceScore: 7.52,
      dominantSide: "buy",
      vwap: 50234.21,
      totalVolume: 4000.77
    },
    // ... more data points
  ]}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  const LivePreview = ({ config }) => {
    const bgColor = config.theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-50';
    
    return (
      <div className={`p-6 rounded-lg ${bgColor}`}>
        <LiquidityFlow
          data={SAMPLE_DATA}
          {...config}
        />
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Liquidity Flow Visualizer
            </h2>
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

export default LiquidityFlowShowcase;