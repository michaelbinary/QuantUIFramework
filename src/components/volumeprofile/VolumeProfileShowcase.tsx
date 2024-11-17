// src/components/volumeprofile/VolumeProfileShowcase.tsx

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { VolumeProfile } from './VolumeProfile';

// Generate realistic sample data
const generateSampleData = () => {
  const basePrice = 64000;
  const data = [];
  
  // Create a normal distribution of volume
  for (let i = 0; i < 100; i++) {
    const price = basePrice - i * 10;
    const normalizedPosition = (i - 50) / 50; // -1 to 1
    const volumeBase = Math.exp(-(normalizedPosition * normalizedPosition) * 2);
    const randomFactor = 0.7 + Math.random() * 0.6; // Add some randomness
    
    const totalVolume = volumeBase * 100 * randomFactor;
    // Slightly more buy volume than sell for a bullish bias
    const buyVolume = totalVolume * (0.45 + Math.random() * 0.2);
    const sellVolume = totalVolume - buyVolume;
    
    data.push({
      price,
      volume: totalVolume,
      buyVolume,
      sellVolume,
      totalVolume,
      volumePercentage: 0 // Will be calculated in component
    });
  }
  
  return data;
};

const SAMPLE_DATA = {
  data: generateSampleData()
};

const Controls = ({ values, onChange }) => {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg border border-neutral-200">
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
          <option value="separated">Separated</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Orientation
        </label>
        <select
          value={values.orientation}
          onChange={(e) => onChange({ ...values, orientation: e.target.value })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
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
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Price Levels
        </label>
        <select
          value={values.levels}
          onChange={(e) => onChange({ ...values, levels: Number(e.target.value) })}
          className="w-full p-2 border border-neutral-200 rounded-md bg-white text-neutral-700"
        >
          <option value="12">12 Levels</option>
          <option value="24">24 Levels</option>
          <option value="48">48 Levels</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showValueArea}
            onChange={(e) => onChange({ ...values, showValueArea: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Value Area</span>
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.showPOC}
            onChange={(e) => onChange({ ...values, showPOC: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Show Point of Control</span>
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

export const VolumeProfileShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    orientation: 'horizontal',
    height: 400,
    levels: 24,
    showValueArea: true,
    showPOC: true,
    valueAreaPercent: 68
  });

  const generateCode = () => {
    const props = [];
    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (config.orientation !== 'horizontal') props.push(`orientation="${config.orientation}"`);
    if (config.height !== 400) props.push(`height={${config.height}}`);
    if (config.levels !== 24) props.push(`levels={${config.levels}}`);
    if (!config.showValueArea) props.push('showValueArea={false}');
    if (!config.showPOC) props.push('showPOC={false}');
    if (config.valueAreaPercent !== 68) props.push(`valueAreaPercent={${config.valueAreaPercent}}`);

    return `<VolumeProfile
    data={[
      {
        price: 64000,
        volume: 85.2,
        buyVolume: 45.8,
        sellVolume: 39.4,
        totalVolume: 85.2,
        volumePercentage: 4.2
      },
      // ... more price levels
    ]}${props.length > 0 ? '\n    ' + props.join('\n    ') : ''}
  />`;
  };

  const LivePreview = ({ config }) => {
    const bgColor = config.theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-50';
    
    return (
      <div className={`p-6 rounded-lg ${bgColor}`}>
        <VolumeProfile {...SAMPLE_DATA} {...config} />
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Volume Profile Component
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

export default VolumeProfileShowcase;