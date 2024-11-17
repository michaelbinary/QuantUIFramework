// @ts-nocheck

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface PriceLevel {
  price: number;
  volume: number;
  buyVolume: number;
  sellVolume: number;
  totalVolume: number;
  volumePercentage: number;
  poc?: boolean;
  valueArea?: boolean;
}

interface VolumeProfileProps {
  data: PriceLevel[];
  theme?: 'light' | 'dark';
  variant?: 'default' | 'gradient' | 'separated';
  orientation?: 'vertical' | 'horizontal';
  height?: number;
  showValueArea?: boolean;
  showPOC?: boolean;
  levels?: number;
  valueAreaPercent?: number;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price);
};

const formatVolume = (volume: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1
  }).format(volume);
};

export const VolumeProfile: React.FC<VolumeProfileProps> = ({
  data,
  theme = 'light',
  variant = 'default',
  orientation = 'horizontal',
  height = 400,
  showValueArea = true,
  showPOC = true,
  levels = 24,
  valueAreaPercent = 68
}) => {
  const isDark = theme === 'dark';

  const processedData = useMemo(() => {
    const sortedData = [...data].sort((a, b) => b.price - a.price);
    const totalVolume = data.reduce((sum, item) => sum + item.volume, 0);
    const priceRange = sortedData[0].price - sortedData[sortedData.length - 1].price;
    const levelSize = priceRange / levels;
    
    const volumeLevels: PriceLevel[] = [];
    let currentLevel = sortedData[0].price;
    
    for (let i = 0; i < levels; i++) {
      const levelData = sortedData.filter(
        d => d.price <= currentLevel && d.price > currentLevel - levelSize
      );
      
      const levelVolume = levelData.reduce((sum, item) => sum + item.volume, 0);
      const levelBuyVolume = levelData.reduce((sum, item) => sum + (item.buyVolume || 0), 0);
      const levelSellVolume = levelData.reduce((sum, item) => sum + (item.sellVolume || 0), 0);
      
      volumeLevels.push({
        price: currentLevel - levelSize / 2,
        volume: levelVolume,
        buyVolume: levelBuyVolume,
        sellVolume: levelSellVolume,
        totalVolume: levelVolume,
        volumePercentage: (levelVolume / totalVolume) * 100
      });
      
      currentLevel -= levelSize;
    }

    const pocLevel = volumeLevels.reduce((max, level) => 
      level.volume > max.volume ? level : max, volumeLevels[0]);
    pocLevel.poc = true;

    if (showValueArea) {
      const sortedByVolume = [...volumeLevels].sort((a, b) => b.volume - a.volume);
      let accumulatedVolume = 0;
      const targetVolume = totalVolume * (valueAreaPercent / 100);

      for (const level of sortedByVolume) {
        accumulatedVolume += level.volume;
        level.valueArea = accumulatedVolume <= targetVolume;
      }
    }

    return volumeLevels;
  }, [data, levels, valueAreaPercent, showValueArea]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className={`p-2 rounded shadow-lg border ${
        isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'
      }`}>
        <p className="text-sm font-medium mb-1">{formatPrice(payload[0].payload.price)}</p>
        <div className="space-y-1 text-xs">
          <p className="text-blue-500">Buy: {formatVolume(payload[0].payload.buyVolume)}</p>
          <p className="text-red-500">Sell: {formatVolume(payload[0].payload.sellVolume)}</p>
          <p className="font-medium">Total: {formatVolume(payload[0].payload.volume)}</p>
        </div>
      </div>
    );
  };

  const baseClasses = `
    w-full overflow-hidden rounded-lg border
    ${isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'}
  `;

  return (
    <div className={baseClasses} style={{ height: `${height}px` }}>
      <div className={`px-4 py-2 border-b ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Volume Profile</span>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-sm" />
              <span>Buy Volume</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-sm" />
              <span>Sell Volume</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 h-[calc(100%-48px)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            layout={orientation === 'vertical' ? 'vertical' : 'horizontal'}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              type={orientation === 'vertical' ? 'number' : 'category'}
              dataKey={orientation === 'vertical' ? 'volume' : 'price'}
              tickFormatter={orientation === 'vertical' ? undefined : formatPrice}
              stroke={isDark ? '#525252' : '#a3a3a3'}
            />
            <YAxis
              type={orientation === 'vertical' ? 'category' : 'number'}
              dataKey={orientation === 'vertical' ? 'price' : 'volume'}
              tickFormatter={orientation === 'vertical' ? formatPrice : undefined}
              stroke={isDark ? '#525252' : '#a3a3a3'}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {variant === 'separated' ? (
              <>
                <Bar
                  dataKey="buyVolume"
                  fill="#3B82F6"
                  opacity={0.8}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="sellVolume"
                  fill="#EF4444"
                  opacity={0.8}
                  radius={[4, 4, 0, 0]}
                />
              </>
            ) : (
              <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                {processedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.poc && showPOC ? '#F59E0B' : 
                          entry.valueArea && showValueArea ? '#3B82F6' : 
                          variant === 'gradient' ? 
                            `rgba(${entry.buyVolume > entry.sellVolume ? '59, 130, 246' : '239, 68, 68'}, ${
                              Math.max(0.2, entry.volumePercentage / 100)})` : 
                            entry.buyVolume > entry.sellVolume ? '#3B82F6' : '#EF4444'}
                    opacity={variant === 'default' ? 0.8 : 1}
                  />
                ))}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VolumeProfile;