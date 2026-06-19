/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Plus, 
  Layers, 
  TrendingUpDown,
  Activity,
  Maximize2,
  Minimize2,
  Clock,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Asset, Trade } from '../types';

export interface ChartAreaProps {
  activeAsset: Asset;
  activeTrades: Trade[];
  chartType: 'candle' | 'mountain';
  setChartType: (type: 'candle' | 'mountain') => void;
  isMarketLiveMode: boolean;
  setIsMarketLiveMode: (live: boolean) => void;
}

export default function ChartArea({ 
  activeAsset, 
  activeTrades, 
  chartType, 
  setChartType,
  isMarketLiveMode,
  setIsMarketLiveMode
}: ChartAreaProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(35); // number of visible points
  const [showEMA, setShowEMA] = useState<boolean>(false);
  const [showRSI, setShowRSI] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 430 });
  const [hoveredCoords, setHoveredCoords] = useState<{ x: number, y: number, price: number } | null>(null);
  const [secondsCountdown, setSecondsCountdown] = useState<number>(56);

  // Dynamic Scrollback and Timeframe States
  const [scrollOffset, setScrollOffset] = useState<number>(0);
  const [timeframe, setTimeframe] = useState<string>('30s');
  const [showTimeframeSelector, setShowTimeframeSelector] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragStartScrollOffset, setDragStartScrollOffset] = useState<number>(0);

  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    const nextMode = !isFullScreen;
    setIsFullScreen(nextMode);

    if (nextMode) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.warn("Fullscreen API blocked or not supported in sandbox iframe, fallback to viewport overlay active", err);
        });
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.warn("Error exiting fullscreen:", err);
        });
      }
    }
  };

  // Keep state synchronized back if the user exits fullscreen using Esc key or native controls
  useEffect(() => {
    const handleFullscreenChange = () => {
      const liveNativeFull = !!document.fullscreenElement;
      if (liveNativeFull) {
        if (document.fullscreenElement === containerRef.current) {
          setIsFullScreen(true);
        }
      } else {
        setIsFullScreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Sync a rolling countdown timer ticking from :59 down to :00
  useEffect(() => {
    const interval = setInterval(() => {
      const secs = 60 - (Math.floor(Date.now() / 1000) % 60);
      setSecondsCountdown(secs);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Measure container dimensions interactively for accurate vector scaling
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ 
          width: Math.max(width, 280), 
          height: Math.max(height, window.innerWidth < 768 ? 140 : 280) 
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Extract prices raw history
  const prices = activeAsset.lastPrices;

  // Seconds of live tick history per candlestick depending on timeframe selection
  const secondsPerCandle: Record<string, number> = {
    '5s': 5,
    '15s': 15,
    '30s': 30,
    '45s': 45,
    '1min': 60,
    '5min': 300,
    '15min': 900,
    '30min': 1800,
    '1h': 3600,
    '2h': 7200,
    '3h': 10800,
  };
  const sec = secondsPerCandle[timeframe] || 30;

  // Group our current 1s tick history into chronological segments matching candlestick durations
  // Align from index 0 forward so previously completed candles remain fully static, and only the last one moves up/down.
  const liveChunks: number[][] = [];
  for (let j = 0; j < prices.length; j += sec) {
    const chunk = prices.slice(j, j + sec);
    if (chunk.length > 0) {
      liveChunks.push(chunk);
    }
  }

  // Create highly responsive Candlesticks from live ticks 
  const liveCandles: { open: number; close: number; high: number; low: number; isGreen: boolean }[] = [];
  for (let i = 0; i < liveChunks.length; i++) {
    const chunk = liveChunks[i];
    
    // Connect open of each candle perfectly with the close of previous candle for seamless alignment
    const open = i > 0 ? liveCandles[i - 1].close : chunk[0];
    const close = chunk[chunk.length - 1];
    
    const baseHigh = Math.max(...chunk);
    const baseLow = Math.min(...chunk);
    
    const spread = (baseHigh - baseLow) || (close * 0.0001);
    const wickSpread = close * 0.00015;
    
    // Generates tight wicks representing the highest/lowest prices touched during the interval
    const high = Math.max(open, close, baseHigh) + (spread * 0.15 + wickSpread * (0.05 + (Math.sin(i) + 1) * 0.15));
    const low = Math.min(open, close, baseLow) - (spread * 0.15 + wickSpread * (0.05 + (Math.cos(i) + 1) * 0.15));

    liveCandles.push({
      open,
      close,
      high,
      low,
      isGreen: close >= open
    });
  }

  // Prepend deep, stable, realistic historical candle feeds to support consistent, infinite scrolling views
  const targetCount = 200;
  const historicalCount = Math.max(0, targetCount - liveCandles.length);
  const historicalCandles: { open: number; close: number; high: number; low: number; isGreen: boolean }[] = [];

  if (historicalCount > 0) {
    // Generate deterministic seeded seed sequences unique to current asset and timeframe 
    let seed = 0;
    for (let charIdx = 0; charIdx < activeAsset.id.length; charIdx++) {
      seed += activeAsset.id.charCodeAt(charIdx);
    }
    for (let charIdx = 0; charIdx < timeframe.length; charIdx++) {
      seed += timeframe.charCodeAt(charIdx) * 17;
    }
    
    const seededRandom = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // Magnify price variations on higher timeframes to represent hours/minutes vs. seconds
    let volatilityScale = 0.0003;
    if (timeframe === '5s') volatilityScale = 0.00015;
    else if (timeframe === '15s') volatilityScale = 0.00028;
    else if (timeframe === '30s') volatilityScale = 0.00038;
    else if (timeframe === '45s') volatilityScale = 0.00048;
    else if (timeframe === '1min') volatilityScale = 0.00065;
    else if (timeframe === '5min') volatilityScale = 0.0014;
    else if (timeframe === '15min') volatilityScale = 0.0022;
    else if (timeframe === '30min') volatilityScale = 0.0035;
    else if (timeframe === '1h') volatilityScale = 0.005;
    else if (timeframe === '2h') volatilityScale = 0.007;
    else if (timeframe === '3h') volatilityScale = 0.009;

    // Standard Asset Class characteristics variations
    if (activeAsset.type === 'crypto') {
      volatilityScale *= 1.7;
    } else if (activeAsset.type === 'currencies') {
      volatilityScale *= 0.65;
    }

    // Work backwards starting at the open price of the earliest live chunk segment
    let lastClose = liveCandles.length > 0 ? liveCandles[0].open : activeAsset.currentPrice;

    for (let i = 0; i < historicalCount; i++) {
      // Build realistic-looking wave trends (bull runs / bear drops) rather than flat static chaos
      const trendCycle = Math.sin(i / 11) * 0.16;
      const r = seededRandom();
      const changePercent = (r - 0.49 + trendCycle) * volatilityScale;
      
      const change = lastClose * changePercent;
      const open = lastClose - change; 
      const close = lastClose;

      const bodyMax = Math.max(open, close);
      const bodyMin = Math.min(open, close);
      const bodyDiff = bodyMax - bodyMin;

      // Realistic trading wick sizes
      const wickHigh = bodyMax + (bodyDiff * 0.3 + (bodyMax * seededRandom() * volatilityScale * 0.25));
      const wickLow = bodyMin - (bodyDiff * 0.3 + (bodyMin * seededRandom() * volatilityScale * 0.25));

      historicalCandles.push({
        open,
        close,
        high: wickHigh,
        low: wickLow,
        isGreen: close >= open
      });

      lastClose = open;
    }

    historicalCandles.reverse();
  }

  // Combine past deterministic history segments and current live-updating candle segments
  const allCandles = [...historicalCandles, ...liveCandles];

  // Calculate maximum scrolling limit based on generated candles and zoomLevel
  const maxScrollOffset = Math.max(0, allCandles.length - zoomLevel);
  // Guarantee scrollOffset doesn't overflow bounds when changing zoom or timeframe
  const safeScrollOffset = Math.min(scrollOffset, maxScrollOffset);
  
  // Slice correct window representation of candles for view
  const endPosition = allCandles.length - safeScrollOffset;
  const startPosition = Math.max(0, endPosition - zoomLevel);
  const candles = allCandles.slice(startPosition, endPosition);

  // Derive equivalent closing prices array to power technical indicator lines
  const visiblePrices = candles.map(c => c.close);

  const maxPrice = candles.length > 0 ? Math.max(...candles.map(c => c.high)) * 1.0004 : activeAsset.currentPrice * 1.001;
  const minPrice = candles.length > 0 ? Math.min(...candles.map(c => c.low)) * 0.9996 : activeAsset.currentPrice * 0.999;
  const priceRange = maxPrice - minPrice;

  // Coordinate projections
  const paddingLeft = 14;
  const paddingRight = 84; // extra space on right for price axis labels
  const paddingTop = 45;
  const paddingBottom = showRSI ? 105 : 45; // extra bottom space for RSI oscillator if enabled

  const chartWidth = containerSize.width - paddingLeft - paddingRight;
  const chartHeight = containerSize.height - paddingTop - paddingBottom;

  const getX = (index: number) => {
    if (candles.length <= 1) return paddingLeft;
    return paddingLeft + (index / (candles.length - 1)) * chartWidth;
  };

  const getY = (price: number) => {
    if (priceRange === 0) return paddingTop + chartHeight / 2;
    // Invert Y axis for SVG rendering
    return paddingTop + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  // Smooth Indicators: EMA Tracker arrays
  const ema9: number[] = [];
  const ema21: number[] = [];
  
  const calculateEMA = (period: number) => {
    const k = 2 / (period + 1);
    let emaVal = visiblePrices[0] || activeAsset.currentPrice;
    const result: number[] = [emaVal];
    for (let i = 1; i < visiblePrices.length; i++) {
      emaVal = visiblePrices[i] * k + emaVal * (1 - k);
      result.push(emaVal);
    }
    return result;
  };

  if (visiblePrices.length > 5) {
    const e9 = calculateEMA(9);
    const e21 = calculateEMA(21);
    e9.forEach(val => ema9.push(val));
    e21.forEach(val => ema21.push(val));
  }

  // RSI Calculations (Relative Strength Index over 14 elements)
  const rsiValues: number[] = [];
  const rsiPeriod = 14;
  if (visiblePrices.length >= rsiPeriod) {
    let gains = 0;
    let losses = 0;
    
    // Initial RSI calculations
    for (let i = 1; i < rsiPeriod; i++) {
      const diff = visiblePrices[i] - visiblePrices[i - 1];
      if (diff > 0) gains += diff;
      else losses -= diff;
    }
    
    let avgGain = gains / rsiPeriod;
    let avgLoss = losses / rsiPeriod;
    
    // first value
    let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsiValues.push(avgLoss === 0 ? 100 : 100 - (100 / (1 + rs)));

    for (let i = rsiPeriod; i < visiblePrices.length; i++) {
      const diff = visiblePrices[i] - visiblePrices[i - 1];
      const gain = diff > 0 ? diff : 0;
      const loss = diff < 0 ? -diff : 0;
      avgGain = (avgGain * (rsiPeriod - 1) + gain) / rsiPeriod;
      avgLoss = (avgLoss * (rsiPeriod - 1) + loss) / rsiPeriod;
      
      rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsiValues.push(avgLoss === 0 ? 100 : 100 - (100 / (1 + rs)));
    }
    // Pad initial values with 50 for layout consistency
    while (rsiValues.length < visiblePrices.length) {
      rsiValues.unshift(50);
    }
  } else {
    // Fill with base baseline if not enough data
    visiblePrices.forEach(() => rsiValues.push(50));
  }

  // RSI display heights
  const rsiPanelY = paddingTop + chartHeight + 35;
  const rsiPanelHeight = 55;
  const getRSI_Y = (rsiVal: number) => {
    // inverted map, 100 to 0
    return rsiPanelY + rsiPanelHeight - (rsiVal / 100) * rsiPanelHeight;
  };

  // Passive touchmove intercept to prevent browser page panning while dragging the chart
  useEffect(() => {
    const canvas = document.getElementById('primary-chart-canvas');
    if (!canvas) return;
    const handlePrevent = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
      }
    };
    canvas.addEventListener('touchmove', handlePrevent, { passive: false });
    return () => {
      canvas.removeEventListener('touchmove', handlePrevent);
    };
  }, []);

  // Interactive drag-scrolling/touch-swiping action for horizontal panning history
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target && (e.target as Element).closest('button')) return; // ignore buttons
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartScrollOffset(scrollOffset);
  };

  const handleMouseMoveSVG = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      const deltaX = e.clientX - dragStartX;
      const step = chartWidth / (candles.length - 1 || 1);
      // Floating-point candles moved for absolute smooth continuously interactive dragging!
      const candlesMoved = deltaX / (step || 10);
      // Moving mouse to the right (deltaX > 0) pulls OLDER data into view (scrollback increases)
      const nextOffset = Math.max(0, Math.min(maxScrollOffset, dragStartScrollOffset + candlesMoved));
      setScrollOffset(nextOffset);
    } else {
      if (x >= paddingLeft && x <= paddingLeft + chartWidth && y >= paddingTop && y <= paddingTop + chartHeight) {
        const normalizedY = (paddingTop + chartHeight - y) / chartHeight;
        const price = minPrice + normalizedY * priceRange;
        setHoveredCoords({ x, y, price });
      } else {
        setHoveredCoords(null);
      }
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch Support for mobile and touch devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.target && (e.target as Element).closest('button')) return; // ignore buttons
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStartX(e.touches[0].clientX);
      setDragStartScrollOffset(scrollOffset);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - dragStartX;
      const step = chartWidth / (candles.length - 1 || 1);
      const candlesMoved = deltaX / (step || 10);
      const nextOffset = Math.max(0, Math.min(maxScrollOffset, dragStartScrollOffset + candlesMoved));
      setScrollOffset(nextOffset);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Mouse Wheel and Trackpad scrolling support for quick panning back & forth
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 0.5) return;
    const scrollAmount = delta * 0.08;
    setScrollOffset((prev) => Math.max(0, Math.min(maxScrollOffset, prev + scrollAmount)));
  };

  // SVG Area mapping formulas
  let linePath = '';
  let areaPath = '';
  if (candles.length > 0) {
    const points = candles.map((c, idx) => `${getX(idx)},${getY(c.close)}`);
    linePath = `M ${points.join(' L ')}`;
    
    const startBottom = `${getX(0)},${paddingTop + chartHeight}`;
    const endBottom = `${getX(candles.length - 1)},${paddingTop + chartHeight}`;
    areaPath = `M ${points[0]} L ${points.join(' L ')} L ${endBottom} L ${startBottom} Z`;
  }

  // Current live status updates
  const currentPrice = activeAsset.currentPrice;
  const currentPriceY = getY(currentPrice);
  const isUpTrend = activeAsset.trend === 'up';

  return (
    <div 
      id="chart-area-container" 
      className={`bg-[#090c0f] flex flex-col overflow-hidden relative shadow-2xl transition-all ${
        isFullScreen 
          ? 'fixed inset-0 z-[120] rounded-none border-none p-1.5 xs:p-3 sm:p-4 bg-[#05070a]' 
          : 'flex-1 border border-white/5 rounded-3xl'
      }`} 
      ref={containerRef}
    >
      
      {/* 1. CHART TOP ROW HEADER: Asset stats, Price, Candle/Mountain selector */}
      <div id="chart-header" className="flex items-center justify-between px-3 py-1.5 md:px-5 md:py-3.5 bg-slate-950/60 border-b border-white/5 backdrop-blur">
        <div id="chart-asset-badge-info" className="flex items-center gap-2 md:gap-3 select-none">
          <div id="trend-icon-box" className={`w-7 h-7 md:w-9 md:h-9 rounded-xl flex items-center justify-center border ${
            isUpTrend ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            <TrendingUpDown size={14} className="md:w-[18px] md:h-[18px]" />
          </div>
          <div id="active-asset-headers" className="flex flex-col min-w-0">
            <div id="asset-title-row" className="flex items-center gap-2 max-w-[120px] xs:max-w-[200px] sm:max-w-xs md:max-w-md lg:max-w-lg min-w-0">
              <span id="chart-asset-title" className="font-sans font-bold text-sm md:text-base text-white tracking-tight truncate">{activeAsset.name}</span>
              <span id="asset-badge-payout" className="text-[10px] sm:text-xs font-mono font-bold bg-emerald-500/15 text-[#10b981] px-2 py-0.5 rounded-md border border-emerald-500/10 shadow whitespace-nowrap flex-shrink-0">
                +{activeAsset.payoutPct}% Yield
              </span>
            </div>
            <div id="asset-numbers" className="flex items-center gap-2 mt-0.5">
              <span id="asset-price-ticker" className="font-mono text-xs font-black tracking-wider text-amber-400">
                {activeAsset.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
              </span>
              <span id="asset-pct-badge" className={`font-mono text-[10px] font-bold flex items-center gap-0.5 ${
                isUpTrend ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {isUpTrend ? '▲' : '▼'} {Math.abs(activeAsset.changePct)}%
              </span>
              <span className="text-[9px] font-mono font-bold text-slate-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded ml-1 select-none">
                {activeAsset.type.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Setting Switch Buttons */}
        <div id="chart-setting-switches" className="flex items-center gap-1.5 sm:gap-2 select-none flex-shrink-0">
          <div id="view-options-combo" className="bg-white/5 rounded-xl p-0.5 flex gap-0.5 border border-white/5 shadow-inner flex-shrink-0">
            <button
              id="chart-type-mountain"
              onClick={() => setChartType('mountain')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                chartType === 'mountain' ? 'bg-blue-600 border border-blue-500 text-white shadow font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mountain
            </button>
            <button
              id="chart-type-candle"
              onClick={() => setChartType('candle')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                chartType === 'candle' ? 'bg-blue-600 border border-blue-500 text-white shadow font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Candle
            </button>
          </div>

          {/* Independent technical indicator toggle buttons */}
          <button
            id="rsi-toggle-btn"
            onClick={() => setShowRSI(!showRSI)}
            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              showRSI 
                ? 'bg-purple-500/15 border-purple-500/30 text-purple-300 shadow' 
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
            }`}
            title="Toggle Relative Strength Index (RSI 14)"
          >
            <Activity size={12} className={showRSI ? "text-purple-400 animate-pulse" : "text-slate-400"} />
            <span>RSI (14)</span>
          </button>

          {/* New integrated header Zoom controls to keep chart fully accessible */}
          <div id="chart-zoom-combo" className="bg-white/5 rounded-xl p-0.5 flex gap-0.5 border border-white/5 shadow-inner">
            <button 
              id="zoom-out-btn"
              onClick={() => setZoomLevel(Math.min(100, zoomLevel + 8))}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors"
              title="Zoom Out (Increase candle interval)"
            >
              <Minus size={13} />
            </button>
            <button 
              id="zoom-in-btn"
              onClick={() => setZoomLevel(Math.max(15, zoomLevel - 5))}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors"
              title="Zoom In (Focus close price)"
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Immersive Trading View Fullscreen Toggle */}
          <button
            id="chart-fullscreen-toggle"
            onClick={toggleFullscreen}
            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              isFullScreen 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow hover:bg-amber-500/30' 
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title={isFullScreen ? "Exit Full Screen" : "Expand to Full Screen View"}
          >
            {isFullScreen ? (
              <>
                <Minimize2 size={12} className="text-amber-400 animate-pulse" />
                <span className="hidden xs:inline">Exit Full</span>
              </>
            ) : (
              <>
                <Maximize2 size={12} className="text-slate-400" />
                <span className="hidden xs:inline">Full Screen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. MAIN SVG CANVAS: Plotting charts, EMA trails, Option Lanes, Cursor coordinates */}
      <div id="primary-chart-canvas" className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0d121c] via-[#090c0f] to-[#040608] cursor-crosshair overflow-hidden">
        
        {/* Dynamic Watermark Background Logo of PocketOption */}
        <div id="chart-watermark" className="absolute inset-x-0 top-1/4 bottom-1/4 flex flex-col justify-center items-center pointer-events-none opacity-[0.025] select-none">
          <h1 className="font-sans text-6xl md:text-9xl font-black tracking-widest uppercase text-white">Pocket</h1>
          <h1 className="font-sans text-4xl md:text-7xl font-black tracking-widest uppercase text-white mt-1">Option</h1>
        </div>

        <svg 
          id="live-stock-svg"
          width="100%" 
          height="100%" 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMoveSVG}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className={`absolute inset-0 select-none transition-all ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {/* Custom Grid Graticule Lines */}
          {Array.from({ length: 5 }).map((_, i) => {
            const ratio = (i + 1) / 6;
            const yVal = paddingTop + chartHeight * ratio;
            const labelPrice = maxPrice - ratio * priceRange;
            return (
              <g key={`grid-y-${i}`} id={`grid-line-grp-${i}`}>
                <line 
                  x1={paddingLeft} 
                  y1={yVal} 
                  x2={paddingLeft + chartWidth} 
                  y2={yVal} 
                  stroke="#121822" 
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                />
                <text 
                  x={paddingLeft + chartWidth + 6} 
                  y={yVal + 3} 
                  fill="#475569" 
                  fontSize="9.5" 
                  fontFamily="monospace"
                  textAnchor="start"
                  fontWeight="medium"
                >
                  {labelPrice.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 5 })}
                </text>
              </g>
            );
          })}

          {/* Time axis ticks */}
          {Array.from({ length: 4 }).map((_, i) => {
            const ratio = (i + 0.5) / 4;
            const xVal = paddingLeft + chartWidth * ratio;
            const secondsAgo = Math.round((4 - i) * 60);
            return (
              <g key={`grid-x-${i}`} id={`grid-time-grp-${i}`}>
                <line 
                  x1={xVal} 
                  y1={paddingTop} 
                  x2={xVal} 
                  y2={paddingTop + chartHeight} 
                  stroke="#0f141d" 
                  strokeWidth="0.8"
                />
                <text 
                  x={xVal} 
                  y={paddingTop + chartHeight + 16} 
                  fill="#475569" 
                  fontSize="9" 
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  -{secondsAgo}s
                </text>
              </g>
            );
          })}

          {/* Linear Gradients definitions for Area chart glows */}
          <defs>
            <linearGradient id="area-mountain-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="rsi-purple-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Mountain / Line rendering mode */}
          {chartType === 'mountain' && linePath && (
            <>
              {/* Glow Area */}
              <path d={areaPath} fill="url(#area-mountain-gradient)" id="mountain-area-glow-patch" />
              
              {/* Bold Path stroke */}
              <path 
                d={linePath} 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                id="mountain-main-line"
              />
            </>
          )}

          {/* Candlestick drawing mode */}
          {chartType === 'candle' && candles.map((candle, idx) => {
            const x = getX(idx);
            const step = chartWidth / (candles.length - 1 || 1);
            const candleWidth = Math.max(3.5, Math.min(24, step * 0.85));
            const xLeft = x - candleWidth / 2;

            const yHigh = getY(candle.high);
            const yLow = getY(candle.low);
            const yOpen = getY(candle.open);
            const yClose = getY(candle.close);
            
            const isGreen = candle.isGreen;
            const top = Math.min(yOpen, yClose);
            const height = Math.max(1.5, Math.abs(yClose - yOpen));
            const color = isGreen ? '#10b981' : '#f43f5e';

            return (
              <g key={`candle-${idx}`} id={`candle-render-group-${idx}`}>
                {/* Thin vertical wick centered precisely on the coordinate */}
                <line 
                  x1={x} 
                  y1={yHigh} 
                  x2={x} 
                  y2={yLow} 
                  stroke={color} 
                  strokeWidth="1.2"
                />
                {/* Candle Body centered on the coordinate */}
                <rect 
                  x={xLeft} 
                  y={top} 
                  width={candleWidth} 
                  height={height} 
                  fill={color} 
                  rx="0.5"
                />
              </g>
            );
          })}



          {/* Active Options strike lanes */}
          {activeTrades.filter(t => t.assetId === activeAsset.id && t.status === 'pending').map((position) => {
            const strikeY = getY(position.strikePrice);
            const isUpOrder = position.type === 'up';
            const color = isUpOrder ? '#10b981' : '#f43f5e';

            // Calculate precise dynamic coordinate of trade entry
            const elapsedSeconds = Math.max(0, Math.floor((Date.now() - position.createdAt) / 1000));
            // Map the elapsed seconds backwards from the rightmost active candle
            const candleIndexInAll = (allCandles.length - 1) - Math.floor(elapsedSeconds / sec);
            // Translate the candle index relative to current startPosition slice of view
            const candleIndexInVisible = candleIndexInAll - startPosition;

            const hasCoords = candleIndexInVisible >= 0 && candleIndexInVisible < candles.length;
            const tradeX = hasCoords ? getX(candleIndexInVisible) : paddingLeft;
            const badgeX = Math.min(tradeX + 10, paddingLeft + chartWidth - 120);

            return (
              <g key={`active-position-lane-${position.id}`} id={`trade-group-${position.id}`}>
                {/* Vertical helper line anchor at entry coordinate */}
                {hasCoords && (
                  <line 
                    x1={tradeX}
                    y1={paddingTop}
                    x2={tradeX}
                    y2={paddingTop + chartHeight}
                    stroke={color}
                    strokeWidth="1.2"
                    strokeDasharray="2 3"
                    strokeOpacity="0.45"
                  />
                )}

                {/* Dashed Horizontal Indicator at Strike Price extending from entry to right axis edge */}
                <line 
                  x1={tradeX} 
                  y1={strikeY} 
                  x2={paddingLeft + chartWidth} 
                  y2={strikeY} 
                  stroke={color} 
                  strokeWidth="1.5" 
                  strokeDasharray="5 4"
                />
                
                {/* Position Marker Bullet at the exact intersection of Strike Price and Entry X-axis position */}
                <circle 
                  cx={tradeX} 
                  cy={strikeY} 
                  r="6" 
                  fill={color} 
                  className="pulsate-trade" 
                />
                <circle 
                  cx={tradeX} 
                  cy={strikeY} 
                  r="12" 
                  stroke={color} 
                  strokeWidth="1.2"
                  fill="none" 
                  className="animate-ping" 
                  style={{ animationDuration: '2s' }}
                />

                {/* Strike Price and direction label badge */}
                <foreignObject 
                  x={badgeX} 
                  y={strikeY - 11} 
                  width="110" 
                  height="22"
                >
                  <div className={`rounded-lg px-2 py-0.5 text-[9px] font-mono font-black flex items-center justify-between gap-1 shrink-0 ${
                    isUpOrder ? 'bg-[#10b981] text-slate-950 shadow-md' : 'bg-[#f43f5e] text-white shadow-md'
                  }`}>
                    <span>{isUpOrder ? 'CALL ↑' : 'PUT ↓'}</span>
                    <span>kS{position.amount}</span>
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* EXPIRATION TIME REMAINING DEADLINE VERTICAL GUIDELINES */}
          {isMarketLiveMode && (
            <g id="live-expiration-countdown-guides">
              {/* Vertically dashed expiration deadline guide line */}
              <line 
                x1={paddingLeft + chartWidth * 0.72} 
                y1={paddingTop} 
                x2={paddingLeft + chartWidth * 0.72} 
                y2={paddingTop + chartHeight} 
                stroke="#f43f5e" 
                strokeWidth="1.5" 
                strokeDasharray="3 3"
                strokeOpacity="0.75"
              />

              {/* Countdown Circular Stopwatch Badge (from second screenshot!) */}
              <g transform={`translate(${paddingLeft + chartWidth * 0.72}, ${paddingTop + 16})`}>
                <circle r="13" fill="#090c0f" stroke="#f43f5e" strokeWidth="2" shadow="0 10px 20px rgba(0,0,0,0.5)" />
                <text 
                  textAnchor="middle" 
                  y="3.5" 
                  fill="#f43f5e" 
                  fontSize="9.5" 
                  fontWeight="black" 
                  fontFamily="monospace"
                >
                  :{secondsCountdown.toString().padStart(2, '0')}
                </text>
                <text 
                  textAnchor="middle" 
                  y="-18" 
                  fill="#94a3b8" 
                  fontSize="8.5" 
                  fontWeight="bold" 
                  fontFamily="sans-serif"
                  letterSpacing="0.2"
                >
                  Time remaining
                </text>
              </g>
            </g>
          )}

          {/* Live Price Action Ticker (Right Axis indicator margin) */}
          {visiblePrices.length > 0 && (
            <g id="current-live-pill-cursor">
              <line 
                x1={paddingLeft} 
                y1={currentPriceY} 
                x2={paddingLeft + chartWidth} 
                y2={currentPriceY} 
                stroke="#94a3b8" 
                strokeWidth="1" 
                strokeDasharray="2 3"
                strokeOpacity="0.4"
              />

              {/* Rotating radar aura dot */}
              <circle 
                cx={paddingLeft + chartWidth} 
                cy={currentPriceY} 
                r="7" 
                fill={isUpTrend ? '#10b981' : '#f43f5e'} 
                fillOpacity="0.35"
              />
              <circle 
                cx={paddingLeft + chartWidth} 
                cy={currentPriceY} 
                r="3" 
                fill={isUpTrend ? '#34d399' : '#f87171'} 
              />

              {/* Cursor Badge on price-axis */}
              <rect 
                x={paddingLeft + chartWidth + 3} 
                y={currentPriceY - 10} 
                width="78" 
                height="20" 
                rx="5" 
                fill={isUpTrend ? '#10b981' : '#f43f5e'} 
              />
              <text 
                x={paddingLeft + chartWidth + 42} 
                y={currentPriceY + 4} 
                fill="#ffffff" 
                fontSize="10" 
                fontFamily="monospace"
                fontWeight="black"
                textAnchor="middle"
              >
                {activeAsset.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
              </text>
            </g>
          )}

          {/* Coordinates tracker pill on hover */}
          {hoveredCoords && (
            <g id="crosshairs-interactive-overlay">
              <line 
                x1={hoveredCoords.x} 
                y1={paddingTop} 
                x2={hoveredCoords.x} 
                y2={paddingTop + chartHeight} 
                stroke="#475569" 
                strokeWidth="0.8" 
                strokeDasharray="3 3"
                strokeOpacity="0.6"
              />
              <line 
                x1={paddingLeft} 
                y1={hoveredCoords.y} 
                x2={paddingLeft + chartWidth + 6} 
                y2={hoveredCoords.y} 
                stroke="#475569" 
                strokeWidth="0.8" 
                strokeDasharray="3 3"
                strokeOpacity="0.6"
              />

              <rect 
                x={paddingLeft + chartWidth + 3} 
                y={hoveredCoords.y - 10} 
                width="78" 
                height="20" 
                rx="5" 
                fill="#1e293b" 
                stroke="#475569"
                strokeWidth="1"
              />
              <text 
                x={paddingLeft + chartWidth + 42} 
                y={hoveredCoords.y + 4} 
                fill="#cbd5e1" 
                fontSize="9.5" 
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                {hoveredCoords.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
              </text>
            </g>
          )}

          {/* 3. RSI OSCILLATOR PANEL SUBGRID: Render Relative Strength Index as an independent graph bottom layer */}
          {showRSI && (
            <g id="rsi-oscillator-sub-render-group">
              {/* Backing track grid layout */}
              <rect 
                x={paddingLeft} 
                y={rsiPanelY} 
                width={chartWidth} 
                height={rsiPanelHeight} 
                fill="url(#rsi-purple-glow)" 
                stroke="#121822" 
                strokeWidth="1"
                rx="6"
              />

              {/* Boundary markers lines (70 overbought, 30 oversold guide) */}
              <line 
                x1={paddingLeft} 
                y1={getRSI_Y(70)} 
                x2={paddingLeft + chartWidth} 
                y2={getRSI_Y(70)} 
                stroke="#6366f1" 
                strokeWidth="0.75" 
                strokeDasharray="3 3" 
                strokeOpacity="0.4"
              />
              <line 
                x1={paddingLeft} 
                y1={getRSI_Y(30)} 
                x2={paddingLeft + chartWidth} 
                y2={getRSI_Y(30)} 
                stroke="#6366f1" 
                strokeWidth="0.75" 
                strokeDasharray="3 3" 
                strokeOpacity="0.4"
              />

              {/* Horizontal 50 Neutral midpoint guide */}
              <line 
                x1={paddingLeft} 
                y1={getRSI_Y(50)} 
                x2={paddingLeft + chartWidth} 
                y2={getRSI_Y(50)} 
                stroke="#334155" 
                strokeWidth="0.5" 
                strokeDasharray="5 5" 
              />

              {/* Text boundary references */}
              <text x={paddingLeft + chartWidth + 6} y={getRSI_Y(70) + 3} fill="#818cf8" fontSize="8" fontFamily="monospace">70</text>
              <text x={paddingLeft + chartWidth + 6} y={getRSI_Y(50) + 3} fill="#475569" fontSize="8" fontFamily="monospace">50</text>
              <text x={paddingLeft + chartWidth + 6} y={getRSI_Y(30) + 3} fill="#818cf8" fontSize="8" fontFamily="monospace">30</text>
              
              <text x={paddingLeft + 10} y={rsiPanelY + 12} fill="#818cf8" fontSize="8" fontFamily="sans-serif" fontWeight="bold" opacity="0.6">RSI (14)</text>

              {/* RSI Oscillator dynamic line rendering */}
              {rsiValues.length > 0 && (
                <path 
                  d={`M ${visiblePrices.map((_, idx) => `${getX(idx)},${getRSI_Y(rsiValues[idx] || 50)}`).join(' L ')}`} 
                  fill="none" 
                  stroke="#a78bfa" 
                  strokeWidth="1.6" 
                  strokeLinecap="round"
                  id="rsi-graph"
                />
              )}

              {/* Current RSI value indicator dot indicator */}
              {rsiValues.length > 0 && (
                <g>
                  <circle 
                    cx={paddingLeft + chartWidth} 
                    cy={getRSI_Y(rsiValues[rsiValues.length - 1] || 50)} 
                    r="3.5" 
                    fill="#a78bfa" 
                  />
                  <rect 
                    x={paddingLeft + chartWidth + 24} 
                    y={getRSI_Y(rsiValues[rsiValues.length - 1] || 50) - 7} 
                    width="26" 
                    height="14" 
                    rx="3" 
                    fill="#312e81" 
                  />
                  <text 
                    x={paddingLeft + chartWidth + 37} 
                    y={getRSI_Y(rsiValues[rsiValues.length - 1] || 50) + 3} 
                    fill="#c084fc" 
                    fontSize="8" 
                    fontFamily="monospace"
                    textAnchor="middle"
                    fontWeight="black"
                  >
                    {Math.round(rsiValues[rsiValues.length - 1] || 50)}
                  </text>
                </g>
              )}
            </g>
          )}
        </svg>



      </div>

      {/* Dynamic and Compact Time Frame Bottom Control Bar */}
      {isMarketLiveMode && (
        <div id="timeframe-control-bar" className="bg-[#05070a] border-t border-white/5 px-3 py-1.5 md:px-5 md:py-2.5 flex items-center justify-between gap-3 select-none relative">
          <div className="flex items-center gap-1.5 md:gap-2 relative">
            <button
              id="timeframe-select-trigger"
              onClick={() => setShowTimeframeSelector(!showTimeframeSelector)}
              className="bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-[10px] md:text-xs font-mono font-bold text-slate-300 py-1 px-2 md:py-1.5 md:px-3 rounded-lg flex items-center gap-1 md:gap-2 cursor-pointer transition-all outline-none"
              title="Select timeframe candle interval"
            >
              <Clock size={10} className="text-blue-400 md:w-3 md:h-3" />
              <span>Time frame: <strong className="text-white font-extrabold">{timeframe}</strong></span>
              <ChevronDown size={10} className={`text-slate-400 transition-transform md:w-3 md:h-3 ${showTimeframeSelector ? 'rotate-180' : ''}`} />
            </button>

            {/* Timeframe selector popover overlay */}
            {showTimeframeSelector && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowTimeframeSelector(false)} 
                />
                <div className="absolute bottom-[115%] left-0 bg-[#0d121c]/95 border border-white/10 p-2.5 rounded-xl shadow-2xl z-40 w-[240px] animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="text-[10px] font-sans font-bold text-slate-400 mb-2 px-1 uppercase tracking-widest">Select Candle Interval</div>
                  <div className="grid grid-cols-4 gap-1">
                    {['15s', '30s', '45s', '1min', '5min', '15min', '30min', '1h', '2h', '3h'].map((tf) => (
                      <button
                        key={tf}
                        onClick={() => {
                          setTimeframe(tf);
                          setScrollOffset(0); // reset scroll offset to see current candles segment
                          setShowTimeframeSelector(false); // close popup
                        }}
                        className={`py-1 text-[11px] font-mono font-bold rounded transition-all cursor-pointer ${
                          timeframe === tf
                            ? 'bg-blue-600 font-extrabold text-white shadow shadow-blue-500/20'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[9px] font-mono text-slate-500">
            <span className="w-1 h-1 rounded-full bg-slate-500"></span>
            <span>Drag / Swipe chart to pan history</span>
          </div>
        </div>
      )}
    </div>
  );
}
