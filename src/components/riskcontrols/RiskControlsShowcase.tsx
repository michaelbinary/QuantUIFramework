
// src/components/riskcontrols/RiskControlsShowcase.tsx

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { RiskControls } from './RiskControls';

const SAMPLE_PARAMETERS = {
  maxPositionSize: 100000,
  maxLeverage: 10,
  maxDrawdown: 25,
  maxDailyLoss: 10000,
  maxOpenPositions: 5,
  marginCallLevel: 80,
  liquidationLevel: 50,
  stopLossRequired: true,
  tradingSizeLimit: 250000,
  maxConcentration: 20,
  orderSizeLimit: 50000,
  limits: [
    {
      type: 'Daily Loss Limit',
      value: 10000,
      threshold: 10000,
      enabled: true,
      timeframe: '24h'
    },
    {
      type: 'Position Size Limit',
      value: 100000,
      threshold: 100000,
      enabled: true
    },
    {
      type: 'Leverage Limit',
      value: 10,
      threshold: 10,
      enabled: true
    },
    {
      type: 'Drawdown Percent',
      value: 25,
      threshold: 25,
      enabled: true,
      timeframe: '30d'
    },
    {
      type: 'Concentration Limit',
      value: 20,
      threshold: 20,
      enabled: false
    },
    {
      type: 'Trading Volume Limit',
      value: 1000000,
      threshold: 1000000,
      enabled: false,
      timeframe: '24h'
    },
    {
      type: 'Loss Percent Limit',
      value: 5,
      threshold: 5,
      enabled: true,
      timeframe: '24h'
    },
    {
      type: 'Margin Usage Limit',
      value: 80,
      threshold: 80,
      enabled: true
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
            checked={values.readOnly}
            onChange={(e) => onChange({ ...values, readOnly: e.target.checked })}
            className="rounded border-neutral-300"
          />
          <span className="text-sm font-medium text-neutral-700">Read Only Mode</span>
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
      <RiskControls
        parameters={SAMPLE_PARAMETERS}
        {...config}
        onParameterChange={(key, value) => console.log('Parameter changed:', key, value)}
        onLimitChange={(limitType, changes) => console.log('Limit changed:', limitType, changes)}
      />
    </div>
  );
};

export const RiskControlsShowcase = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const [config, setConfig] = useState({
    theme: 'light',
    variant: 'default',
    readOnly: false
  });

  const generateCode = () => {
    const props = [];
    if (config.theme !== 'light') props.push(`theme="${config.theme}"`);
    if (config.variant !== 'default') props.push(`variant="${config.variant}"`);
    if (config.readOnly) props.push('readOnly={true}');

    return `<RiskControls
  parameters={{
    maxPositionSize: 100000,
    maxLeverage: 10,
    maxDrawdown: 25,
    maxDailyLoss: 10000,
    // ... more parameters
    limits: [
      {
        type: 'Daily Loss Limit',
        value: 10000,
        threshold: 10000,
        enabled: true,
        timeframe: '24h'
      },
      // ... more limits
    ]
  }}
  onParameterChange={(key, value) => console.log('Parameter changed:', key, value)}
  onLimitChange={(limitType, changes) => console.log('Limit changed:', limitType, changes)}${props.length > 0 ? '\n  ' + props.join('\n  ') : ''}
/>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              Risk Controls Component
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

export default RiskControlsShowcase;

