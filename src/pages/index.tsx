// @ts-nocheck

import React from 'react';
import { 
  ExternalLink, 
  LineChart, 
  Shield, 
  Zap,
  Code,
  Layout,
  Database,
  GitFork,
  Terminal,
  TrendingUp,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';

// Quick demo components
import { PriceTicker } from '../components/tickers/PriceTicker';
import { OrderBook } from '../components/orderbook/OrderBook';
import { MarketDepth } from '../components/marketdepth/MarketDepth';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm z-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-emerald-500" />
              <span className="font-mono font-medium text-white">QuantFramework</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#features" className="text-sm text-neutral-400 hover:text-white">Features</a>
              <a href="#components" className="text-sm text-neutral-400 hover:text-white">Components</a>
              <a href="#quickstart" className="text-sm text-neutral-400 hover:text-white">Usage</a>
              <a href="https://github.com/quantframework" 
                className="inline-flex items-center gap-2 text-sm bg-neutral-800 px-4 py-2 rounded-lg hover:bg-neutral-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero with Quick Demo */}
      <section className="pt-32 pb-16 border-b border-neutral-800">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-lg text-sm text-emerald-400 mb-6">
                <Zap className="h-4 w-4" />
                Professional Trading Tools
              </div>
              <h1 className="text-5xl font-mono font-medium leading-tight">
                React Components for{' '}
                <span className="text-emerald-400">
                  Professional Trading
                </span>
              </h1>
              <p className="mt-6 text-neutral-400 text-lg leading-relaxed">
                A comprehensive React UI framework designed specifically for building professional trading and financial applications with real-time data handling.
              </p>
              <div className="mt-10 flex items-center gap-4">
                <a 
                  href="#components"
                  className="px-8 py-3 bg-emerald-500 text-neutral-950 rounded-lg hover:bg-emerald-400 font-medium"
                >
                  View Components
                </a>
                <a 
                  href="#quickstart"
                  className="px-8 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700"
                >
                  Quick Start
                </a>
              </div>
            </div>
            <div className="bg-neutral-900 rounded-xl p-8 border border-neutral-800">
              <div className="space-y-6">
                <PriceTicker symbol="BTC" price={64280.50} change={2.34} />
                <PriceTicker symbol="ETH" price={3245.75} change={-1.2} />
                <OrderBook 
                  bids={[
                    {price: 64275.50, size: 1.2},
                    {price: 64270.25, size: 0.8}
                  ]}
                  asks={[
                    {price: 64285.75, size: 0.5},
                    {price: 64290.00, size: 1.5}
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-24 border-b border-neutral-800">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-3xl font-mono font-medium text-center mb-16">Framework Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Layout,
                title: "40+ Trading Components",
                description: "Comprehensive set of components for market data, analytics, and trading operations"
              },
              {
                icon: Zap,
                title: "High Performance",
                description: "Built for real-time data and high-frequency updates with minimal re-renders"
              },
              {
                icon: Shield,
                title: "Production Ready",
                description: "Battle-tested components used in professional trading environments"
              },
              {
                icon: Code,
                title: "Type Safe",
                description: "Full TypeScript support with comprehensive type definitions"
              },
              {
                icon: GitFork,
                title: "Customizable",
                description: "Highly customizable with support for light/dark themes and variants"
              },
              {
                icon: Terminal,
                title: "Developer Friendly",
                description: "Excellent developer experience with detailed documentation"
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-lg border border-neutral-800 bg-neutral-900 hover:border-neutral-700 transition-colors">
                <feature.icon className="h-6 w-6 mb-4 text-emerald-500" />
                <h3 className="font-mono text-lg mb-2">{feature.title}</h3>
                <p className="text-neutral-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Components */}
      <section id="components" className="py-24 bg-neutral-900 border-y border-neutral-800">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-3xl font-mono font-medium text-center mb-16">Components</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Market Data */}
            <div className="p-6 rounded-lg bg-neutral-950 border border-neutral-800">
              <div className="flex items-center gap-3 mb-6">
                <Database className="h-6 w-6 text-emerald-500" />
                <h3 className="font-mono text-xl">Market Data</h3>
              </div>
              <ul className="space-y-3 text-neutral-400">
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  Real-time price tickers
                </li>
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  Advanced order book visualization
                </li>
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  Trade history with filtering
                </li>
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  Market depth charts
                </li>
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  Time & sales displays
                </li>
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  Level 2 data visualization
                </li>
              </ul>
            </div>

            {/* Analytics */}
            <div className="p-6 rounded-lg bg-neutral-950 border border-neutral-800">
              <div className="flex items-center gap-3 mb-6">
                <LineChart className="h-6 w-6 text-emerald-500" />
                <h3 className="font-mono text-xl">Analytics</h3>
              </div>
              <ul className="space-y-3 text-neutral-400">
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  Performance metric dashboards
                </li>
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  Risk analysis tools
                </li>
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  Portfolio statistics
                </li>
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  P&L tracking and visualization
                </li>
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  Historical analysis charts
                </li>
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  Custom indicator support
                </li>
              </ul>
            </div>

            {/* Trading */}
            <div className="p-6 rounded-lg bg-neutral-950 border border-neutral-800">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="h-6 w-6 text-emerald-500" />
                <h3 className="font-mono text-xl">Trading</h3>
              </div>
              <ul className="space-y-3 text-neutral-400">
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  Advanced order entry forms
                </li>
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  Position management cards
                </li>
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  Execution tables and history
                </li>
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  Risk control panels
                </li>
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  One-click trading support
                </li>
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  Order management system
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Usage & Quick Start */}
      <section id="quickstart" className="py-24">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-mono font-medium text-center mb-8">Usage & Quick Start</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-mono text-lg mb-3">1. Installation</h3>
                <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
                  <code className="text-sm text-emerald-400 font-mono">npm install quantframework</code>
                </div>
              </div>

              <div>
                <h3 className="font-mono text-lg mb-3">2. Import Components</h3>
                <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
                  <code className="text-sm text-emerald-400 font-mono">
                    {`import { PriceTicker, OrderBook } from 'quantframework'`}
                  </code>
                </div>
              </div>

              <div>
                <h3 className="font-mono text-lg mb-3">3. Use in Your App</h3>
                <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
                  <code className="text-sm text-emerald-400 font-mono whitespace-pre">
{`<PriceTicker
  symbol="BTC"
  price={64280.50}
  change={2.34}
/>`}
                  </code>
                </div>
              </div>

              <div className="pt-4">
                <a 
                  href="https://github.com/quantframework"
                  className="text-sm text-neutral-400 hover:text-emerald-400 inline-flex items-center gap-2 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;