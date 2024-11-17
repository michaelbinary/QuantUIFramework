// @ts-nocheck

// src/components/correlationmatrix/CorrelationMatrixShowcase.tsx
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { CorrelationMatrix } from './CorrelationMatrix';

const SAMPLE_DATA = {
  assets: [
    {
      symbol: 'BTC',
      correlations: {
        'ETH': 0.85,
        'SOL': 0.72,
        'BNB': 0.68,
        'XRP': 0.45
      }
    },
    {
      symbol: 'ETH',
      correlations: {
        'BTC': 0.85,
        'SOL': 0.78,
        'BNB': 0.65,
        'XRP': 0.42
      }
    },
    {
      symbol: 'SOL',
      correlations: {
        'BTC': 0.72,
        'ETH': 0.78,
        'BNB': 0.58,
        'XRP': 0.38
      }
    },
    {
      symbol: 'BNB',
      correlations: {
        'BTC': 0.68,
        'ETH': 0.65,
        'SOL': 0.58,
        'XRP': 0.35
      }
    },
    {
      symbol: 'XRP',
      correlations: {
        'BTC': 0.45,
        'ETH': 0.42,
        'SOL': 0.38,
        'BNB': 0.35
      }
    }
  ]
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
          className="w-full p-2 border border-neutral-200 rounded-md"
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
          className="w-full p-2 border border-neutral-200 rounded-md"
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
          className="w-full p-2 border border-neutral-200 rounded-md"
        >
          <option value="300">Small (300px)</option>
          <option value="400">Medium (400px)</option>
          <option value="500">Large (500px)</option>
        </select>
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

export const CorrelationMatrixShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    height: 400,
    showLabels: true
  });

  const generateCode = () => {
    const props = [];
    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (config.height !== 400) props.push(`height={${config.height}}`);
    if (!config.showLabels) props.push('showLabels={false}');

    return `<CorrelationMatrix
    assets={[
      {
        symbol: 'BTC',
        correlations: {
          'ETH': 0.85,
          'SOL': 0.72,
          // ... more correlations
        }
      },
      // ... more assets
    ]}${props.length > 0 ? '\n    ' + props.join('\n    ') : ''}
  />`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Correlation Matrix Component
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
              <div className={config.theme === 'dark' ? 'bg-neutral-900 p-6 rounded-lg' : 'bg-neutral-50 p-6 rounded-lg'}>
                <CorrelationMatrix {...SAMPLE_DATA} {...config} />
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