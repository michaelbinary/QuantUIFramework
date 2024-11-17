// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages'
import { TickerShowcase } from './components/tickers/Showcase'
import { ScrollingTickerShowcase } from './components/scrollingticker'
import { OrderBookShowcase } from './components/orderbook'
import { TradeHistoryShowcase } from './components/tradehistory'
import { MarketDepthShowcase } from './components/marketdepth'
import { PerformanceMetricsShowcase } from './components/performancemetrics'
import { RiskAnalysisShowcase } from './components/riskanalysis'
import { PortfolioStatsShowcase } from './components/portfoliostats'
import { PnLTrackingShowcase } from './components/pnltracking'
import { OrderEntryShowcase } from './components/orderentry'
import { PositionCardsShowcase } from './components/positioncards'
import { ExecutionTablesShowcase } from './components/executiontables'
import { RiskControlsShowcase } from './components/riskcontrols'
import { CorrelationMatrixShowcase } from './components/correlationmatrix'
import { VolumeProfileShowcase } from './components/volumeprofile'
import { LiquidityFlowShowcase } from './components/liquidityflow'
import { TradingSessionShowcase } from './components/tradingsession'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen">
            <LandingPage />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <h2 className="text-2xl font-mono font-medium mb-12">Components</h2>
              <TickerShowcase />
              <ScrollingTickerShowcase/>
              <OrderBookShowcase/>
              <TradeHistoryShowcase/>
              <MarketDepthShowcase/>
              <PerformanceMetricsShowcase/>
              <RiskAnalysisShowcase/>
              <PortfolioStatsShowcase/>
              <PnLTrackingShowcase/>
              <OrderEntryShowcase/>
              <PositionCardsShowcase/>
              <ExecutionTablesShowcase/>
              <RiskControlsShowcase/>
              <CorrelationMatrixShowcase/>
              {/* <VolumeProfileShowcase/> */}
              {/* <LiquidityFlowShowcase/> */}
              <TradingSessionShowcase/>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App