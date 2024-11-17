// @ts-nocheck

// src/components/tradingsession/TradingSessionShowcase.tsx

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { TradingSession } from './TradingSession';

// Generate realistic sample data for a trading session
const generateSampleData = (points = 100) => {
  const data = [];
  let timestamp = new Date();
  timestamp.setHours(timestamp.getHours() - points);
  
  let price = 50000;
  let vwap = price;
  let cumVolume = 0;
  
  for (let i = 0; i < points; i++) {
    const noise = (Math.random() - 0.5) * 100;
    price += noise;
    const volume = Math.floor(Math.random() * 10 + 1);
    cumVolume += volume;
    vwap = ((vwap * cumVolume) + (price * volume)) / (cumVolume + volume);
    
    data.push({
      timestamp: new Date(timestamp.getTime() + i * 300000).toISOString(), // 5-min intervals
      price,
      volume,
      vwap,
      cumVolume,
      trades: Math.floor(Math.random() * 50 + 10),
      high: price + (Math.random() * 50),
      low: price - (Math.random() * 50)
    });
  }

  const stats = {
    sessionVolume: cumVolume,
    averagePrice: data.reduce((sum, d) => sum + d.price, 0) / data.length,
    priceRange: {
      high: Math.max(...data.map(d => d.high)),
      low: Math.min(...data.map(d => d.low)),
      range: Math.max(...data.map(d => d.high)) - Math.min(...data.map(d => d.low))
    },
    tradeCount: data.reduce((sum, d) => sum + d.trades, 0),
    volumeProfile: Array.from({ length: 10 }, (_, i) => ({
      price: price - 500 + (i * 100),
      volume: Math.random() * 100,
      buyVolume: Math.random() * 60,
      sellVolume: Math.random() * 40
    })),
    vwap: vwap,
    largeTradesCount: Math.floor(Math.random() * 50),
    smallTradesCount: Math.floor(Math.random() * 200)
  };

  return { data, stats };
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
          <option value="400">Small (400px)</option>
          <option value="500">Medium (500px)</option>
          <option value="600">Large (600px)</option>
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
      <pre className="bg-neutral-100 text-neutral-900 p-4 rounded-lg overflow-x-auto">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-neutral-200 hover:bg-neutral-300 
                 text-neutral-600 hover:text-neutral-800 transition-colors"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
};

export const TradingSessionShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    interval: '5m',
    height: 500,
    showVolume: true
  });

  const generateCode = () => {
    const props = [];
    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.interval !== '5m') props.push(`interval="${config.interval}"`);
    if (config.height !== 500) props.push(`height={${config.height}}`);
    if (!config.showVolume) props.push('showVolume={false}');

    return `<TradingSession
  data={[
    {
      timestamp: "2024-03-17T09:30:00Z",
      price: 50123.45,
      volume: 2.5,
      vwap: 50125.75,
      cumVolume: 2.5,
      trades: 15,
      high: 50150.00,
      low: 50100.00
    },
    // ... more data points
  ]}
  stats={{
    sessionVolume: 450.25,
    averagePrice: 50125.75,
    priceRange: {
      high: 50250.00,
      low: 50000.00,
      range: 250.00
    },
    tradeCount: 1250,
    volumeProfile: [/* ... */],
    vwap: 50125.75,
    largeTradesCount: 25,
    smallTradesCount: 1225
  }}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Trading Session Analysis
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
              <div className="p-6 rounded-lg bg-white">
                <TradingSession 
                  data={SAMPLE_DATA.data}
                  stats={SAMPLE_DATA.stats}
                  {...config}
                />
              </div>
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

export default TradingSessionShowcase;
