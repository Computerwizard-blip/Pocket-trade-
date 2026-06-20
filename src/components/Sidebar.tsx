/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  BookOpen, 
  Trophy, 
  Wallet, 
  HelpCircle,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: {
    name: string;
    status: 'Standard' | 'Gold' | 'VIP';
    isDemo: boolean;
    id?: string;
  };
}

export default function Sidebar({ activeTab, setActiveTab, userProfile }: SidebarProps) {
  const navItems = [
    { id: 'trades', label: 'Trades', icon: TrendingUp, badge: 'Active' },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'copy', label: 'Copy Traders', icon: Users, highlight: true },
    { id: 'strategies', label: 'Strategies', icon: BookOpen },
    { id: 'leaderboard', label: 'Top-20', icon: Trophy },
    { id: 'cashier', label: 'Cashier', icon: Wallet },
    { id: 'support', label: 'Support Chat', icon: HelpCircle },
  ];

  return (
    <aside id="sidebar-container" className="hidden md:flex w-[240px] bg-slate-900/40 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between shrink-0 select-none z-10 transition-all duration-300 shadow-2xl">
      {/* Top Section - Brand logo and Account Status */}
      <div id="sidebar-top" className="flex flex-col">
        {/* Logo */}
        <div id="brand-logo-container" className="h-[64px] border-b border-white/5 flex items-center px-4 gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
            {/* Double overlapping gradient circles */}
            <div className="absolute -left-0.5 w-5 h-5 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 opacity-90 blur-[0.2px]"></div>
            <div className="absolute -right-0.5 w-5 h-5 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-400 mix-blend-screen opacity-90 blur-[0.2px]"></div>
          </div>
          <div id="brand-name-text" className="hidden md:flex flex-col">
            <span id="brand-title" className="font-sans font-black text-white tracking-tight text-sm leading-none flex items-center gap-1">
              PocketOption
            </span>
            <span id="brand-subtitle" className="font-mono text-[9px] text-slate-400 tracking-wider uppercase mt-1">Lobby Suite</span>
          </div>
        </div>

        {/* User Card */}
        <div id="sidebar-user-card" className="p-3 border-b border-white/5 hidden md:block">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className="w-full text-left bg-transparent border-none p-0 outline-none cursor-pointer focus:outline-none block"
            title="Open Account Profile & Security Hub"
          >
            <div id="sidebar-user" className={`border rounded-xl p-3 flex flex-col gap-2 relative overflow-hidden group transition-all duration-300 ${
              activeTab === 'profile' 
                ? 'bg-blue-600/15 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
            }`}>
              {/* Ambient Background decoration */}
              <div id="bg-glow" className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all duration-500"></div>
              
              <div id="user-info-row" className="flex items-center gap-2.5">
                <div id="avatar-circle" className="w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center font-sans font-bold text-white text-sm shrink-0">
                  {userProfile.name[0]?.toUpperCase() || 'U'}
                </div>
                <div id="user-name-col" className="flex flex-col overflow-hidden">
                  <span id="user-display-name" className="text-xs font-semibold text-slate-200 truncate">{userProfile.name}</span>
                  <span id="account-tier-text" className="text-[10px] text-slate-400 font-mono tracking-wide">ID: {userProfile.id || '176866819'}</span>
                </div>
              </div>

              <div id="badge-row" className="flex items-center justify-between mt-1">
                <span id="demo-indicator" className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase ${
                  userProfile.isDemo ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {userProfile.isDemo ? 'DEMO-BALANCE' : 'REAL-BALANCE'}
                </span>
                <span id="tier-indicator" className="text-[10px] font-mono font-medium flex items-center gap-1 text-cyan-400">
                  <Zap size={10} className="fill-cyan-400 text-cyan-400" />
                  {userProfile.status}
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Navigation Items */}
        <nav id="sidebar-nav" className="flex flex-col gap-1 p-2 mt-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-center md:justify-start px-3 py-2.5 md:py-3 rounded-xl transition-all duration-250 group relative gap-3.5 leading-none ${
                  isActive 
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/15 font-semibold' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Active left bar indicator */}
                {isActive && (
                  <span id="active-marker" className="absolute left-0 top-1/4 bottom-1/4 w-1.5 rounded-r bg-blue-400"></span>
                )}

                <IconComponent 
                  size={18} 
                  className={`shrink-0 transition-transform ${
                    isActive ? 'text-blue-400 animate-pulse' : 'text-slate-400 group-hover:text-blue-400 group-hover:scale-105'
                  }`} 
                />

                <span id={`nav-text-${item.id}`} className="hidden md:inline font-sans text-xs tracking-medium font-medium">
                  {item.label}
                </span>

                {/* Optional highlight dots or badges */}
                {item.highlight && (
                  <span id="nav-highlight" className="absolute top-2 right-2 md:right-3 w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                )}

                {item.id === 'trades' && (
                  <span id="nav-trade-badge" className="hidden md:inline-flex items-center justify-center text-[9px] font-semibold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full ml-auto font-mono">
                    LIVE
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Dynamic Promotion Area or Quick Tips */}
      <div id="promo-banner-sidebar" className="p-3 hidden md:block select-none">
        <div id="promo-card" className="bg-gradient-to-br from-blue-950/40 to-slate-900/60 rounded-2xl p-4 border border-blue-500/15 relative overflow-hidden flex flex-col gap-2">
          <div id="promo-star-decor" className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-500/5 rounded-full blur-lg"></div>
          <span id="promo-header" className="text-cyan-400 font-mono text-[10px] font-bold tracking-widest uppercase">UPGRADE PROMO</span>
          <h4 id="promo-title" className="text-xs font-semibold text-white leading-snug">Get Gold Status at K$3,000</h4>
          <p id="promo-desc" className="text-[11px] text-slate-400 leading-normal mb-1">Increase asset profitability up to 88% and unlock instant strategy feeds.</p>
          <button 
            id="promo-action-btn"
            onClick={() => setActiveTab('cashier')}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-sans font-bold text-[11px] flex items-center justify-center gap-1.5 group transition-all cursor-pointer shadow-lg shadow-blue-600/10"
          >
            Upgrade Now
            <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
