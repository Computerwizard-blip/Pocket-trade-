/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  Smartphone, 
  Tablet as TabletIcon, 
  Laptop as LaptopIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Zap, 
  Users, 
  Activity, 
  TrendingUp, 
  ShieldCheck,
  RefreshCw,
  TrendingUpDown,
  User
} from 'lucide-react';

interface LandingPageProps {
  onLogin: (email: string, isDemo: boolean, balances?: { demo: number; real: number }) => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  // Authentication states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formMode, setFormMode] = useState<'signin' | 'signup'>('signin');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Showcase interactive device states
  const [selectedDevice, setSelectedDevice] = useState<'laptop' | 'tablet' | 'phone'>('laptop');
  const [onlineTraders, setOnlineTraders] = useState<number>(24312);
  const [simulatedPrices, setSimulatedPrices] = useState<number[]>(
    Array.from({ length: 20 }, (_, i) => 640 + Math.sin(i / 1.5) * 5 + Math.random() * 3)
  );

  // Fluctuating online user count realities
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineTraders(prev => {
        const change = Math.floor(Math.random() * 91) - 45; // -45 to +45 range
        const next = prev + change;
        return Math.min(27600, Math.max(23000, next));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Tick the simulated demo chart on the mockups in building
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedPrices(prev => {
        const last = prev[prev.length - 1];
        const next = Math.max(10, last + (Math.random() - 0.48) * 4);
        return [...prev.slice(1), next];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Form submission / Registration handler
  const handleSubmit = (e: React.FormEvent, directDemoMode = false) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (directDemoMode) {
      // Direct Instant Demo Bypass
      onLogin('guest_trader@pocketoption.com', true, { demo: 10000.00, real: 0.00 });
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please specify both valid Email address and Password.');
      return;
    }

    if (password.length < 5) {
      setErrorMsg('For system security, your Password must be at least 5 characters long.');
      return;
    }

    if (formMode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg('Please specify your Full Name.');
        return;
      }
      if (!phoneNumber.trim()) {
        setErrorMsg('Please specify your Phone Number.');
        return;
      }
    }

    // Retrieve local simulated account registries
    const accountsData = localStorage.getItem('pocket_trade_accounts');
    let accountsList: any[] = [];
    if (accountsData) {
      try {
        accountsList = JSON.parse(accountsData);
      } catch (err) {
        accountsList = [];
      }
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existingAccount = accountsList.find(acc => acc.email === trimmedEmail);

    if (formMode === 'signin') {
      if (existingAccount) {
        if (existingAccount.password === password) {
          // Success Logged in
          setSuccessMsg('Access granted! Entering trading lobby...');
          setTimeout(() => {
            onLogin(existingAccount.email, true, { 
              demo: existingAccount.demoBalance ?? 10000.00, 
              real: existingAccount.realBalance ?? 250.00 
            });
          }, 800);
        } else {
          setErrorMsg('Authentication failed: Incorrect password for this account. Please try again.');
        }
      } else {
        setErrorMsg('No registered account was found with this email address. Please click the registration link below to register a new account.');
      }
    } else {
      // Explicit Sign Up
      if (existingAccount) {
        setErrorMsg('This email address already possesses an registered account. Please sign in instead.');
      } else {
        const newAccount = {
          email: trimmedEmail,
          password: password,
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          demoBalance: 10000.00,
          realBalance: 84.30
        };
        accountsList.push(newAccount);
        localStorage.setItem('pocket_trade_accounts', JSON.stringify(accountsList));
        
        setSuccessMsg('Account registered successfully! Redirecting...');
        setTimeout(() => {
          onLogin(newAccount.email, true, { demo: 10000.00, real: 84.30 });
        }, 800);
      }
    }
  };

  // Max and min calculation for mockup graph
  const maxSimPrice = Math.max(...simulatedPrices);
  const minSimPrice = Math.min(...simulatedPrices);
  const simPricesRange = (maxSimPrice - minSimPrice) || 10;

  return (
    <div id="landing-root" className="min-h-screen w-screen bg-[#06080F] text-slate-100 flex flex-col font-sans overflow-x-hidden relative select-none">
      
      {/* Background Graphic Blobs */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-15%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[10%] w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Banner Header */}
      <header id="landing-header" className="h-16 md:h-20 px-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          {/* Authentic Logo Icon representation from photo */}
          <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
            {/* Double overlapping gradient circles */}
            <div className="absolute -left-1 w-6 h-6 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 opacity-90 blur-[0.5px]"></div>
            <div className="absolute -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-400 mix-blend-screen opacity-90 blur-[0.5px]"></div>
          </div>
          <span className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-white">
            Pocket<span className="font-light text-slate-300">Option</span>
          </span>
        </div>

        {/* Global Stats bar - Hidden on small mobile */}
        <div className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Online: <span className="text-white font-bold">{onlineTraders.toLocaleString()}</span> traders</span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-white/10 pl-6">
            <Activity size={13} className="text-cyan-400" />
            <span>24h Yield: <span className="text-emerald-400 font-bold">+88% payout</span></span>
          </div>
        </div>
      </header>

      {/* Hero Dual Grid Side-by-Side: Form Left/Right + Devices Preview Left/Right */}
      <main id="landing-main" className="flex-1 max-w-7xl mx-auto w-full px-6 flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 justify-center items-center py-6 md:py-12 z-10">
        
        {/* LEFT COLUMN: BRAND VALUE + MOCKUP DEVICE SELECTOR */}
        <div className="lg:col-span-7 flex flex-col gap-6 md:gap-8 w-full">
          <div className="flex flex-col gap-3">
            <span className="w-max px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-blue-500/10 text-cyan-300 border border-blue-500/20">
              ⚡ Multi-Device Trading Suite
            </span>
            <h1 className="text-3xl md:text-5xl font-black font-sans leading-[1.1] tracking-tight text-white">
              The Aesthetic Way To <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300">
                Master Live Options
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Experience binary options trading with split-second pricing, competitive liquidity, instant payouts, and professional-grade order routing tools.
            </p>
          </div>

          {/* Interactive Adaptive Layout Mockup Playground */}
          <div className="flex flex-col gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl shadow-xl w-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                Interactive Multi-Device Suite
              </span>
              
              {/* Responsive Layout Selection Buttons */}
              <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setSelectedDevice('laptop')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 transition-all ${
                    selectedDevice === 'laptop' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LaptopIcon size={12} />
                  Laptop
                </button>
                <button
                  onClick={() => setSelectedDevice('tablet')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 transition-all ${
                    selectedDevice === 'tablet' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TabletIcon size={12} />
                  Tablet
                </button>
                <button
                  onClick={() => setSelectedDevice('phone')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 transition-all ${
                    selectedDevice === 'phone' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone size={12} />
                  Phone
                </button>
              </div>
            </div>

            {/* Simulated Live Device Frames Renderer */}
            <div className="h-64 md:h-80 flex items-center justify-center bg-slate-950/40 rounded-xl border border-white/5 relative overflow-hidden p-6">
              
              {/* 1. LAPTOP CONTAINER FRAME */}
              {selectedDevice === 'laptop' && (
                <div className="w-full max-w-md bg-slate-900 border-x-8 border-t-8 border-slate-700 rounded-t-xl h-[90%] shadow-2xl relative flex flex-col overflow-hidden">
                  {/* Internal Laptop Screen UI Mock */}
                  <div className="h-4 bg-slate-950 border-b border-white/5 flex items-center px-2 justify-between">
                    <span className="text-[7px] font-mono text-cyan-400 font-bold">CRYPTO IDX 24H LIVE FEED</span>
                    <span className="text-[7px] font-mono text-emerald-400">STATUS • ONLINE</span>
                  </div>
                  <div className="flex-1 bg-slate-950 p-2 flex flex-col justify-between">
                    {/* Tiny responsive graph */}
                    <svg className="w-full h-[65%] text-emerald-500 fill-emerald-500/10">
                      <path
                        d={`M ${simulatedPrices.map((p, idx) => `${(idx / 19) * 420},${120 - ((p - minSimPrice) / simPricesRange) * 80}`).join(' L ')}`}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                    </svg>
                    {/* Bottom controls representation */}
                    <div className="grid grid-cols-2 gap-2 h-8 items-center border-t border-white/5 pt-1">
                      <div className="bg-emerald-500/20 text-emerald-400 text-[8px] font-mono font-bold py-1 text-center rounded">
                        HIGHER (UP)
                      </div>
                      <div className="bg-rose-500/20 text-rose-400 text-[8px] font-mono font-bold py-1 text-center rounded">
                        LOWER (DOWN)
                      </div>
                    </div>
                  </div>
                  {/* Bottom laptop stand baseline */}
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-slate-500/40 to-slate-500/20"></div>
                </div>
              )}

              {/* 2. TABLET CONTAINER FRAME */}
              {selectedDevice === 'tablet' && (
                <div className="w-64 h-[95%] bg-slate-900 border-8 border-slate-700 rounded-2xl shadow-2xl relative flex flex-col overflow-hidden">
                  {/* Tablet notch camera */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-slate-900 rounded-full flex items-center justify-center">
                    <span className="w-1 h-1 rounded-full bg-cyan-400/80"></span>
                  </div>
                  
                  {/* Tablet Interface Mock */}
                  <div className="flex-1 bg-slate-950 p-3 pt-5 flex flex-col justify-between">
                    <div className="flex justify-between items-center bg-white/5 p-1 rounded-lg">
                      <span className="text-[9px] text-[#f1f5f9] font-bold">PocketOption</span>
                      <span className="text-[8px] font-mono text-amber-400 bg-amber-400/20 px-1 rounded font-bold">K$10,000.00</span>
                    </div>

                    {/* Candlestick visualization preview */}
                    <div className="flex-1 flex items-center justify-around py-3">
                      {Array.from({ length: 12 }).map((_, i) => {
                        const h = 25 + Math.random() * 40;
                        const isG = Math.random() > 0.45;
                        return (
                          <div key={i} className="flex flex-col items-center">
                            <span className={`w-[1px] h-3 ${isG ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            <span className={`w-3 rounded-xs ${isG ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ height: `${h}px` }}></span>
                            <span className={`w-[1px] h-3 ${isG ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 mt-auto">
                      <div className="bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-[9px] py-1 text-center rounded font-sans font-extrabold uppercase">
                        UP
                      </div>
                      <div className="bg-rose-500/25 border border-rose-500/30 text-rose-400 text-[9px] py-1 text-center rounded font-sans font-extrabold uppercase">
                        DOWN
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. PHONE CONTAINER FRAME */}
              {selectedDevice === 'phone' && (
                <div className="w-[145px] h-[95%] bg-slate-900 border-[6px] border-slate-700 rounded-3xl shadow-2xl relative flex flex-col overflow-hidden">
                  {/* Speaker and Camera array */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-3 bg-slate-900 rounded-full flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e293b]"></span>
                    <span className="w-1 h-1 rounded-full bg-cyan-400/60"></span>
                  </div>
                  
                  {/* Live mobile screens mock */}
                  <div className="flex-1 bg-slate-950 p-2 pt-5 flex flex-col justify-between">
                    <div className="text-center">
                      <span className="text-[7px] font-mono text-slate-400 uppercase">Crypto IDX Payout</span>
                      <h4 className="text-[9px] font-bold text-white tracking-tight -mt-0.5">83.0% Profit Bonus</h4>
                    </div>

                    {/* Mountain line */}
                    <div className="h-16 flex items-end">
                      <svg className="w-full h-full text-cyan-400 fill-cyan-400/5">
                        <path
                          d={`M ${simulatedPrices.slice(-10).map((p, idx) => `${(idx / 9) * 130},${60 - ((p - minSimPrice) / simPricesRange) * 45}`).join(' L ')}`}
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="2.5"
                        />
                      </svg>
                    </div>

                    {/* Compact dual stack */}
                    <div className="flex flex-col gap-1.5 mt-2">
                      <div className="bg-emerald-500 text-white text-[8px] py-1.5 text-center font-bold rounded-lg uppercase">
                        Call (Up)
                      </div>
                      <div className="bg-rose-500 text-white text-[8px] py-1.5 text-center font-bold rounded-lg uppercase">
                        Put (Down)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Layout Fit badge */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800/80 rounded-md px-2 py-0.5 text-[9px] font-mono text-cyan-400">
                AUTO-ADAPTIVE BREAKPOINTS
              </div>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-normal font-sans text-center md:text-left mt-1">
              🎨 Our responsive trading interface reflows beautifully. Laptops unlock comprehensive charts, tablets focus on touch lanes, and phones deliver lightning-fast dual trigger pads in the palm of your hand.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: GLASSMORPHIC AUTH SIGN IN / AUTO-SIGN UP CARD */}
        <div className="lg:col-span-5 w-full flex flex-col gap-4">
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Soft corner glowing element */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
            
            <div className="flex flex-col gap-1.5 mb-6 text-center lg:text-left">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white animate-fade-in">
                Create or Sign In & Trade
              </h2>
              <p className="text-xs text-slate-300">
                {formMode === 'signin' 
                  ? 'Sign in using your register email address and password.'
                  : 'Register a live trading account to execute options directly.'
                }
              </p>
            </div>

            {/* Error Indicators */}
            {errorMsg && (
              <div className="mb-4 bg-rose-500/15 border border-rose-500/25 text-rose-300 rounded-xl p-3 text-xs flex items-start gap-2.5 leading-relaxed animate-shake">
                <AlertTriangle size={15} className="shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Indicators */}
            {successMsg && (
              <div className="mb-4 bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 rounded-xl p-3 text-xs flex items-start gap-2.5 leading-relaxed">
                <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Simulated Credentials form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Full Name Field (Explicit Sign-up Only) */}
              {formMode === 'signup' && (
                <div className="flex flex-col gap-2 transition-all duration-300">
                  <label className="text-xs text-slate-400 font-mono tracking-wide uppercase">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-blue-500/50 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Address Field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400 font-mono tracking-wide uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-blue-500/50 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Phone Number Field (Explicit Sign-up Only) */}
              {formMode === 'signup' && (
                <div className="flex flex-col gap-2 transition-all duration-300">
                  <label className="text-xs text-slate-400 font-mono tracking-wide uppercase">Phone Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. +1 (555) 000-0000"
                      className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-blue-500/50 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password credentials field */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <label className="font-mono tracking-wide uppercase">Password</label>
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter at least 5 characters"
                    className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-blue-500/50 rounded-xl pl-11 pr-11 py-3 text-xs text-white placeholder-slate-400 focus:outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* CTA primary submit */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-sans font-bold shadow-lg shadow-blue-500/10 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <span>{formMode === 'signin' ? 'Sign In' : 'Register Account'}</span>
                <ArrowRight size={14} />
              </button>

              {/* Divider lines */}
              <div className="flex items-center gap-3 my-2 text-[10px] uppercase font-mono text-slate-500">
                <div className="flex-1 h-[1px] bg-white/5"></div>
                <span>Alternative bypass</span>
                <div className="flex-1 h-[1px] bg-white/5"></div>
              </div>

              {/* One-click bypass to trade instantly */}
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-white border border-white/10 rounded-xl text-xs font-sans font-bold active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap size={13} className="text-cyan-300 fill-cyan-400/14" />
                <span>Play Immediate Trade (Guest Token)</span>
              </button>
              
            </form>

            {/* Footer switcher */}
            <div className="mt-6 border-t border-white/5 pt-4 text-center">
              {formMode === 'signin' ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[11px] font-sans text-slate-400">
                    Not registered yet? Create a new account below:
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormMode('signup');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs font-sans font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer transition-all"
                  >
                    Create Options Account &rarr;
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[11px] font-sans text-slate-400">
                    Already possess a registered options account? Switch below:
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormMode('signin');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs font-sans font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer transition-all"
                  >
                    Sign In &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick legal/risk notice card */}
          <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 flex gap-3 text-[10px] text-slate-400 leading-normal font-sans">
            <ShieldCheck size={16} className="text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Risk Disclosure: PocketOption is a high-yield online trading service. Trading financial derivatives is highly speculative and involves substantial risk of capital loss. All system pricing originates from active liquid interbank market streams.
            </span>
          </div>

        </div>

      </main>

      {/* Landing dynamic banner reviews showcase footer */}
      <footer id="landing-footer" className="border-t border-white/5 mt-auto bg-slate-950/20 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span>© 2026 PocketOption Inc. Covered by Secure Socket Layer (SSL) standards.</span>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Use</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-slate-400 cursor-pointer">Risk Disclosure</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
