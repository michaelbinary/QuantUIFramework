// @ts-nocheck

// src/components/liquidityflow/LiquidityFlow.tsx

import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line
} from 'recharts';
import { 
  Clock, ArrowUp, ArrowDown, ActivitySquare, 
  WaveformCircle, Scale 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface LiquidityData {
  timestamp: string;
  buyVolume: number;
  sellVolume: number;
  avgBuySize: number;
  avgSellSize: number;
  largeOrders: number;
  smallOrders: number;
  imbalanceScore: number;
  dominantSide: 'buy' | 'sell' | 'neutral';
  vwap: number;
  totalVolume: number;
}

interface FlowMetrics {
  period: string;
  buyPressure: number;
  sellPressure: number;
  netFlow: number;
  largeOrdersRatio: number;
  imbalanceAvg: number;
}

interface LiquidityFlowProps {
  data: LiquidityData[];
  theme?: 'light' | 'dark';
  interval?: '1m' | '5m' | '15m' | '1h';
  showMetrics?: boolean;
  height?: number;
}

const formatNumber = (value: number, precision: number = 0) => {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: precision
  }).format(value);
};

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const LiquidityFlow: React.FC<LiquidityFlowProps> = ({
  data,
  theme = 'light',
  interval = '5m',
  showMetrics = true,
  height = 500
}) => {
  const isDark = theme === 'dark';

  const metrics = useMemo(() => {
    const totalBuyVolume = data.reduce((sum, d) => sum + d.buyVolume, 0);
    const totalSellVolume = data.reduce((sum, d) => sum + d.sellVolume, 0);
    const largeOrdersTotal = data.reduce((sum, d) => sum + d.largeOrders, 0);
    const totalOrders = data.reduce((sum, d) => sum + d.largeOrders + d.smallOrders, 0);
    
    return {
      period: "Current",
      buyPressure: totalBuyVolume / (totalBuyVolume + totalSellVolume) * 100,
      sellPressure: totalSellVolume / (totalBuyVolume + totalSellVolume) * 100,
      netFlow: totalBuyVolume - totalSellVolume,
      largeOrdersRatio: (largeOrdersTotal / totalOrders) * 100,
      imbalanceAvg: data.reduce((sum, d) => sum + d.imbalanceScore, 0) / data.length
    };
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className={`p-3 rounded-lg shadow-lg border ${
        isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'
      }`}>
        <p className="text-sm font-medium mb-2">{formatTime(label)}</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="text-blue-500">Buy Volume:</span>
            <span className="font-medium">{formatNumber(payload[0].value)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-red-500">Sell Volume:</span>
            <span className="font-medium">{formatNumber(payload[1].value)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Imbalance:</span>
            <span className={payload[2].value > 0 ? 'text-blue-500' : 'text-red-500'}>
              {payload[2].value.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  const MetricCard = ({ title, value, icon: Icon, trend, subtitle }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-neutral-500" />}
            <span className="text-sm font-medium text-neutral-500">{title}</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-medium">{value}</span>
          {trend && (
            <span className={`text-xs ${trend >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className={`w-full rounded-lg border ${
      isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'
    }`}>
      <div className={`px-4 py-3 border-b ${
        isDark ? 'border-neutral-800' : 'border-neutral-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ActivitySquare className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Liquidity Flow Analysis</span>
          </div>
          <select 
            value={interval}
            className={`text-sm border-0 bg-transparent focus:ring-0 ${
              isDark ? 'text-neutral-400' : 'text-neutral-500'
            }`}
          >
            <option value="1m">1 Min</option>
            <option value="5m">5 Min</option>
            <option value="15m">15 Min</option>
            <option value="1h">1 Hour</option>
          </select>
        </div>
      </div>

      {showMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <MetricCard
            title="Buy Pressure"
            value={`${metrics.buyPressure.toFixed(1)}%`}
            icon={ArrowUp}
            trend={metrics.netFlow > 0 ? metrics.buyPressure - 50 : undefined}
          />
          <MetricCard
            title="Sell Pressure"
            value={`${metrics.sellPressure.toFixed(1)}%`}
            icon={ArrowDown}
            trend={metrics.netFlow < 0 ? metrics.sellPressure - 50 : undefined}
          />
          <MetricCard
            title="Large Orders"
            value={`${metrics.largeOrdersRatio.toFixed(1)}%`}
            icon={Scale}
            subtitle="Percent of total volume"
          />
        </div>
      )}

      <div className="p-4" style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTime}
              stroke={isDark ? '#525252' : '#a3a3a3'}
            />
            <YAxis 
              yAxisId="left"
              orientation="left"
              tickFormatter={value => formatNumber(value)}
              stroke={isDark ? '#525252' : '#a3a3a3'}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tickFormatter={value => `${value}%`}
              stroke={isDark ? '#525252' : '#a3a3a3'}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Bar 
              yAxisId="left"
              dataKey="buyVolume" 
              fill="#3B82F6"
              opacity={0.8}
              stackId="volume"
            />
            <Bar 
              yAxisId="left"
              dataKey="sellVolume" 
              fill="#EF4444"
              opacity={0.8}
              stackId="volume"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="imbalanceScore"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};