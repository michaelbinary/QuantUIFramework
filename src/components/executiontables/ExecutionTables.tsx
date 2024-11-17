// src/components/executiontables/ExecutionTables.tsx

import React, { useState, useMemo } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  Filter,
  Search
} from 'lucide-react';

interface Execution {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop';
  status: 'filled' | 'partial' | 'canceled' | 'rejected';
  price: number;
  size: number;
  value: number;
  filled: number;
  remaining: number;
  fee: number;
  timestamp: string;
  averagePrice?: number;
  trigger?: 'stop_loss' | 'take_profit' | 'liquidation';
}

interface ExecutionTablesProps {
  executions: Execution[];
  variant?: 'default' | 'detailed' | 'minimal';
  theme?: 'light' | 'dark';
  pageSize?: number;
  showFilters?: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(value);
};

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString();
};

export const ExecutionTables = ({
  executions,
  variant = 'default',
  theme = 'light',
  pageSize = 10,
  showFilters = true,
}: ExecutionTablesProps) => {
  const isDark = theme === 'dark';
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const baseClasses = `
    w-full overflow-hidden border rounded-lg
    ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}
    ${isDark ? 'text-neutral-100' : 'text-neutral-900'}
  `;

  const filteredExecutions = useMemo(() => {
    return executions
      .filter(exec => {
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            exec.symbol.toLowerCase().includes(searchLower) ||
            exec.id.toLowerCase().includes(searchLower)
          );
        }
        return true;
      })
      .filter(exec => {
        if (statusFilter !== 'all') {
          return exec.status === statusFilter;
        }
        return true;
      })
      .filter(exec => {
        if (typeFilter !== 'all') {
          return exec.type === typeFilter;
        }
        return true;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return sortDirection === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
  }, [executions, searchTerm, statusFilter, typeFilter, sortField, sortDirection]);

  const pageCount = Math.ceil(filteredExecutions.length / pageSize);
  const paginatedExecutions = filteredExecutions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderHeader = () => (
    <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Executions</h3>
        {showFilters && (
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`
                  pl-9 pr-4 py-1.5 text-sm rounded-md
                  ${isDark 
                    ? 'bg-neutral-800 border-neutral-700 text-neutral-100' 
                    : 'bg-white border-neutral-300 text-neutral-900'}
                  border focus:outline-none focus:ring-2 focus:ring-neutral-500
                `}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`
                px-3 py-1.5 text-sm rounded-md
                ${isDark 
                  ? 'bg-neutral-800 border-neutral-700 text-neutral-100' 
                  : 'bg-white border-neutral-300 text-neutral-900'}
                border focus:outline-none focus:ring-2 focus:ring-neutral-500
              `}
            >
              <option value="all">All Status</option>
              <option value="filled">Filled</option>
              <option value="partial">Partial</option>
              <option value="canceled">Canceled</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`
                px-3 py-1.5 text-sm rounded-md
                ${isDark 
                  ? 'bg-neutral-800 border-neutral-700 text-neutral-100' 
                  : 'bg-white border-neutral-300 text-neutral-900'}
                border focus:outline-none focus:ring-2 focus:ring-neutral-500
              `}
            >
              <option value="all">All Types</option>
              <option value="market">Market</option>
              <option value="limit">Limit</option>
              <option value="stop">Stop</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'filled':
        return `${baseClasses} bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300`;
      case 'partial':
        return `${baseClasses} bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300`;
      case 'canceled':
        return `${baseClasses} bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300`;
      case 'rejected':
        return `${baseClasses} bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300`;
      default:
        return `${baseClasses} bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300`;
    }
  };

  const renderTableHeader = () => (
    <thead className="bg-neutral-50 dark:bg-neutral-800">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Time
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Symbol
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Side/Type
        </th>
        <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Price
        </th>
        <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Size
        </th>
        {variant === 'detailed' && (
          <>
            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Value
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Fee
            </th>
          </>
        )}
        <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Status
        </th>
      </tr>
    </thead>
  );

  const renderTableRow = (execution: Execution) => (
    <tr key={execution.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
      <td className="px-4 py-3 whitespace-nowrap text-sm">
        {formatTime(execution.timestamp)}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
        {execution.symbol}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium
            ${execution.side === 'buy' 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
              : 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300'}`}
          >
            {execution.side.toUpperCase()}
          </span>
          <span className="text-xs text-neutral-500">
            {execution.type}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono">
        {formatCurrency(execution.price)}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono">
        {formatNumber(execution.size)}
      </td>
      {variant === 'detailed' && (
        <>
          <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono">
            {formatCurrency(execution.value)}
          </td>
          <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono">
            {formatCurrency(execution.fee)}
          </td>
        </>
      )}
      <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
        <span className={getStatusBadge(execution.status)}>
          {execution.status}
        </span>
      </td>
    </tr>
  );

  const renderPagination = () => (
    <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-500">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredExecutions.length)} of {filteredExecutions.length} results
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`
              px-3 py-1 rounded-md text-sm font-medium
              ${currentPage === 1
                ? 'text-neutral-400 cursor-not-allowed'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'}
            `}
          >
            Previous
          </button>
          <span className="text-sm text-neutral-500">
            Page {currentPage} of {pageCount}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
            disabled={currentPage === pageCount}
            className={`
              px-3 py-1 rounded-md text-sm font-medium
              ${currentPage === pageCount
                ? 'text-neutral-400 cursor-not-allowed'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'}
            `}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={baseClasses}>
      {renderHeader()}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
          {renderTableHeader()}
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {paginatedExecutions.map(renderTableRow)}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );
};

export default ExecutionTables;

