/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  UserCheck, 
  ArrowRight, 
  RefreshCw,
  Award,
  Plus,
  Coins,
  ChevronDown,
  Clock,
  Sparkles,
  CheckCircle2,
  Bell,
  X,
  Smartphone,
  ChevronRight,
  TrendingUpDown,
  BookOpen,
  Users,
  LogOut,
  Search,
  Info
} from 'lucide-react';

import { Asset, Trade, EconomicEvent, TopTrader, Transaction } from './types';
import { 
  USER_PROFILE_DEFAULT, 
  INITIAL_ASSETS, 
  ECONOMIC_EVENTS, 
  TOP_TRADERS, 
  INITIAL_TRANSACTIONS,
  TRADING_STRATEGIES
} from './data';

// Import our modular subcomponents
import Sidebar from './components/Sidebar';
import ChartArea from './components/ChartArea';
import OrderForm from './components/OrderForm';
import CashierTab from './components/CashierTab';
import EconomicCalendarTab from './components/EconomicCalendarTab';
import CopyTradingTab from './components/CopyTradingTab';
import StrategiesTab from './components/StrategiesTab';
import SupportChat from './components/SupportChat';
import LandingPage from './components/LandingPage';
import ProfileHubTab from './components/ProfileHubTab';

// Beautiful custom visual indicators for each asset and forex pair
const renderAssetIcon = (assetId: string) => {
  switch (assetId) {
    case 'crypto_idx':
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center relative overflow-hidden ring-1 ring-white/15 shadow shrink-0">
          <span className="text-sm font-black text-slate-950 select-none">₿</span>
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-blue-500 text-[6px] text-white flex items-center justify-center font-bold">idx</div>
        </div>
      );
    case 'brazil_powerplay':
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-yellow-400 flex items-center justify-center ring-1 ring-white/15 shadow shrink-0">
          <span className="text-base select-none leading-none">🇧🇷</span>
        </div>
      );
    case 'africa_knockout':
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-amber-700 flex items-center justify-center ring-1 ring-white/15 shadow shrink-0">
          <span className="text-sm select-none leading-none">🦁</span>
        </div>
      );
    case 'latam_power':
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center ring-1 ring-white/15 shadow shrink-0">
          <span className="text-sm select-none leading-none">⚽</span>
        </div>
      );
    case 'asia_matchpoint':
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-600 to-red-400 flex items-center justify-center ring-1 ring-white/15 shadow shrink-0">
          <span className="text-sm select-none leading-none">🌏</span>
        </div>
      );
    case 'egypt_tempo':
      return (
        <div className="w-7 h-7 rounded-full bg-[#854d0e] flex items-center justify-center ring-1 ring-white/15 shadow shrink-0">
          <span className="text-sm select-none leading-none">🦅</span>
        </div>
      );
    case 'eur_usd':
      return (
        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center relative overflow-hidden ring-1 ring-white/15 shadow shrink-0">
          <span className="text-xs absolute left-0.5 select-none z-10 leading-none">🇪🇺</span>
          <span className="text-xs absolute right-0.5 select-none leading-none">🇺🇸</span>
        </div>
      );
    case 'gbp_nok':
      return (
        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center relative overflow-hidden ring-1 ring-white/15 shadow shrink-0">
          <span className="text-xs absolute left-0.5 select-none z-10 leading-none">🇬🇧</span>
          <span className="text-xs absolute right-0.5 select-none leading-none">🇳🇴</span>
        </div>
      );
    case 'aud_zar':
      return (
        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center relative overflow-hidden ring-1 ring-white/15 shadow shrink-0">
          <span className="text-xs absolute left-0.5 select-none z-10 leading-none">🇦🇺</span>
          <span className="text-xs absolute right-0.5 select-none leading-none">🇿🇦</span>
        </div>
      );
    case 'eur_huf':
      return (
        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center relative overflow-hidden ring-1 ring-white/15 shadow shrink-0">
          <span className="text-xs absolute left-0.5 select-none z-10 leading-none">🇪🇺</span>
          <span className="text-xs absolute right-0.5 select-none leading-none">🇭🇺</span>
        </div>
      );
    case 'bitcoin':
      return (
        <div className="w-7 h-7 rounded-full bg-[#f7931a] flex items-center justify-center ring-1 ring-white/15 shadow shrink-0">
          <span className="text-xs font-black text-white select-none">₿</span>
        </div>
      );
    case 'ethereum':
      return (
        <div className="w-7 h-7 rounded-full bg-[#627eea] flex items-center justify-center ring-1 ring-white/15 shadow shrink-0">
          <span className="text-xs font-black text-white select-none">Ξ</span>
        </div>
      );
    default:
      return (
        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center ring-1 ring-white/15 shadow shrink-0">
          <span className="text-[9px] font-black text-slate-350 select-none uppercase">{assetId.slice(0, 3)}</span>
        </div>
      );
  }
};

export default function App() {
  // Navigation & Support Tabs
  const [activeTab, setActiveTab] = useState<string>('trades');
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);

  // User login status
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(() => {
    const saved = localStorage.getItem('pocket_trade_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // User details & Balance ledger states
  const [userProfile, setUserProfile] = useState(() => {
    const savedUser = localStorage.getItem('pocket_trade_current_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        return {
          ...USER_PROFILE_DEFAULT,
          email: parsed.email,
          name: parsed.name,
        };
      } catch (e) {}
    }
    return USER_PROFILE_DEFAULT;
  });

  const [isDemo, setIsDemo] = useState<boolean>(true); // Start in Demo Mode like the screenshot
  const [demoBalance, setDemoBalance] = useState<number>(() => {
    const savedUser = localStorage.getItem('pocket_trade_current_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const accountsData = localStorage.getItem('pocket_trade_accounts');
        if (accountsData) {
          const accountsList = JSON.parse(accountsData);
          const act = accountsList.find((ac: any) => ac.email === parsed.email);
          if (act && act.demoBalance !== undefined) return act.demoBalance;
        }
      } catch (e) {}
    }
    return USER_PROFILE_DEFAULT.demoBalance;
  });

  const [realBalance, setRealBalance] = useState<number>(() => {
    const savedUser = localStorage.getItem('pocket_trade_current_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const accountsData = localStorage.getItem('pocket_trade_accounts');
        if (accountsData) {
          const accountsList = JSON.parse(accountsData);
          const act = accountsList.find((ac: any) => ac.email === parsed.email);
          if (act && act.realBalance !== undefined) return act.realBalance;
        }
      } catch (e) {}
    }
    return USER_PROFILE_DEFAULT.realBalance;
  });

  // Dual handlers to login/logout/register accounts with local persistence
  const handleLogin = (email: string, isDemoSet: boolean, balances?: { demo: number; real: number }) => {
    const name = email.split('@')[0];
    const userObj = { email, name };
    setCurrentUser(userObj);
    localStorage.setItem('pocket_trade_current_user', JSON.stringify(userObj));
    setIsDemo(isDemoSet);
    
    setUserProfile({
      ...USER_PROFILE_DEFAULT,
      email: email,
      name: name,
    });

    if (balances) {
      setDemoBalance(balances.demo);
      setRealBalance(balances.real);
    }

    setToastMessage({
      id: 'toast-login-' + Date.now(),
      text: `Sync Complete! Welcome back to the PocketOption desk, ${name}!`,
      type: 'win'
    });
  };

  const handleLogout = () => {
    if (currentUser) {
      const accountsData = localStorage.getItem('pocket_trade_accounts');
      let accountsList: any[] = [];
      if (accountsData) {
        try {
          accountsList = JSON.parse(accountsData);
        } catch (e) { accountsList = []; }
      }
      const updatedList = accountsList.map((acc: any) => {
        if (acc.email.toLowerCase() === currentUser.email.toLowerCase()) {
          return {
            ...acc,
            demoBalance: demoBalance,
            realBalance: realBalance
          };
        }
        return acc;
      });
      localStorage.setItem('pocket_trade_accounts', JSON.stringify(updatedList));
    }

    setCurrentUser(null);
    localStorage.removeItem('pocket_trade_current_user');
    setToastMessage({
      id: 'toast-logout-' + Date.now(),
      text: 'Options ledger safely locked. Logged out successfully.',
      type: 'copy'
    });
  };

  const handleUpdateProfile = (data: { name: string; phone: string }) => {
    setUserProfile((prev: any) => {
      const next = { ...prev, name: data.name, phone: data.phone };
      if (currentUser) {
        const updatedUser = { ...currentUser, name: data.name };
        setCurrentUser(updatedUser);
        localStorage.setItem('pocket_trade_current_user', JSON.stringify(updatedUser));
        
        const accountsData = localStorage.getItem('pocket_trade_accounts');
        if (accountsData) {
          try {
            const accountsList = JSON.parse(accountsData);
            const updatedList = accountsList.map((acc: any) => {
              if (acc.email.toLowerCase() === currentUser.email.toLowerCase()) {
                return {
                  ...acc,
                  name: data.name,
                  phone: data.phone
                };
              }
              return acc;
            });
            localStorage.setItem('pocket_trade_accounts', JSON.stringify(updatedList));
          } catch (e) {}
        }
      }
      return next;
    });
    setToastMessage({
      id: 'toast-profile-' + Date.now(),
      text: 'Trader credentials successfully synced in active ledger.',
      type: 'win'
    });
  };

  // Sync live balance transitions to persistent memory in real-time
  useEffect(() => {
    if (!currentUser) return;
    const accountsData = localStorage.getItem('pocket_trade_accounts');
    if (accountsData) {
      try {
        const accountsList = JSON.parse(accountsData);
        const updated = accountsList.map((acc: any) => {
          if (acc.email.toLowerCase() === currentUser.email.toLowerCase()) {
            return {
              ...acc,
              demoBalance,
              realBalance
            };
          }
          return acc;
        });
        localStorage.setItem('pocket_trade_accounts', JSON.stringify(updated));
      } catch (e) {}
    }
  }, [demoBalance, realBalance, currentUser]);

  // Asset registries
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [activeAsset, setActiveAsset] = useState<Asset>(INITIAL_ASSETS[0]);
  const [showAssetSelector, setShowAssetSelector] = useState<boolean>(false);

  // Trades and Transaction histories
  const [activeTrades, setActiveTrades] = useState<Trade[]>([]);
  const [closedTrades, setClosedTrades] = useState<Trade[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Copy trading master logs
  const [topTraders, setTopTraders] = useState<TopTrader[]>(TOP_TRADERS);

  // Settlement and Copied trade alerts
  const [toastMessage, setToastMessage] = useState<{ id: string; text: string; type: 'win' | 'loss' | 'copy' } | null>(null);
  const [chartType, setChartType] = useState<'candle' | 'mountain'>('mountain');

  // Market live / lobby toggle and dynamic selector variables
  const [isMarketLiveMode, setIsMarketLiveMode] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedAssetCategory, setSelectedAssetCategory] = useState<string>('currencies');
  const [mobileAmount, setMobileAmount] = useState<number>(100);
  const [mobileDuration, setMobileDuration] = useState<number>(30);

  // Fast switcher for assets
  const handleSwitchAsset = (direction: 'next' | 'prev' = 'next') => {
    const currentIndex = assets.findIndex(a => a.id === activeAsset.id);
    if (currentIndex === -1) return;
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= assets.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = assets.length - 1;
    setActiveAsset(assets[nextIndex]);
  };

  // Triggering interval loops mapping price fluctuations and settlements
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. FLUCTUATE ALL ASSETS (Brownian tick walks)
      setAssets((prevAssets) => {
        const nextAssets = prevAssets.map((asset) => {
          const current = asset.currentPrice;
          const pctSpread = asset.type === 'crypto' ? 0.0012 : 0.0006;
          // random shift up or down
          const change = current * (Math.random() - 0.49) * pctSpread;
          const nextPrice = Math.max(0.0001, current + change);
          
          // update history array up to max 350 items for smooth deep scrolling
          const nextHistory = [...asset.lastPrices, nextPrice].slice(-350);
          const calculatedTrend = change >= 0 ? 'up' : 'down';
          const calculatedChangePct = parseFloat(((nextPrice - asset.lastPrices[0]) / asset.lastPrices[0] * 100).toFixed(2));

          return {
            ...asset,
            currentPrice: nextPrice,
            lastPrices: nextHistory,
            trend: calculatedTrend,
            changePct: calculatedChangePct
          };
        });

        // Sync active asset context to prevent coordinate jumps
        const syncedActive = nextAssets.find(a => a.id === activeAsset.id);
        if (syncedActive) {
          setActiveAsset(syncedActive);
        }

        return nextAssets;
      });

      // 2. TICK ACTIVE OPTIONS countdowns & SETTLE positions
      setActiveTrades((prevActive) => {
        const expired: Trade[] = [];
        const remaining: Trade[] = [];

        prevActive.forEach((trade) => {
          const now = Date.now();
          if (now >= trade.expiresAt) {
            expired.push(trade);
          } else {
            remaining.push(trade);
          }
        });

        // Process Settlements
        if (expired.length > 0) {
          expired.forEach((trade) => {
            // Find current price matching settlement
            const matchAsset = assets.find(a => a.id === trade.assetId);
            const closePrice = matchAsset ? matchAsset.currentPrice : trade.strikePrice;
            
            // Evaluate Win or Loss Condition
            let isWon = false;
            if (trade.type === 'up') {
              isWon = closePrice > trade.strikePrice;
            } else {
              isWon = closePrice < trade.strikePrice;
            }

            const status = isWon ? 'won' : ('lost' as any);
            const updatedTrade: Trade = {
              ...trade,
              status,
              closePrice
            };

            // Calculate direct payouts
            const payout = isWon ? trade.potentialPayout : 0;
            if (trade.isDemo) {
              setDemoBalance(prev => prev + payout);
            } else {
              setRealBalance(prev => prev + payout);
            }

            // Append to completed history
            setClosedTrades(prev => [updatedTrade, ...prev]);

            // Dispatch visual HUD congratulations
            const finalProfit = isWon ? (trade.potentialPayout - trade.amount) : -trade.amount;
            setToastMessage({
              id: 'toast-' + Date.now(),
              text: isWon 
                ? `Option Settled: WIN! +$${payout.toLocaleString(undefined, { minimumFractionDigits: 2 })} on ${trade.assetName}!` 
                : `Option Settled: Loss. $${trade.amount} expired out-of-the-money on ${trade.assetName}.`,
              type: isWon ? 'win' : 'loss'
            });
          });
        }

        return remaining;
      });

    }, 1000);

    return () => clearInterval(timer);
  }, [assets, activeAsset]);

  // Simulated Master copying updates. Periodically triggers copied trades for life!
  useEffect(() => {
    const copyTimer = setInterval(() => {
      const activeCopies = topTraders.filter(t => t.isCopied);
      if (activeCopies.length === 0) return;

      // Select random master trader to replicate
      const trader = activeCopies[Math.floor(Math.random() * activeCopies.length)];
      const randomAsset = assets[Math.floor(Math.random() * assets.length)];
      
      const copyType = Math.random() > 0.5 ? 'up' : 'down';
      const isWon = Math.random() < (trader.winRate / 100);
      const copyAmount = 50 + Math.floor(Math.random() * 200);
      const profitVal = copyAmount * (randomAsset.payoutPct / 100);

      setToastMessage({
        id: 'toast-copy-' + Date.now(),
        text: `Replicated Master Copier alert: ${trader.name} opened a position on ${randomAsset.name}. Closed ${isWon ? 'WIN: +$' + profitVal.toFixed(2) + ' profit' : 'Loss'}!`,
        type: 'copy'
      });

      // If user is copying them, let's also simulate minor dividends and ledger additions
      if (isWon) {
        // Minor mock reward for holding copiers
        const passiveDividends = parseFloat((profitVal * 0.05).toFixed(2));
        if (isDemo) {
          setDemoBalance(prev => prev + passiveDividends);
        } else {
          setRealBalance(prev => prev + passiveDividends);
        }
      }

    }, 24000);

    return () => clearInterval(copyTimer);
  }, [topTraders, assets, isDemo]);

  // Placement executor handler
  const handlePlaceTrade = (type: 'up' | 'down', amount: number, durationSeconds: number) => {
    // Subtract capital immediately from ledger
    if (isDemo) {
      setDemoBalance(prev => prev - amount);
    } else {
      setRealBalance(prev => prev - amount);
    }

    const potentialPayout = amount * (1 + activeAsset.payoutPct / 100);
    const newTrade: Trade = {
      id: 'trade_' + Math.floor(Math.random() * 10000000),
      assetId: activeAsset.id,
      assetName: activeAsset.name,
      strikePrice: activeAsset.currentPrice,
      type,
      amount,
      potentialPayout,
      expiresAt: Date.now() + durationSeconds * 1000,
      durationSeconds,
      status: 'pending',
      isDemo,
      createdAt: Date.now()
    };

    setActiveTrades(prev => [...prev, newTrade]);
  };

  const handleResetDemoBal = () => {
    setDemoBalance(10000.00); // Recharge to standard mock level
    setToastMessage({
      id: 'toast-reset-' + Date.now(),
      text: 'Demo Account balance recharged to $10,000.00! Trade freely.',
      type: 'win'
    });
  };

  const handleToggleCopy = (rank: number) => {
    setTopTraders(prev => prev.map(t => {
      if (t.rank === rank) {
        const nextState = !t.isCopied;
        if (nextState) {
          setToastMessage({
            id: 'toast-copied-' + Date.now(),
            text: `Now copying positions from ${t.name}! Replicated trades will trigger automatically in the background.`,
            type: 'copy'
          });
        }
        return { ...t, isCopied: nextState };
      }
      return t;
    }));
  };

  // Main UI switcher selection
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'trades':
        return (
          <div id="trades-workspace-columns" className="flex-1 flex flex-col lg:flex-row gap-4 h-full p-4 overflow-y-auto no-scrollbar">
            
             {/* Left/Middle Column - Asset Ticker + Chart + Status Ledger panels */}
             <div id="left-workspace-column" className="flex-1 flex flex-col gap-4 min-h-[450px]">
               {/* Asset choice row */}
               <div id="asset-selection-hud" className="relative flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-2xl shrink-0 shadow">
                 <div className="flex items-center gap-3">
                   <span className="text-xs text-slate-300 font-sans">Trading Pair:</span>
                   <button
                     id="asset-dropdown-trigger" data-test="ok"
                     onClick={() => setShowAssetSelector(!showAssetSelector)}
                     className="bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold text-white flex items-center gap-2 hover:bg-white/10 transition-all cursor-pointer select-none"
                   >
                     <div className="flex items-center gap-1.5">{renderAssetIcon(activeAsset.id)}<span className="text-blue-300 font-bold ml-1">{activeAsset.name}</span></div>
                     <ChevronDown size={14} className={`text-slate-400 transition-transform ${showAssetSelector ? 'rotate-180' : ''}`} />
                   </button>
 
                   {/* Profit percentage badge with vertical Open Trade option */}
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-[11px] font-mono font-black text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded leading-none select-none">
                        +{activeAsset.payoutPct}% Payout
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsMarketLiveMode(true)}
                        className="text-[11px] font-sans font-black text-blue-400 hover:text-blue-300 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-0.5 animate-pulse bg-transparent border-none py-px px-1 outline-none"
                        title="Open Interactive Market Trader"
                      >
                        <span>open trade ↗</span>
                      </button>
                    </div>
                 </div>
 
                 {/* Status Toggles overlay */}
                 {/* Switch Asset controls */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleSwitchAsset('prev')}
                      className="bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 px-2.5 py-1.5 rounded-l-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center min-w-[28px]"
                      title="Previous Asset"
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchAsset('next')}
                      className="bg-blue-600 border border-blue-500 hover:bg-blue-500 text-white active:scale-95 px-3.5 py-1.5 rounded-r-xl text-xs font-sans font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-blue-500/10"
                      title="Next Asset"
                    >
                      <span>Switch Asset</span>
                      <span>▶</span>
                    </button>
                  </div>
 
                 {/* Floated Assets registry panel */}
                  {/* Floated Assets registry panel */}
                  {showAssetSelector && (
                    <div id="assets-registry-dropdown" className="absolute top-12 left-2 w-[345px] md:w-[420px] bg-[#0c101b]/98 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-40 overflow-hidden py-1 animate-fade-in divide-y divide-white/5 font-sans">
                      {/* Category Switcher Row */}
                      <div className="px-2 py-1.5 bg-[#0a0d17] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                        {[
                          { id: 'all', label: 'All', icon: '⭐' },
                          { id: 'crypto', label: 'Crypto', icon: '🪙' },
                          { id: 'currencies', label: 'Currencies', icon: '💵' },
                          { id: 'stocks', label: 'Indices', icon: '📈' }
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedAssetCategory(cat.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                              selectedAssetCategory === cat.id
                                ? 'bg-[#2563eb] text-white font-black scale-105'
                                : 'bg-[#121725] text-slate-300 hover:bg-white/5'
                            }`}
                          >
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Headings Row */}
                      <div className="px-3.5 py-2 bg-[#06080e] grid grid-cols-[1.5fr_1fr_1fr] text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">
                        <span>Asset</span>
                        <span className="text-right flex items-center justify-end gap-0.5">
                          Profit <Info className="w-2.5 h-2.5 text-slate-400 hover:text-white" />
                        </span>
                        <span className="text-right text-[#34d399] underline decoration-dotted">For VIP</span>
                      </div>

                      {/* Asset Scroll Container */}
                      <div className="max-h-[280px] overflow-y-auto no-scrollbar divide-y divide-white/5 bg-[#0a0e17]">
                        {assets.filter(ast => {
                          const matchesSearch = ast.name.toLowerCase().includes(searchTerm.toLowerCase()) || ast.id.toLowerCase().includes(searchTerm.toLowerCase());
                          const matchesCat = selectedAssetCategory === 'all' || ast.type === selectedAssetCategory;
                          return matchesSearch && matchesCat;
                        }).map((ast) => {
                          const isCurrent = activeAsset.id === ast.id;
                          return (
                            <button
                              key={ast.id}
                              type="button"
                              id={`asset-option-${ast.id}`}
                              onClick={() => {
                                setActiveAsset(ast);
                                setShowAssetSelector(false);
                              }}
                              className={`w-full grid grid-cols-[1.5fr_1fr_1fr] items-center px-3.5 py-2 hover:bg-[#121725] transition-colors text-left cursor-pointer ${
                                isCurrent ? 'bg-[#1e293b]/55 border-l-2 border-blue-500 text-white font-bold' : ''
                              }`}
                            >
                              {/* Left column - Icon & Name */}
                              <div className="flex items-center gap-2.5 min-w-0">
                                {renderAssetIcon(ast.id)}
                                <div className="flex flex-col min-w-0">
                                  <span className={`font-sans font-bold text-xs truncate ${isCurrent ? 'text-blue-400 font-black' : 'text-slate-100'}`}>
                                    {ast.name}
                                  </span>
                                  <span className="font-mono text-[9px] text-slate-450 mt-0.5 whitespace-nowrap">
                                    {ast.type} • ${ast.currentPrice.toLocaleString(undefined, { minimumFractionDigits: ast.type === 'currencies' ? 4 : 2, maximumFractionDigits: ast.type === 'currencies' ? 4 : 2 })}
                                  </span>
                                </div>
                              </div>

                              {/* Middle Column - Standard Profit */}
                              <div className="text-right flex flex-col items-end pr-2">
                                <span className="font-mono text-xs font-black text-[#10b981]">
                                  {ast.payoutPct}%
                                </span>
                              </div>

                              {/* Right Column - VIP Profit */}
                              <div className="text-right flex flex-col items-end pr-1">
                                <span className="font-mono text-xs font-black text-[#34d399] bg-[#34d399]/10 px-1.5 py-0.5 rounded border border-[#34d399]/15">
                                  {ast.vipPayoutPct || (ast.payoutPct + 2)}%
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
               </div>
 
               {/* Vector Chart Frame */}
               <ChartArea 
                 activeAsset={activeAsset} 
                 activeTrades={activeTrades}
                 chartType={chartType} 
                 setChartType={setChartType} 
                 isMarketLiveMode={isMarketLiveMode}
                 setIsMarketLiveMode={setIsMarketLiveMode}
               />
 
               {/* Bottom Positions list panel */}
               <div id="positions-collapsible-hud" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex flex-col gap-3 min-h-[160px] shrink-0 shadow">
                 <div id="positions-headers" className="flex items-center justify-between border-b border-white/10 pb-2 text-xs">
                   <div className="flex items-center gap-3 font-bold font-sans">
                     <span className="text-white uppercase tracking-wider">Option Open Positions</span>
                     <span className="font-mono text-[10px] text-blue-300 bg-blue-500/15 px-1.5 py-0.5 rounded">
                       {activeTrades.length} Active
                     </span>
                   </div>
                   <span className="font-serif italic text-slate-400">Live Tick settlements</span>
                 </div>
 
                 {/* Active grid list */}
                 {activeTrades.length === 0 ? (
                   <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 font-sans text-xs gap-1">
                     <span>No active option positions running on this pair.</span>
                     <span className="text-[10px] text-slate-500 leading-snug">Click Higher / Lower in the right order sidebar to begin!</span>
                   </div>
                 ) : (
                   <div id="positions-scroll-list" className="flex flex-col gap-2 max-h-[140px] overflow-y-auto no-scrollbar">
                     {activeTrades.map((pos) => {
                       const isUp = pos.type === 'up';
                       // Calculate remaining countdown
                       const remainingSec = Math.max(0, Math.round((pos.expiresAt - Date.now()) / 1000));
                       // In the money preview:
                       const isWinning = isUp 
                         ? activeAsset.currentPrice > pos.strikePrice 
                         : activeAsset.currentPrice < pos.strikePrice;
 
                       return (
                         <div 
                           key={pos.id} 
                           id={`position-item-${pos.id}`}
                           className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs font-mono leading-none hover:bg-white/10 transition-all"
                         >
                           <div className="flex items-center gap-3">
                             <span className={`w-2 h-2 rounded-full ${isUp ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
                             <div className="flex flex-col gap-1">
                               <span className="font-sans font-bold text-slate-200">{pos.assetName} • {isUp ? 'UP/CALL' : 'DOWN/PUT'}</span>
                               <span className="text-[10px] text-slate-400">Strike Price: ${pos.strikePrice.toLocaleString(undefined, { maximumFractionDigits: 3 })}</span>
                             </div>
                           </div>
 
                           <div className="flex items-center gap-6">
                             <div className="flex flex-col items-end gap-1 select-none">
                               <span className="text-[9px] text-slate-400 lowercase leading-none">Timer</span>
                               <span className="text-amber-400 font-bold font-mono text-[11px] flex items-center gap-1">
                                 <Clock size={11} /> {remainingSec}s
                               </span>
                             </div>
 
                             <div className="flex flex-col items-end gap-1 select-none">
                               <span className="text-[9px] text-slate-400 lowercase leading-none">Payout est</span>
                               <span className={`font-black text-xs ${isWinning ? 'text-emerald-400' : 'text-rose-500'}`}>
                                 ${isWinning ? pos.potentialPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '$0.00'}
                               </span>
                             </div>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 )}
               </div>
             </div>

            {/* Right Column - Order Form */}
            <OrderForm 
              activeAsset={activeAsset} 
              isDemo={isDemo} 
              currentBalance={isDemo ? demoBalance : realBalance} 
              onPlaceTrade={handlePlaceTrade} 
              onResetDemo={handleResetDemoBal} 
            />

          </div>
        );

      case 'calendar':
        return <div className="p-4 overflow-y-auto no-scrollbar"><EconomicCalendarTab /></div>;

      case 'copy':
        return (
          <div className="p-4 overflow-y-auto no-scrollbar">
            <CopyTradingTab 
              topTraders={topTraders} 
              onToggleCopy={handleToggleCopy} 
            />
          </div>
        );

      case 'strategies':
        return (
          <div className="p-4 overflow-y-auto no-scrollbar">
            <StrategiesTab 
              onUpdateBalance={(amt) => {
                if (isDemo) setDemoBalance(prev => prev + amt);
                else setRealBalance(prev => prev + amt);
              }}
              onAddTransaction={(tx) => setTransactions(prev => [tx, ...prev])}
            />
          </div>
        );

      case 'leaderboard':
        return (
          <div className="p-4 overflow-y-auto no-scrollbar animate-fade-in flex flex-col gap-4 select-none">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-300 flex items-center justify-center">
                  <Award size={20} />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-sans font-bold text-sm md:text-base text-white">Top-20 Weekly Leaderboard</h3>
                  <span className="font-mono text-[10px] text-slate-400 mt-1 uppercase tracking-tight">Pocket Trade Competition Pool • Live updates</span>
                </div>
              </div>
              <span className="font-mono text-xs text-blue-300 font-bold bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 shadow">Weekly Prize: $45,000</span>
            </div>

            {/* General leaderboard panel */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl divide-y divide-white/5 shadow-2xl">
              {topTraders.map((trader, idx) => (
                <div key={trader.rank} className="p-3.5 px-5 flex items-center justify-between text-xs hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-400 min-w-[20px]">#{trader.rank}</span>
                    <img src={trader.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                    <div className="flex flex-col">
                      <span className="font-sans font-medium text-slate-200">{trader.name}</span>
                      <span className="font-mono text-[9px] text-slate-400 uppercase">{trader.country} • Volume master</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-right shrink-0">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] text-slate-400 leading-none">WIN RATE</span>
                      <span className="text-emerald-400 font-bold">{trader.winRate}%</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] text-slate-400 leading-none">PROFITS</span>
                      <span className="text-[#3b82f6] font-black">+${trader.profit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'cashier':
        return (
          <div className="p-4 overflow-y-auto no-scrollbar">
            <CashierTab 
              currentBalance={isDemo ? demoBalance : realBalance}
              isDemo={isDemo}
              transactions={transactions}
              onAddTransaction={(tx) => setTransactions(prev => [tx, ...prev])}
              onUpdateBalance={(amt) => {
                if (isDemo) setDemoBalance(prev => prev + amt);
                else setRealBalance(prev => prev + amt);
              }}
              onOpenSupport={() => setIsSupportOpen(true)}
            />
          </div>
        );

      case 'profile':
        return (
          <div className="p-4 overflow-y-auto no-scrollbar">
            <ProfileHubTab
              userProfile={userProfile}
              isDemo={isDemo}
              setIsDemo={setIsDemo}
              demoBalance={demoBalance}
              realBalance={realBalance}
              onTopUpDemo={() => setDemoBalance(prev => prev + 1000)}
              onUpdateProfile={handleUpdateProfile}
              onLogout={handleLogout}
              setActiveTab={setActiveTab}
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (!currentUser) {
    return <LandingPage onLogin={handleLogin} />;
  }

  // Mobile Bottom HUD elements
  const bottomNavItems = [
    { id: 'trades', label: 'Terminal', icon: TrendingUp },
    { id: 'calendar', label: 'Calendar', icon: Clock },
    { id: 'copy', label: 'Copy Trade', icon: Users },
    { id: 'strategies', label: 'Strategies', icon: BookOpen },
    { id: 'leaderboard', label: 'Top-20', icon: Award },
    { id: 'cashier', label: 'Cashier', icon: Wallet },
  ];

  return (
    <div id="pocket-trade-root" className="h-screen w-screen bg-[#06080F] text-slate-100 flex flex-col font-sans overflow-hidden antialiased relative">
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* 1. TOP HEADER STATUS BAR */}
      <header id="top-navbar" className="h-[64px] bg-slate-900/40 backdrop-blur-xl border-b border-white/10 px-4 flex items-center justify-between shrink-0 select-none z-20 shadow-lg relative">
        
        {/* Left Side: Mobile header branding with Overlapping Circles logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
            {/* Double overlapping gradient circles */}
            <div className="absolute -left-0.5 w-5 h-5 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 opacity-90 blur-[0.2px]"></div>
            <div className="absolute -right-0.5 w-5 h-5 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-400 mix-blend-screen opacity-90 blur-[0.2px]"></div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-sans font-black text-xs text-white tracking-tight">PocketOption</span>
            <span className="font-mono text-[8px] text-slate-400 mt-0.5 uppercase tracking-wider">Lobby Terminal</span>
          </div>
        </div>

        {/* Middle/Center Block: Interactive Real/Demo ledger switcher (optimized for mobile size limits) */}
        <div id="account-switcher-pill" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-0.5 sm:p-1 flex items-center gap-1 shadow-md">
          {/* Demo Button */}
          <button
            id="switch-demo-btn"
            onClick={() => setIsDemo(true)}
            className={`px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
              isDemo 
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20 shadow-inner' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <RefreshCw size={9} className={`sm:w-[11px] sm:h-[11px] ${isDemo ? 'animate-spin text-amber-300' : ''}`} />
            <span className="hidden xs:inline">Demo:</span> ${demoBalance.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
          </button>

          {/* Real Button */}
          <button
            id="switch-real-btn"
            onClick={() => setIsDemo(false)}
            className={`px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
              !isDemo 
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 shadow-inner' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Coins size={9} className="sm:w-[11px] sm:h-[11px] text-emerald-300" />
            <span className="hidden xs:inline">Real:</span> ${realBalance.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
          </button>
        </div>

        {/* Right Side: Quick actions & Logout shortcut */}
        <div id="topbar-actions" className="flex items-center gap-1.5">
          {/* Cashier deposit shortcut */}
          <button
            id="header-deposit-btn"
            onClick={() => setActiveTab('cashier')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-sans font-bold text-[10px] sm:text-xs py-1.5 sm:py-2 px-2.5 sm:px-4 rounded-xl shadow-lg shadow-blue-600/20 cursor-pointer transition-all flex items-center gap-1"
          >
            <Plus size={11} className="sm:w-[14px] sm:h-[14px] stroke-[3]" />
            <span>Deposit</span>
          </button>

          {/* Support chat toggle */}
          <button
            id="header-chat-btn"
            onClick={() => setIsSupportOpen(true)}
            className="p-1.5 sm:p-2 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white rounded-xl bg-white/5 backdrop-blur-md cursor-pointer transition-all"
            title="Advisors desk"
          >
            <Bell size={14} className="sm:w-[16px] sm:h-[16px] text-amber-400 animate-pulse" />
          </button>

          {/* Core Logout shortcut */}
          <button
            id="header-logout-btn"
            onClick={handleLogout}
            className="p-1.5 sm:p-2 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 rounded-xl bg-white/5 backdrop-blur-md cursor-pointer transition-all"
            title="Sign out securely"
          >
            <LogOut size={14} className="sm:w-[16px] sm:h-[16px]" />
          </button>
        </div>

      </header>

      {/* 2. BODY CONTENT (Sidebar + Central tab canvas) */}
      <div id="pocket-trade-body" className="flex-1 flex overflow-hidden min-h-0 relative">
        
        {/* Sidebar Component: Hidden dynamically on phone and tablet views (<768px/md) */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          userProfile={{
            name: userProfile.name,
            status: userProfile.status,
            isDemo
          }}
        />

        {/* Central active screen viewport */}
        <main id="active-tab-canvas" className="flex-1 flex flex-col overflow-hidden min-h-0 relative bg-transparent">
          {renderActiveTabContent()}
        </main>

        {/* Global technical support drawer */}
        <SupportChat 
          isOpen={isSupportOpen} 
          onClose={() => setIsSupportOpen(false)} 
          userProfile={userProfile}
        />

        {/* Dynamic visual push notification HUD */}
        {toastMessage && (
          <div 
            id="notification-toast-hud" 
            className={`fixed bottom-20 md:bottom-6 right-6 p-4 rounded-2xl border flex items-start gap-3 shadow-2xl animate-slide-in z-50 max-w-sm ${
              toastMessage.type === 'win' 
                ? 'bg-emerald-950/90 backdrop-blur-md border-emerald-500/30 text-emerald-300 shadow-emerald-500/10' 
                : toastMessage.type === 'loss'
                ? 'bg-rose-950/90 backdrop-blur-md border-rose-500/30 text-rose-300 shadow-rose-500/10'
                : 'bg-slate-900/95 backdrop-blur-md border-white/10 text-amber-300 shadow-amber-500/10'
            }`}
          >
            <div className="flex-1 flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-teal-300">SYSTEM NOTIFICATION</span>
              <p className="text-xs font-sans leading-relaxed text-slate-100">{toastMessage.text}</p>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>
        )}

      </div>

      {/* 3. ADAPTIVE MOBILE BOTTOM NAVIGATION: Displayed exclusively on screen widths under 768px (md) */}
      <div id="mobile-navigation-bar" className="md:hidden h-16 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-2 select-none z-30 shrink-0">
        {bottomNavItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 relative transition-all cursor-pointer ${
                isActive ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <IconComponent size={18} className={isActive ? 'scale-110 text-blue-400 transition-transform' : 'text-slate-400'} />
              <span className="text-[9px] font-sans tracking-tight mt-1">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. IMMERSIVE NATIVE APP TRADING OVERLAY (Exclusively for screen widths under md when market is active!) */}
      {isMarketLiveMode && (
        <div id="immersive-mobile-trading-overlay" className="md:hidden absolute inset-0 bg-[#06080F] z-50 flex flex-col overflow-hidden animate-fade-in text-white select-none">
          {/* Custom Upper Taskbar Header */}
          <div className="h-[56px] border-b border-white/5 bg-slate-950/80 px-4 flex items-center justify-between shrink-0 relative">
            <div className="flex items-center gap-2 min-w-0">
              <button 
                type="button"
                onClick={() => setIsMarketLiveMode(false)}
                className="text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer py-1.5 px-2.5 bg-white/5 border border-white/5 rounded-lg active:scale-95 transition-all text-xs outline-none"
              >
                ← Back
              </button>
              
              <button 
                type="button"
                onClick={() => setShowAssetSelector(!showAssetSelector)}
                className="flex items-center gap-1.5 ml-2 py-1 px-2 rounded-xl bg-blue-500/15 border border-blue-500/25 cursor-pointer active:scale-95 hover:bg-blue-500/20 transition-all text-left truncate max-w-[155px]"
              >
                {renderAssetIcon(activeAsset.id)}
                <span className="font-sans font-bold text-xs text-blue-300 truncate">{activeAsset.name}</span>
                <span className="font-mono text-[9px] font-black text-[#10b981] bg-emerald-500/15 px-1 py-0.5 rounded border border-emerald-500/10">
                  {activeAsset.payoutPct}%
                </span>
                <ChevronDown size={10} className="text-slate-400 shrink-0 ml-0.5" />
              </button>
            </div>

            {/* Balanced Account Active Balance Indicator in Top Bar */}
            <div id="immersive-mobile-active-balance" className="flex flex-col items-center justify-center font-mono select-none px-2 shrink-0">
              <span className="text-[9px] text-slate-400 uppercase font-sans tracking-wider leading-none">Balance</span>
              <span className={`text-xs xs:text-sm font-black mt-0.5 ${isDemo ? 'text-amber-400' : 'text-emerald-400'}`}>
                ${isDemo 
                  ? demoBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                  : realBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 shrink-0 bg-transparent border-none p-0 outline-none cursor-pointer focus:outline-none hover:opacity-85 active:scale-95 transition-all text-left"
              title="View your Account Profile"
            >
              <span className="text-[9px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded uppercase font-bold select-none">
                {isDemo ? 'Demo' : 'Real'}
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                activeTab === 'profile' 
                  ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                  : 'bg-slate-800 border-white/10'
              }`}>
                <Users size={14} className={activeTab === 'profile' ? "text-blue-300 animate-pulse" : "text-blue-400"} />
              </div>
            </button>

            {/* Floated Assets registry panel for Mobile Mode */}
            {showAssetSelector && (
              <div id="assets-registry-dropdown-mobile" className="absolute top-[52px] left-4 w-[calc(100vw-32px)] bg-[#0c101b]/98 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 overflow-hidden py-1 animate-fade-in divide-y divide-white/5 font-sans">
                {/* Category Switcher Row */}
                <div className="px-2 py-1.5 bg-[#0a0d17] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                  {[
                    { id: 'all', label: 'All', icon: '⭐' },
                    { id: 'crypto', label: 'Crypto', icon: '🪙' },
                    { id: 'currencies', label: 'Currencies', icon: '💵' },
                    { id: 'stocks', label: 'Indices', icon: '📈' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedAssetCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                        selectedAssetCategory === cat.id
                          ? 'bg-[#2563eb] text-white font-black scale-105'
                          : 'bg-[#121725] text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                {/* Headings Row */}
                <div className="px-3.5 py-2 bg-[#06080e] grid grid-cols-[1.5fr_1fr_1fr] text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">
                  <span>Asset</span>
                  <span className="text-right flex items-center justify-end gap-0.5">
                    Profit <Info className="w-2.5 h-2.5 text-slate-400 hover:text-white" />
                  </span>
                  <span className="text-right text-[#34d399] underline decoration-dotted">VIP</span>
                </div>

                {/* Asset Scroll Container */}
                <div className="max-h-[220px] overflow-y-auto no-scrollbar divide-y divide-white/5 bg-[#0a0e17]">
                  {assets.filter(ast => {
                    const matchesSearch = ast.name.toLowerCase().includes(searchTerm.toLowerCase()) || ast.id.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesCat = selectedAssetCategory === 'all' || ast.type === selectedAssetCategory;
                    return matchesSearch && matchesCat;
                  }).map((ast) => {
                    const isCurrent = activeAsset.id === ast.id;
                    return (
                      <button
                        key={ast.id}
                        type="button"
                        id={`asset-option-mobile-${ast.id}`}
                        onClick={() => {
                          setActiveAsset(ast);
                          setShowAssetSelector(false);
                        }}
                        className={`w-full grid grid-cols-[1.5fr_1fr_1fr] items-center px-3.5 py-2 hover:bg-[#121725] transition-colors text-left cursor-pointer ${
                          isCurrent ? 'bg-[#1e293b]/55 border-l-2 border-blue-500 text-white font-bold' : ''
                        }`}
                      >
                        {/* Left column - Icon & Name */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          {renderAssetIcon(ast.id)}
                          <div className="flex flex-col min-w-0">
                            <span className={`font-sans font-bold text-xs truncate ${isCurrent ? 'text-blue-400 font-black' : 'text-slate-100'}`}>
                              {ast.name}
                            </span>
                            <span className="font-mono text-[9px] text-slate-450 mt-0.5 whitespace-nowrap">
                              {ast.type} • ${ast.currentPrice.toLocaleString(undefined, { minimumFractionDigits: ast.type === 'currencies' ? 4 : 2, maximumFractionDigits: ast.type === 'currencies' ? 4 : 2 })}
                            </span>
                          </div>
                        </div>

                        {/* Middle Column - Standard Profit */}
                        <div className="text-right flex flex-col items-end pr-2">
                          <span className="font-mono text-xs font-black text-[#10b981]">
                            {ast.payoutPct}%
                          </span>
                        </div>

                        {/* Right Column - VIP Profit */}
                        <div className="text-right flex flex-col items-end pr-1">
                          <span className="font-mono text-xs font-black text-[#34d399] bg-[#34d399]/10 px-1.5 py-0.5 rounded border border-[#34d399]/15">
                            {ast.vipPayoutPct || (ast.payoutPct + 2)}%
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Core full bleed chart view */}
          <div className="flex-1 min-h-0 relative flex flex-col">
            <ChartArea 
              activeAsset={activeAsset} 
              activeTrades={activeTrades} 
              chartType={chartType} 
              setChartType={setChartType}
              isMarketLiveMode={isMarketLiveMode}
              setIsMarketLiveMode={setIsMarketLiveMode}
            />
          </div>

          {/* Execution mobile desk at bottom */}
          <div className="p-4 bg-slate-950 border-t border-white/5 shrink-0 flex flex-col gap-3">
            
            {/* Input fields row - Time & Amount */}
            <div className="grid grid-cols-2 gap-3">
              {/* Time input */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-2 flex items-center justify-between text-xs font-mono relative">
                <button 
                  onClick={() => setMobileDuration(prev => Math.max(15, prev - 15))}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-slate-300 active:scale-90 transition-transform cursor-pointer"
                >
                  −
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-slate-400 font-sans uppercase">Duration</span>
                  <span className="font-bold text-white mt-0.5">{mobileDuration}s</span>
                </div>
                <button 
                  onClick={() => setMobileDuration(prev => Math.min(300, prev + 15))}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-slate-300 active:scale-90 transition-transform cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Amount input */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-2 flex items-center justify-between text-xs font-mono relative">
                <button 
                  onClick={() => setMobileAmount(prev => Math.max(10, prev - 10))}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-slate-300 active:scale-90 transition-transform cursor-pointer"
                >
                  −
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-slate-400 font-sans uppercase">Investment</span>
                  <span className="font-bold text-amber-400 mt-0.5">kS{mobileAmount}</span>
                </div>
                <button 
                  onClick={() => setMobileAmount(prev => Math.min(2000, prev + 50))}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-slate-300 active:scale-90 transition-transform cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Projected payout row */}
            <div className="flex items-center justify-between px-2 text-xs">
              <span className="text-slate-400 font-sans">Payout earnings yield ({activeAsset.payoutPct}%)</span>
              <span className="font-mono font-bold text-[#10b981]">
                +kS{(mobileAmount * (1 + activeAsset.payoutPct / 100)).toFixed(1)}
              </span>
            </div>

            {/* Big Green Higher & Red Lower Buttons (BUY / SELL triggers matching the second photo!) */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  const currentBal = isDemo ? demoBalance : realBalance;
                  if (mobileAmount > currentBal) {
                    setToastMessage({
                      id: 'warning-' + Date.now(),
                      text: `Insufficient Sim funds to option kS${mobileAmount}! Recharge balance.`,
                      type: 'loss'
                    });
                    return;
                  }
                  handlePlaceTrade('up', mobileAmount, mobileDuration);
                  setToastMessage({
                    id: 'placed-' + Date.now(),
                    text: `CALL option placed on ${activeAsset.name} for kS${mobileAmount}!`,
                    type: 'win'
                  });
                }}
                className="py-3 bg-[#10b981] hover:bg-[#34d399] active:bg-[#059669] text-white font-sans font-black uppercase text-center rounded-2xl flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-emerald-500/15 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all text-xs"
              >
                <span>HIGHER ↑</span>
                <span className="text-[10px] opacity-90 font-mono font-bold">+$80 Est.</span>
              </button>

              <button 
                onClick={() => {
                  const currentBal = isDemo ? demoBalance : realBalance;
                  if (mobileAmount > currentBal) {
                    setToastMessage({
                      id: 'warning-' + Date.now(),
                      text: `Insufficient Sim funds to option kS${mobileAmount}! Recharge balance.`,
                      type: 'loss'
                    });
                    return;
                  }
                  handlePlaceTrade('down', mobileAmount, mobileDuration);
                  setToastMessage({
                    id: 'placed-' + Date.now(),
                    text: `PUT option placed on ${activeAsset.name} for kS${mobileAmount}!`,
                    type: 'win'
                  });
                }}
                className="py-3 bg-[#f43f5e] hover:bg-[#f87171] active:bg-[#e11d48] text-white font-sans font-black uppercase text-center rounded-2xl flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-rose-500/15 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all text-xs"
              >
                <span>LOWER ↓</span>
                <span className="text-[10px] opacity-90 font-mono font-bold">+$80 Est.</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
