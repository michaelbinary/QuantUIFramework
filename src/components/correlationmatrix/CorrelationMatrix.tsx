// src/components/correlationmatrix/CorrelationMatrix.tsx
import React, { useMemo } from 'react';

interface Asset {
  symbol: string;
  correlations: Record<string, number>;
}

interface CorrelationMatrixProps {
  assets: Asset[];
  theme?: 'light' | 'dark';
  variant?: 'default' | 'compact' | 'gradient';
  showLabels?: boolean;
  height?: number;
}

export const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({
  assets,
  theme = 'light',
  variant = 'default',
  showLabels = true,
  height = 400
}) => {
  const isDark = theme === 'dark';
  
  // Memoize color calculations for performance
  const getCorrelationColor = useMemo(() => (value: number) => {
    if (variant === 'gradient') {
      // Use opacity for gradient effect
      if (value > 0) return `bg-blue-500 bg-opacity-${Math.round(value * 100)}`;
      return `bg-red-500 bg-opacity-${Math.round(Math.abs(value) * 100)}`;
    }
    // Default sharp color boundaries
    if (value > 0.7) return 'bg-blue-600';
    if (value > 0.3) return 'bg-blue-400';
    if (value > 0) return 'bg-blue-300';
    if (value > -0.3) return 'bg-red-300';
    if (value > -0.7) return 'bg-red-400';
    return 'bg-red-600';
  }, [variant]);

  const baseClasses = `
    w-full overflow-hidden rounded-lg border
    ${isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'}
  `;

  return (
    <div className={baseClasses} style={{ height: `${height}px` }}>
      {/* Header */}
      <div className={`px-4 py-2 border-b ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <span className="text-sm font-medium">Correlation Matrix</span>
      </div>

      {/* Matrix Content */}
      <div className="p-4 overflow-auto" style={{ height: `${height - 40}px` }}>
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2" />
              {assets.map(asset => (
                <th 
                  key={asset.symbol} 
                  className={`p-2 text-sm font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}
                >
                  {asset.symbol}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assets.map((rowAsset, i) => (
              <tr key={rowAsset.symbol}>
                <td className={`p-2 text-sm font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {rowAsset.symbol}
                </td>
                {assets.map((colAsset, j) => {
                  const correlation = i === j ? 1 : rowAsset.correlations[colAsset.symbol];
                  return (
                    <td 
                      key={`${rowAsset.symbol}-${colAsset.symbol}`}
                      className={`p-2 text-center ${getCorrelationColor(correlation)}`}
                    >
                      <span className={`text-sm font-mono ${Math.abs(correlation) > 0.3 ? 'text-white' : 'text-neutral-900'}`}>
                        {correlation.toFixed(2)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};