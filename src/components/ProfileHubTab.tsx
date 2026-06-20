/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Zap, 
  Wallet, 
  TrendingUp, 
  Award, 
  RefreshCw, 
  CheckCircle2, 
  Lock, 
  ChevronRight, 
  FileText,
  BadgeAlert,
  Loader2,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ReferenceLine 
} from 'recharts';
import { Trade } from '../types';
import { TrendingDown } from 'lucide-react';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isProfit = data.profit >= 0;
    return (
      <div className="bg-[#0a0e17]/95 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md select-none text-left">
        <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
          {data.day === 'Today' ? "Today's Performance" : `${data.day} Summary`}
        </p>
        <p className={`text-sm font-sans font-black mt-1 leading-none ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isProfit ? '▲ +' : '▼ '}${Math.abs(data.profit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

function Sparkline({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;
  const svgWidth = 72;
  const svgHeight = 24;
  const pointsString = data.map((val, index) => {
    const x = (index / (data.length - 1 || 1)) * svgWidth;
    const y = svgHeight - 2 - ((val - minVal) / range) * (svgHeight - 4);
    return `${x},${y}`;
  }).join(' ');

  const isPositive = data[data.length - 1] >= 0;
  const strokeColor = isPositive ? '#10b981' : '#f43f5e';
  const fillColor = isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)';
  const areaPoints = `0,${svgHeight} ${pointsString} ${svgWidth},${svgHeight}`;

  return (
    <svg width={svgWidth} height={svgHeight} className="overflow-visible" style={{ minWidth: `${svgWidth}px` }}>
      <polygon points={areaPoints} fill={fillColor} />
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pointsString}
      />
      <circle
        cx={svgWidth}
        cy={svgHeight - 2 - ((data[data.length - 1] - minVal) / range) * (svgHeight - 4)}
        r="2"
        fill="#ffffff"
        stroke={strokeColor}
        strokeWidth="1"
      />
    </svg>
  );
}

interface ProfileHubTabProps {
  userProfile: {
    name: string;
    email: string;
    phone: string;
    id: string;
    status: 'Standard' | 'Gold' | 'VIP';
  };
  isDemo: boolean;
  setIsDemo: (val: boolean) => void;
  demoBalance: number;
  realBalance: number;
  onTopUpDemo: () => void;
  onUpdateProfile: (data: { name: string; phone: string }) => void;
  onLogout: () => void;
  setActiveTab: (tab: string) => void;
  closedTrades?: Trade[];
}

export default function ProfileHubTab({
  userProfile,
  isDemo,
  setIsDemo,
  demoBalance,
  realBalance,
  onTopUpDemo,
  onUpdateProfile,
  onLogout,
  setActiveTab,
  closedTrades = []
}: ProfileHubTabProps) {
  // Local state for editing details
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile.name,
    phone: userProfile.phone || '+254 748 480904'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 2FA state toggle
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionNotifications, setSessionNotifications] = useState(true);

  // Demo top up trigger
  const [isToppingUp, setIsToppingUp] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    
    // Simulate API delay
    setTimeout(() => {
      onUpdateProfile(formData);
      setIsSaving(false);
      setIsEditing(false);
      setSuccessMessage('Profile details successfully updated and saved!');
      setTimeout(() => setSuccessMessage(''), 4000);
    }, 1200);
  };

  const handleDemoTopUp = () => {
    setIsToppingUp(true);
    setTimeout(() => {
      onTopUpDemo();
      setIsToppingUp(false);
    }, 1000);
  };

  // 7-day dynamic profit and loss analytics calculation
  const past6DaysBase = isDemo 
    ? [
        { day: '6d ago', profit: 240.00 },
        { day: '5d ago', profit: -120.00 },
        { day: '4d ago', profit: 380.00 },
        { day: '3d ago', profit: 150.00 },
        { day: '2d ago', profit: -90.00 },
        { day: 'Yesterday', profit: 410.00 }
      ]
    : [
        { day: '6d ago', profit: 45.00 },
        { day: '5d ago', profit: -20.00 },
        { day: '4d ago', profit: 110.00 },
        { day: '3d ago', profit: 60.00 },
        { day: '2d ago', profit: -15.00 },
        { day: 'Yesterday', profit: 135.00 }
      ];

  const todaySessionNet = closedTrades
    .filter(trade => trade.isDemo === isDemo)
    .reduce((sum, trade) => {
      const p = trade.status === 'won' 
        ? (trade.potentialPayout - trade.amount) 
        : -trade.amount;
      return sum + p;
    }, 0);

  const todayBase = isDemo ? 180.00 : 50.00;
  const todayTotalProfitLoss = todayBase + todaySessionNet;

  const chartData = [
    ...past6DaysBase,
    { day: 'Today', profit: Number(todayTotalProfitLoss.toFixed(2)) }
  ];

  const total7DayProfit = chartData.reduce((sum, d) => sum + d.profit, 0);
  const bestDay = [...chartData].sort((a, b) => b.profit - a.profit)[0];
  const worstDay = [...chartData].sort((a, b) => a.profit - b.profit)[0];
  const positiveDays = chartData.filter(d => d.profit > 0).length;
  const successRate = ((positiveDays / 7) * 100).toFixed(0);

  const tradingStats = [
    { label: 'Registered Trader Level', value: userProfile.status, icon: Zap, color: 'text-amber-400 bg-amber-500/10' },
    { label: 'Simulated Win Rate', value: '64.8%', icon: TrendingUp, color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Overall Volatility Index', value: 'High Yield', icon: Award, color: 'text-cyan-400 bg-cyan-500/10' },
    { label: 'Total Placed Positions', value: '1,420 Trades', icon: FileText, color: 'text-indigo-400 bg-indigo-500/10' },
  ];

  const verificationSteps = [
    { title: 'Email Address Verified', desc: userProfile.email, done: true },
    { title: 'Registered Mobile Phone', desc: userProfile.phone || 'Verified via mobile OTP code', done: true },
    { title: 'Legal Identity Documents', desc: 'Verify identity state - Approved ✓', done: true },
    { title: 'Proof of Address Checked', desc: 'Digital utility match - VIP Verified ✓', done: true },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="max-w-5xl mx-auto w-full px-1 py-4 sm:p-6 text-slate-100 font-sans flex flex-col gap-6"
    >
      {/* 1. TOP STATS GLANCE / PROFILE HEADER */}
      <div className="bg-[#0c101b]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-xl shadow-blue-600/20 outline outline-4 outline-white/5 select-none shrink-0">
              {userProfile.name[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none truncate max-w-[200px] xs:max-w-xs">{userProfile.name}</h1>
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-[#10b981] text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 select-none whitespace-nowrap">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span>Verified Client</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 select-all font-mono leading-none">{userProfile.email}</p>
              <div className="flex items-center gap-4 mt-2 sm:mt-3 text-[11px] font-mono text-slate-400">
                <span>ID: <strong className="text-slate-200">{userProfile.id || '176866819'}</strong></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <Zap size={11} className="fill-cyan-400 text-cyan-400" />
                  {userProfile.status} Tier
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col shrink-0 w-full md:w-auto gap-2 bg-white/5 border border-white/5 md:bg-transparent md:border-none p-3 md:p-0 rounded-2xl">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold leading-none md:text-right">Global Registry</span>
            <div className="flex items-center gap-2 mt-1 justify-between md:justify-end">
              <span className="text-xs text-slate-350">Status code:</span>
              <span className="text-xs font-black font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 border border-blue-500/10 rounded">POCKET_OK_17686_A</span>
            </div>
            <p className="text-[11px] text-slate-400 md:text-right mt-1">Global compliance verified. Full trading clearance active.</p>
          </div>
        </div>
      </div>

      {/* 2. DUAL BALANCES & MODE CHOOSE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* DEMO CARD */}
        <div
          onClick={() => setIsDemo(true)}
          className={`flex-1 text-left rounded-3xl p-5 border transition-all duration-300 relative overflow-hidden group select-none cursor-pointer ${
            isDemo 
              ? 'bg-gradient-to-br from-amber-600/15 to-transparent border-amber-500/40 shadow-[0_10px_25px_rgba(245,158,11,0.06)]' 
              : 'bg-[#0a0d15]/50 border-white/5 hover:border-slate-800'
          }`}
        >
          <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${isDemo ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'}`}></div>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-md ${
              isDemo ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
            }`}>
              DEMO-BALANCE ACCOUNT
            </span>
            <span className="text-[10px] font-mono text-slate-500">100% Risk Free</span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-mono font-black text-white">${demoBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-xs font-mono text-slate-400">USD</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Interactive play-money testing suite with zero limitations.</p>
          
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/5">
            <span className={`text-[11px] font-sans font-bold flex items-center gap-1 ${isDemo ? 'text-amber-400' : 'text-slate-400'}`}>
              {isDemo ? '✓ Currently Active Account' : 'Click to activate Demo Mode'}
            </span>
            
            {isDemo && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDemoTopUp();
                }}
                disabled={isToppingUp}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1 rounded-lg text-xs font-sans font-black flex items-center gap-1 cursor-pointer transition-all active:scale-95 z-10 shadow-lg shadow-amber-500/10"
              >
                {isToppingUp ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Topping...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={12} />
                    <span>Top-up $1,000</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* REAL MONEY CARD */}
        <div
          onClick={() => setIsDemo(false)}
          className={`flex-1 text-left rounded-3xl p-5 border transition-all duration-300 relative overflow-hidden group select-none cursor-pointer ${
            !isDemo 
              ? 'bg-gradient-to-br from-emerald-600/15 to-transparent border-emerald-500/40 shadow-[0_10px_25px_rgba(16,185,129,0.06)]' 
              : 'bg-[#0a0d15]/50 border-white/5 hover:border-slate-800'
          }`}
        >
          <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${!isDemo ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`}></div>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-md ${
              !isDemo ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
            }`}>
              REAL-BALANCE ACCOUNT
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">🚀 Live Market Trade</span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-mono font-black text-white">${realBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-xs font-mono text-slate-400">USD</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Trade your cash balances directly against full live interbank rates.</p>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/5">
            <span className={`text-[11px] font-sans font-bold flex items-center gap-1 ${!isDemo ? 'text-emerald-400' : 'text-slate-400'}`}>
              {!isDemo ? '✓ Currently Active Account' : 'Click to activate Real Mode'}
            </span>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('cashier');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-sans font-black flex items-center gap-1 cursor-pointer transition-all active:scale-95 ${
                !isDemo ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-350 hover:bg-slate-700'
              }`}
            >
              <Wallet size={12} />
              <span>Fund Cashier</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. CORE PROFILE DATA & VERIFICATION TIMELINE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Editable Profile Settings Card */}
        <div className="lg:col-span-2 bg-[#0c101b]/60 border border-white/5 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <User size={14} className="text-blue-400" />
                </div>
                <h3 className="text-sm font-sans font-bold text-white tracking-tight uppercase">Personal Client profile</h3>
              </div>
              
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold font-sans flex items-center gap-0.5 cursor-pointer bg-transparent border-none py-1 px-2 hover:bg-white/5 rounded-lg transition-all"
                >
                  Edit profile
                </button>
              )}
            </div>

            {successMessage && (
              <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-[#10b981] text-xs font-sans p-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 align-left text-left">
                    <label htmlFor="edit-name" className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Full Name</label>
                    <input
                      id="edit-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all placeholder-slate-500"
                      placeholder="e.g. Francis Kamau"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 align-left text-left">
                    <label htmlFor="edit-phone" className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Mobile Mobile</label>
                    <input
                      id="edit-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all placeholder-slate-500"
                      placeholder="e.g. +254 748 480904"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 align-left text-left">
                  <label htmlFor="edit-email" className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Primary Registered Email</label>
                  <div className="relative">
                    <input
                      id="edit-email"
                      type="email"
                      disabled
                      value={userProfile.email}
                      className="w-full bg-white/2 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed select-text outline-none"
                    />
                    <span className="absolute right-3 top-2 flex items-center gap-1.5 text-[10px] font-bold font-sans text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/10 rounded">
                      <Check size={10} /> Saved & Secure
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">Email addresses are tied permanently to global transaction profiles. Contact compliance to change.</p>
                </div>

                <div className="flex items-center gap-2 pt-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-sans font-black flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/15"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Applying changes...</span>
                      </>
                    ) : (
                      <>
                        <Check size={13} />
                        <span>Save Profile Data</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ name: userProfile.name, phone: userProfile.phone });
                      setIsEditing(false);
                    }}
                    className="bg-transparent hover:bg-white/5 text-slate-400 hover:text-white px-4 py-2 rounded-xl text-xs font-sans font-bold cursor-pointer transition-all border border-transparent"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/40 border border-white/2 p-3.5 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">Full Name</span>
                  <span className="text-sm font-sans font-bold text-white leading-none">{userProfile.name}</span>
                </div>
                <div className="bg-slate-950/40 border border-white/2 p-3.5 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">Mobile Number</span>
                  <span className="text-sm font-sans font-bold text-white leading-none">{userProfile.phone || '+254 748 480904'}</span>
                </div>
                <div className="bg-slate-950/40 border border-white/2 p-3.5 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">Verified Email</span>
                  <span className="text-sm font-sans font-bold text-white truncate leading-none">{userProfile.email}</span>
                </div>
                <div className="bg-slate-950/40 border border-white/2 p-3.5 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">Registration Date</span>
                  <span className="text-sm font-sans font-bold text-white leading-none">Sept 14, 2024 (Active)</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-slate-400">Account session is encrypted with SHA-256 standard protocols.</span>
            </div>
            
            {userProfile.email === 'guest_trader@pocketoption.com' ? (
              <button
                type="button"
                onClick={onLogout}
                className="text-xs text-blue-400 hover:text-blue-300 font-black font-sans px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-sm cursor-pointer hover:bg-blue-500/15 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0 self-end sm:self-auto"
              >
                <span>Sign in for real account</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onLogout}
                className="text-xs text-red-400 hover:text-red-300 font-black font-sans px-3.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 shadow-sm cursor-pointer hover:bg-red-500/15 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0 self-end sm:self-auto"
              >
                <span>Log out of platform</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Security Controls & Verification */}
        <div className="space-y-4">
          {/* Identity & Compliance Checklist */}
          <div className="bg-[#0c101b]/60 border border-white/5 rounded-3xl p-5 shadow-xl">
            <h3 className="text-xs font-sans font-bold text-slate-300 tracking-tight uppercase mb-4 flex items-center gap-2">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Identity KYC Audit</span>
            </h3>

            <div className="space-y-3.5">
              {verificationSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mt-0.5 shrink-0 border border-emerald-500/20 scale-95 shadow">
                    <Check size={11} className="stroke-[3]" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 leading-snug">{step.title}</h4>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secure 2FA toggles */}
          <div className="bg-[#0c101b]/60 border border-white/5 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-sans font-bold text-slate-300 tracking-tight uppercase flex items-center gap-2">
              <Lock size={13} className="text-blue-400" />
              <span>Device & Security settings</span>
            </h3>

            {/* Toggle 1 */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col justify-start align-left text-left">
                <h4 className="text-xs font-semibold text-white">Two-Factor Auth (2FA)</h4>
                <p className="text-[10px] text-slate-450 leading-normal mt-0.5">Prompt OTP verification on high volume transactions.</p>
              </div>
              <div
                className="w-10 h-5.5 rounded-full flex items-center px-0.5 bg-blue-600 justify-end select-none cursor-default"
                title="Security forced active for account protection"
              >
                <div className="w-4 h-4 rounded-full bg-white shadow"></div>
              </div>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/5">
              <div className="flex flex-col justify-start align-left text-left">
                <h4 className="text-xs font-semibold text-white">Session logs & logins</h4>
                <p className="text-[10px] text-slate-450 leading-normal mt-0.5">Email notification alerts upon platform login sessions.</p>
              </div>
              <div
                className="w-10 h-5.5 rounded-full flex items-center px-0.5 bg-blue-600 justify-end select-none cursor-default"
                title="Log monitoring is locked on for security audits"
              >
                <div className="w-4 h-4 rounded-full bg-white shadow"></div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3.5 7-DAY PROFIT & LOSS PERFORMANCE HUB */}
      <div className="bg-[#0c101b]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[85px] pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 z-10 relative">
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 font-bold">Trading Metrics</span>
            <h2 className="text-lg font-black text-white tracking-tight mt-1">7-Day Profit & Loss Ledger</h2>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 border border-white/5 px-4 py-2.5 rounded-2xl self-start sm:self-auto shadow-inner">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${total7DayProfit >= 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-pulse'}`}></div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-slate-450 uppercase leading-none font-bold">7d Net Performance</span>
                <span className={`text-sm font-sans font-black mt-1 leading-none ${total7DayProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {total7DayProfit >= 0 ? '+' : ''}${total7DayProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="border-l border-white/10 pl-3 flex items-center justify-center" title="Last 7 Days trend sparkline">
              <Sparkline data={chartData.map(d => d.profit)} />
            </div>
          </div>
        </div>

        {/* Dynamic Metric Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl flex flex-col items-start text-left">
            <span className="text-[9px] text-[#94a3b8] tracking-wider uppercase font-bold">Profitable Days</span>
            <span className="text-sm font-mono font-black text-white mt-1.5 flex items-center gap-1.5 leading-none">
              <TrendingUp size={14} className="text-emerald-400 animate-pulse" />
              {positiveDays} / 7 <span className="text-[10px] text-[#10b981] font-bold">({successRate}%)</span>
            </span>
          </div>

          <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl flex flex-col items-start text-left">
            <span className="text-[9px] text-[#94a3b8] tracking-wider uppercase font-bold">Peak Target Day</span>
            <span className="text-sm font-sans font-black text-emerald-400 mt-1.5 flex items-center gap-1.5 leading-none">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              +${bestDay.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>

          <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl flex flex-col items-start text-left">
            <span className="text-[9px] text-[#94a3b8] tracking-wider uppercase font-bold">Lowest Dip Day</span>
            <span className="text-sm font-sans font-black text-rose-450 mt-1.5 flex items-center gap-1.5 leading-none">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
              {worstDay.profit >= 0 ? '+' : ''}${worstDay.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* Real Recharts Line Chart Container */}
        <div className="w-full h-[245px] mt-2 select-none" id="PL-line-chart-stage">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={chartData} margin={{ top: 12, right: 10, left: -22, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                dy={6}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => `${val >= 0 ? '+$' : '-$'}${Math.abs(val)}`}
              />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f633', strokeWidth: 1.5 }} />
              <ReferenceLine y={0} stroke="#ffffff25" strokeDasharray="4 4" strokeWidth={1} />
              
              {/* Line definition */}
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="url(#chartLineGradient)" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#0c101b', strokeWidth: 2, stroke: '#3b82f6' }}
                activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' }}
              />

              {/* Color Gradient definitions */}
              <defs>
                <linearGradient id="chartLineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. PERFORMANCE BENTO ROW */}
      <div className="bg-[#070b13] border border-white/5 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <h3 className="text-xs font-sans font-bold text-slate-400 tracking-wider uppercase mb-4">Core account parameters & Analytics</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {tradingStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white/2 border border-white/2 p-4 rounded-2xl flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center shrink-0`}>
                  <Icon size={16} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] text-slate-450 tracking-wide uppercase leading-none">{stat.label}</span>
                  <span className="text-sm font-sans font-black text-white mt-1.5 leading-none">{stat.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
