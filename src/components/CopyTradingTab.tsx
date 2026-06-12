/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, 
  Percent, 
  Coins, 
  TrendingUp, 
  ShieldCheck, 
  Flame, 
  AlertCircle,
  Copy,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { TopTrader } from '../types';

interface CopyTradingTabProps {
  topTraders: TopTrader[];
  onToggleCopy: (rank: number) => void;
}

export default function CopyTradingTab({ topTraders, onToggleCopy }: CopyTradingTabProps) {
  return (
    <div id="copy-trading-root" className="w-full flex flex-col gap-5 animate-fade-in select-none">
      
      {/* Banner introduction with metric cards */}
      <div id="copy-banner-deck" className="bg-[#0e1216] border border-[#1a222a] rounded-2xl p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left header text */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-amber-400/20 text-amber-400 font-mono font-black py-0.5 px-2 rounded-full uppercase">POCKET COPY®</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <h2 className="font-sans font-black text-lg md:text-2xl text-white tracking-tight lead-none">Copy Professional Masters in Real-Time</h2>
          <p className="font-sans text-xs md:text-sm text-gray-400 leading-relaxed max-w-lg">
            Don't trade alone. Connect with high-performance, battle-tested options traders and automatically replicate their exact market positions inside your ledger. Perfect for learning scalping strategies.
          </p>
          <div className="flex items-center gap-1.5 text-amber-500 font-mono text-[11px] font-semibold">
            <ShieldCheck size={14} className="text-amber-500 fill-amber-500/10" />
            Automatic Risk Hedging limits copy volumes to a maximum of 15% wallet size.
          </div>
        </div>

        {/* Right side stats blocks */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          <div className="bg-[#151c22]/60 border border-[#232e3a] rounded-2xl p-4 flex flex-col gap-2">
            <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Top Trader Win rate</span>
            <span className="font-mono text-xl font-bold text-emerald-400 flex items-center">
              88.4%
              <Flame size={15} className="text-[#f43f5e] fill-[#f43f5e] ml-1.5 animate-pulse" />
            </span>
            <span className="text-[10px] text-gray-400">Validated on 1,400+ ticks</span>
          </div>

          <div className="bg-[#151c22]/60 border border-[#232e3a] rounded-2xl p-4 flex flex-col gap-2">
            <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Total Copiers Online</span>
            <span className="font-mono text-xl font-bold text-amber-400">12,482</span>
            <span className="text-[10px] text-gray-400">Active simulated lanes</span>
          </div>
        </div>

      </div>

      {/* Main Leaderboard of master traders */}
      <div id="leaderboard-deck" className="bg-[#0e1216] border border-[#1a222a] rounded-2xl overflow-hidden flex flex-col">
        {/* Table/block header */}
        <div className="px-5 py-3.5 bg-[#0a0d10] border-b border-[#1a222a] flex items-center justify-between text-xs text-gray-500 font-sans">
          <span className="font-bold">PRO LEADERBOARD OF THE WEEK</span>
          <span className="font-mono text-[10px] text-[#eab308] uppercase">UPDATES LIVE TILL UTC FRIDAY</span>
        </div>

        {/* List of accounts */}
        <div id="copytraders-grid" className="flex flex-col divide-y divide-[#1b252e]">
          {topTraders.map((trader) => {
            return (
              <div 
                key={trader.rank} 
                id={`trader-card-${trader.rank}`}
                className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#11161d]/40 transition-colors group"
              >
                {/* Left block - Rank, avatar details */}
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <span className={`w-6 text-center font-mono text-xs font-black italic select-none ${
                    trader.rank === 1 ? 'text-amber-500 text-sm' : trader.rank === 2 ? 'text-slate-300' : 'text-amber-700'
                  }`}>
                    #{trader.rank}
                  </span>

                  {/* Avatar wrapper */}
                  <div className="relative">
                    <img 
                      src={trader.avatarUrl} 
                      alt={trader.name} 
                      onError={(e) => {
                        // fallback placeholder if unsplash fails
                        e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${trader.name}`;
                      }}
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#1f2a36] group-hover:border-amber-400/40 transition-colors"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -bottom-1 -right-1 px-1 py-0.5 rounded text-[8px] bg-slate-900 border border-[#1f2a37] font-bold text-white font-mono uppercase">
                      {trader.country}
                    </span>
                  </div>

                  {/* User descriptions block */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-sans font-bold text-gray-200 group-hover:text-white transition-colors">{trader.name}</span>
                    <span className="text-[10px] font-mono text-amber-500/85 italic leading-none">{trader.statusText || 'Top scalper options trader.'}</span>
                  </div>
                </div>

                {/* Middle details - transactions performance */}
                <div className="grid grid-cols-3 gap-6 shrink-0 md:text-right">
                  <div className="flex flex-col items-start md:items-end gap-1 select-none">
                    <span className="text-[8px] text-gray-500 font-mono uppercase leading-none">Total Positions</span>
                    <span className="font-mono text-xs text-[#f1f5f9] font-bold mt-1">{trader.totalTrades}</span>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-1 select-none">
                    <span className="text-[8px] text-gray-500 font-mono uppercase leading-none">Win rate</span>
                    <span className="font-mono text-xs text-[#10b981] font-bold mt-1.5 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {trader.winRate}%
                    </span>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-1 select-none">
                    <span className="text-[8px] text-gray-500 font-mono uppercase leading-none">Total Profit</span>
                    <span className="font-mono text-xs text-amber-400 font-bold mt-1">
                      +K${trader.profit.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Action Trigger - Copied toggle button */}
                <div className="shrink-0 flex items-center md:justify-end">
                  <button
                    id={`copy-btn-trader-${trader.rank}`}
                    onClick={() => onToggleCopy(trader.rank)}
                    className={`px-4 py-2.5 rounded-xl font-sans font-bold text-xs cursor-pointer transition-all flex items-center gap-1.5 ${
                      trader.isCopied 
                        ? 'bg-emerald-500 text-[#0b0e11] hover:bg-emerald-400 shadow shadow-emerald-500/10 scale-[1.01]' 
                        : 'bg-amber-400 hover:bg-amber-300 text-black shadow shadow-amber-400/10'
                    }`}
                  >
                    {trader.isCopied ? (
                      <>
                        <CheckCircle2 size={13} className="stroke-[2.5]" />
                        Active Replicating
                      </>
                    ) : (
                      <>
                        <Zap size={13} className="fill-current" />
                        Copy Trades
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
