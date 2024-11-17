
// src/components/riskcontrols/RiskControls.tsx

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Shield, 
  DollarSign, 
  Percent, 
  Scale,
  Clock,
  BarChart2,
  Lock,
  Settings,
  Power,
  Sliders,
  Wallet
} from 'lucide-react';

interface RiskLimit {
  type: string;
  value: number;
  threshold: number;
  enabled: boolean;
  timeframe?: string;
}

interface RiskParameters {
  maxPositionSize: number;
  maxLeverage: number;
  maxDrawdown: number;
  maxDailyLoss: number;
  maxOpenPositions: number;
  marginCallLevel: number;
  liquidationLevel: number;
  stopLossRequired: boolean;
  tradingSizeLimit: number;
  maxConcentration: number;
  orderSizeLimit: number;
  limits: RiskLimit[];
}

interface RiskControlsProps {
  parameters: RiskParameters;
  variant?: 'default' | 'detailed' | 'compact';
  theme?: 'light' | 'dark';
  onParameterChange?: (key: string, value: any) => void;
  onLimitChange?: (limitType: string, changes: Partial<RiskLimit>) => void;
  readOnly?: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercent = (value: number) => {
  return `${value.toFixed(2)}%`;
};

export const RiskControls = ({
  parameters,
  variant = 'default',
  theme = 'light',
  onParameterChange,
  onLimitChange,
  readOnly = false,
}: RiskControlsProps) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('general');

  const baseClasses = `
    w-full overflow-hidden border rounded-lg
    ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}
    ${isDark ? 'text-neutral-100' : 'text-neutral-900'}
  `;

  const renderParameterInput = (
    key: string,
    label: string,
    value: number,
    icon: React.ReactNode,
    type: 'currency' | 'percent' | 'number' = 'number',
    description?: string
  ) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-neutral-500">
        {label}
      </label>
      <div className="relative mt-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
          {icon}
        </div>
        <input
          type="number"
          value={value}
          onChange={(e) => onParameterChange?.(key, Number(e.target.value))}
          disabled={readOnly}
          className={`
            w-full pl-10 pr-4 py-2 rounded-lg
            ${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}
            ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}
            border focus:outline-none focus:ring-2 focus:ring-neutral-500
          `}
          placeholder={type === 'currency' ? '1000' : type === 'percent' ? '10' : '5'}
        />
        {description && (
          <p className="mt-1 text-xs text-neutral-500">{description}</p>
        )}
      </div>
    </div>
  );

  const renderLimitToggle = (limit: RiskLimit) => (
    <div className={`p-4 rounded-lg ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`
            p-2 rounded-lg
            ${limit.enabled
              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400'
              : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400'}
          `}>
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium">{limit.type}</h3>
            <p className="text-xs text-neutral-500">
              Threshold: {
                limit.type.includes('Percent') 
                  ? formatPercent(limit.threshold)
                  : formatCurrency(limit.threshold)
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!readOnly && (
            <button
              onClick={() => onLimitChange?.(limit.type, { enabled: !limit.enabled })}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full
                ${limit.enabled
                  ? 'bg-emerald-500'
                  : 'bg-neutral-300 dark:bg-neutral-600'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition
                  ${limit.enabled ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          )}
          {variant === 'detailed' && !readOnly && (
            <button 
              onClick={() => {/* Open settings modal */}}
              className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <Settings className="h-4 w-4 text-neutral-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderGeneralControls = () => (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderParameterInput(
          'maxPositionSize',
          'Max Position Size',
          parameters.maxPositionSize,
          <DollarSign className="h-4 w-4" />,
          'currency',
          'Maximum size for any single position'
        )}
        {renderParameterInput(
          'maxLeverage',
          'Max Leverage',
          parameters.maxLeverage,
          <Scale className="h-4 w-4" />,
          'number',
          'Maximum allowed leverage'
        )}
        {renderParameterInput(
          'maxDrawdown',
          'Max Drawdown',
          parameters.maxDrawdown,
          <BarChart2 className="h-4 w-4" />,
          'percent',
          'Maximum allowable drawdown'
        )}
        {renderParameterInput(
          'maxDailyLoss',
          'Max Daily Loss',
          parameters.maxDailyLoss,
          <DollarSign className="h-4 w-4" />,
          'currency',
          'Maximum daily loss limit'
        )}
      </div>
    </div>
  );

  const renderLimitsControls = () => (
    <div className="space-y-4 p-4">
      {parameters.limits.map((limit) => renderLimitToggle(limit))}
    </div>
  );

  const renderAdvancedControls = () => (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderParameterInput(
          'marginCallLevel',
          'Margin Call Level',
          parameters.marginCallLevel,
          <Percent className="h-4 w-4" />,
          'percent'
        )}
        {renderParameterInput(
          'liquidationLevel',
          'Liquidation Level',
          parameters.liquidationLevel,
          <AlertTriangle className="h-4 w-4" />,
          'percent'
        )}
        {renderParameterInput(
          'maxConcentration',
          'Max Concentration',
          parameters.maxConcentration,
          <Percent className="h-4 w-4" />,
          'percent'
        )}
        {renderParameterInput(
          'orderSizeLimit',
          'Order Size Limit',
          parameters.orderSizeLimit,
          <DollarSign className="h-4 w-4" />,
          'currency'
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'general', label: 'General', icon: Sliders },
    { id: 'limits', label: 'Limits', icon: Shield },
    { id: 'advanced', label: 'Advanced', icon: Settings }
  ];

  return (
    <div className={baseClasses}>
      <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Risk Controls</h2>
          {readOnly && (
            <span className="flex items-center gap-1 text-sm text-neutral-500">
              <Lock className="h-4 w-4" />
              Read Only
            </span>
          )}
        </div>
      </div>

      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2
                ${activeTab === tab.id
                  ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}
              `}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'general' && renderGeneralControls()}
        {activeTab === 'limits' && renderLimitsControls()}
        {activeTab === 'advanced' && renderAdvancedControls()}
      </div>
    </div>
  );
};

export default RiskControls;

