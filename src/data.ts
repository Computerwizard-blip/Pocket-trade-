/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Asset, EconomicEvent, TopTrader, TradingStrategy, Transaction } from './types';

// Pre-fill user details based on video context
export const USER_PROFILE_DEFAULT = {
  name: 'Francis Kamau',
  email: 'francypendy@gmail.com',
  phone: '+254 748 480904',
  id: '176866819',
  status: 'Standard' as 'Standard' | 'Gold' | 'VIP',
  demoBalance: 50.12, // From exact video starting state
  realBalance: 84.30, // From exact video starting state
};

// Realistic initial lists of assets with base prices
export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'crypto_idx',
    name: 'Crypto IDX',
    type: 'crypto',
    payoutPct: 83,
    vipPayoutPct: 85,
    currentPrice: 641.867,
    lastPrices: Array.from({ length: 250 }, (_, i) => 641.5 + Math.sin(i / 5) * 0.15 + (Math.random() - 0.5) * 0.12),
    trend: 'down',
    changePct: -1.24
  },
  {
    id: 'brazil_powerplay',
    name: 'Brazil Powerplay Index',
    type: 'stocks',
    payoutPct: 83,
    vipPayoutPct: 84,
    currentPrice: 143.148,
    lastPrices: Array.from({ length: 250 }, (_, i) => 143.0 + Math.cos(i / 6) * 0.08 + (Math.random() - 0.5) * 0.06),
    trend: 'up',
    changePct: 0.52
  },
  {
    id: 'africa_knockout',
    name: 'Africa Knockout Index',
    type: 'stocks',
    payoutPct: 83,
    vipPayoutPct: 84,
    currentPrice: 812.45,
    lastPrices: Array.from({ length: 250 }, (_, i) => 811.2 + Math.sin(i / 4) * 0.5 + (Math.random() - 0.5) * 0.45),
    trend: 'up',
    changePct: 0.61
  },
  {
    id: 'latam_power',
    name: 'LatAm Power Index',
    type: 'stocks',
    payoutPct: 83,
    vipPayoutPct: 84,
    currentPrice: 342.10,
    lastPrices: Array.from({ length: 250 }, (_, i) => 341.5 + Math.sin(i / 5) * 0.22 + (Math.random() - 0.5) * 0.18),
    trend: 'down',
    changePct: -0.35
  },
  {
    id: 'asia_matchpoint',
    name: 'Asia Matchpoint Index',
    type: 'stocks',
    payoutPct: 83,
    vipPayoutPct: 84,
    currentPrice: 1204.50,
    lastPrices: Array.from({ length: 250 }, (_, i) => 1202.0 + Math.cos(i / 6) * 0.75 + (Math.random() - 0.5) * 0.55),
    trend: 'up',
    changePct: 0.79
  },
  {
    id: 'egypt_tempo',
    name: 'Egypt Tempo Index',
    type: 'stocks',
    payoutPct: 83,
    vipPayoutPct: 84,
    currentPrice: 456.90,
    lastPrices: Array.from({ length: 250 }, (_, i) => 455.8 + Math.sin(i / 3) * 0.35 + (Math.random() - 0.5) * 0.28),
    trend: 'up',
    changePct: 0.44
  },
  {
    id: 'eur_usd',
    name: 'EUR/USD',
    type: 'currencies',
    payoutPct: 80,
    vipPayoutPct: 82,
    currentPrice: 1.08450,
    lastPrices: Array.from({ length: 250 }, (_, i) => 1.083 + Math.sin(i / 5) * 0.001 + (Math.random() - 0.5) * 0.0008),
    trend: 'up',
    changePct: 0.15
  },
  {
    id: 'gbp_nok',
    name: 'GBP/NOK',
    type: 'currencies',
    payoutPct: 80,
    vipPayoutPct: 82,
    currentPrice: 13.48510,
    lastPrices: Array.from({ length: 250 }, (_, i) => 13.45 + Math.sin(i / 4) * 0.015 + (Math.random() - 0.5) * 0.012),
    trend: 'down',
    changePct: -0.18
  },
  {
    id: 'aud_zar',
    name: 'AUD/ZAR',
    type: 'currencies',
    payoutPct: 80,
    vipPayoutPct: 82,
    currentPrice: 12.18430,
    lastPrices: Array.from({ length: 250 }, (_, i) => 12.15 + Math.cos(i / 6) * 0.012 + (Math.random() - 0.5) * 0.008),
    trend: 'up',
    changePct: 0.22
  },
  {
    id: 'eur_huf',
    name: 'EUR/HUF',
    type: 'currencies',
    payoutPct: 80,
    vipPayoutPct: 82,
    currentPrice: 392.42000,
    lastPrices: Array.from({ length: 250 }, (_, i) => 391.8 + Math.sin(i / 5) * 0.4 + (Math.random() - 0.5) * 0.3),
    trend: 'up',
    changePct: 0.35
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin (BTC)',
    type: 'crypto',
    payoutPct: 85,
    vipPayoutPct: 88,
    currentPrice: 69420.50,
    lastPrices: Array.from({ length: 250 }, (_, i) => 69000 + Math.sin(i / 3) * 45 + (Math.random() - 0.5) * 85),
    trend: 'up',
    changePct: 2.14
  },
  {
    id: 'ethereum',
    name: 'Ethereum (ETH)',
    type: 'crypto',
    payoutPct: 80,
    vipPayoutPct: 83,
    currentPrice: 3500.00,
    lastPrices: Array.from({ length: 250 }, (_, i) => 3480 + Math.cos(i / 4) * 2.5 + (Math.random() - 0.5) * 1.8),
    trend: 'up',
    changePct: 1.45
  },
  {
    id: 'gold',
    name: 'Gold (XAU)',
    type: 'commodities',
    payoutPct: 82,
    vipPayoutPct: 85,
    currentPrice: 2342.10,
    lastPrices: Array.from({ length: 250 }, (_, i) => 2335 + Math.sin(i / 6) * 4 + (Math.random() - 0.5) * 3),
    trend: 'up',
    changePct: 0.47
  },
  {
    id: 'brent_oil',
    name: 'Brent Crude Oil',
    type: 'commodities',
    payoutPct: 78,
    vipPayoutPct: 80,
    currentPrice: 81.45,
    lastPrices: Array.from({ length: 250 }, (_, i) => 82.5 - Math.sin(i / 8) * 0.8 + (Math.random() - 0.5) * 0.4),
    trend: 'down',
    changePct: -1.15
  },
  {
    id: 'apple',
    name: 'Apple Inc.',
    type: 'stocks',
    payoutPct: 80,
    vipPayoutPct: 83,
    currentPrice: 194.25,
    lastPrices: Array.from({ length: 250 }, (_, i) => 193 + Math.sin(i / 5) * 1.2 + (Math.random() - 0.5) * 0.6),
    trend: 'up',
    changePct: 0.72
  }
];

// Replaced any typos with precise fields
INITIAL_ASSETS.forEach(a => {
  if (!(a as any).changePct && (a as any).ChangePct) {
    a.changePct = (a as any).ChangePct;
  }
});

// Mock Economic Calendar Events reflecting exact video entries
export const ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'ev1',
    title: "ECB's President Lagarde speech",
    country: 'EUR',
    timeUTC: '00:00:45',
    impact: 'high',
    forecast: '-',
    previous: '-',
    importance: 'Important'
  },
  {
    id: 'ev2',
    title: 'European Council Meeting',
    country: 'EUR',
    timeUTC: '07:30:00',
    impact: 'high',
    forecast: '-',
    previous: '-',
    importance: 'Important'
  },
  {
    id: 'ev3',
    title: 'Consumer Price Index ex Food & Energy (YoY)',
    country: 'USD',
    timeUTC: 'Tomorrow',
    impact: 'high',
    forecast: '3.4%',
    previous: '3.6%',
    importance: 'Important'
  },
  {
    id: 'ev4',
    title: 'BoC Interest Rate Decision',
    country: 'CAD',
    timeUTC: 'Tomorrow',
    impact: 'high',
    forecast: '4.75%',
    previous: '5.00%',
    importance: 'Important'
  },
  {
    id: 'ev5',
    title: 'BoC Press Conference',
    country: 'CAD',
    timeUTC: 'Tomorrow',
    impact: 'medium',
    forecast: '-',
    previous: '-',
    importance: 'Normal'
  },
  {
    id: 'ev6',
    title: 'ECB Rate On Deposit Facility',
    country: 'EUR',
    timeUTC: '11 Jun 2026',
    impact: 'high',
    forecast: '3.75%',
    previous: '4.00%',
    importance: 'Important'
  }
];

// Top traders leaderboard. Some from Kenya, some international, allowing realistic interactive copy trades.
export const TOP_TRADERS: TopTrader[] = [
  {
    rank: 1,
    name: 'Wycliffe Ochieng',
    country: 'KE',
    totalTrades: 1482,
    winRate: 88.4,
    profit: 14120.50,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isCopied: false,
    statusText: '⚡ Custom Scalping strategy active.'
  },
  {
    rank: 2,
    name: 'Elena Rostova',
    country: 'RU',
    totalTrades: 1251,
    winRate: 85.1,
    profit: 9150.00,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    isCopied: false,
    statusText: '📈 Trend follower on EUR/USD IDX.'
  },
  {
    rank: 3,
    name: 'Njuguna Ndung\'u',
    country: 'KE',
    totalTrades: 942,
    winRate: 82.9,
    profit: 7840.40,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isCopied: false,
    statusText: '🎯 60s High-speed scalper.'
  },
  {
    rank: 4,
    name: 'Marcus Sterling',
    country: 'UK',
    totalTrades: 810,
    winRate: 81.3,
    profit: 6310.00,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    isCopied: false,
    statusText: '📊 Volatility expert on Stocks.'
  },
  {
    rank: 5,
    name: 'Sarah Mwangi',
    country: 'KE',
    totalTrades: 753,
    winRate: 79.8,
    profit: 4890.20,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isCopied: false,
    statusText: '🔮 Pivot indicator user.'
  }
];

// Strategy tutorials
export const TRADING_STRATEGIES: TradingStrategy[] = [
  {
    id: 'strat1',
    title: 'Fractal Reversal',
    timeframe: '1m / 5m',
    difficulty: 'Intermediate',
    winRateGoal: 83,
    description: 'Finds local trend peaks and troughs using 5-bar clusters. Signals an imminent trend reversal.',
    instructions: [
      'Locate a 5-bar sequence where the middle bar has the overall highest high (Up Fractal) or lowest low (Down Fractal).',
      'An Up Fractal indicates resistance is met. Prepare to open a DOWN trade.',
      'A Down Fractal indicates support is found. Prepare to open an UP trade.',
      'Confirm with RSI below 30 (for oversold) or above 70 (for overbought).'
    ],
    indicatorTags: ['Fractals Indicator', 'RSI Filter']
  },
  {
    id: 'strat2',
    title: '60 Seconds Speed Scalping',
    timeframe: '5s / 15s',
    difficulty: 'Beginner',
    winRateGoal: 78,
    description: 'High-speed strategy designed for ultra-fast expiration ticks in highly active markets like Crypto IDX.',
    instructions: [
      'Set your chart view window to 5s or 15s ticks.',
      'Monitor the micro-cycles of the asset. Wait for 4 consecutive candles in one direction.',
      'On the 5th candle, execute a trade in the opposite direction pointing at minor mean-reversion.',
      'Profit immediately on the 60-second micro-bounce.'
    ],
    indicatorTags: ['High Candlestick Count', 'MACD Scalp']
  },
  {
    id: 'strat3',
    title: 'EMA Moving Average Cross',
    timeframe: '1m / 15m',
    difficulty: 'Advanced',
    winRateGoal: 86,
    description: 'Gold-standard momentum tracker identifying major structural trend entry points using exponential moving averages.',
    instructions: [
      'Enable the Fast EMA (9 periods) and Slow EMA (21 periods) on the dashboard.',
      'When the Fast EMA crosses above the Slow EMA, momentum is positive. Enter an UP trade with a 2-minute expiration.',
      'When the Fast EMA crosses below the Slow EMA, momentum is negative. Enter a DOWN trade.',
      'Avoid trading during flat consolidation ranges without trend lines.'
    ],
    indicatorTags: ['EMA-9', 'EMA-21', 'Aroon Oscillator']
  }
];

// Initial Transaction Ledger reflecting video context (K$700 M-Pesa transactions etc.)
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    type: 'deposit',
    amount: 700.00,
    method: 'M-PESA',
    status: 'Completed',
    createdAt: 'May 30, 2026, 11:04 PM',
    phoneOrWallet: '+254 748 480904',
    referenceId: '254748480904',
    remarks: 'Instant direct deposit loaded.'
  },
  {
    id: 'tx2',
    type: 'deposit',
    amount: 1200.00,
    method: 'M-PESA',
    status: 'Rejected',
    createdAt: 'May 30, 2026, 10:52 PM',
    phoneOrWallet: '+254 748 480904',
    referenceId: '254748480904',
    remarks: 'Declined by carrier: Insufficient mobile funds.'
  },
  {
    id: 'tx3',
    type: 'deposit',
    amount: 2000.00,
    method: 'M-PESA',
    status: 'Completed',
    createdAt: 'May 30, 2026, 10:49 PM',
    phoneOrWallet: '+254 748 480904',
    referenceId: '254748480904',
    remarks: 'Direct loading successful.'
  },
  {
    id: 'tx4',
    type: 'withdrawal',
    amount: 760.00,
    method: 'M-PESA',
    status: 'Completed',
    createdAt: 'May 28, 2026, 04:15 PM',
    phoneOrWallet: '+254 748 480904',
    referenceId: '254748480904',
    remarks: 'Direct payout verified.'
  }
];
