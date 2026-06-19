/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Asset {
  id: string;
  name: string;
  type: 'crypto' | 'currencies' | 'commodities' | 'stocks';
  payoutPct: number;
  vipPayoutPct?: number; 
  currentPrice: number;
  lastPrices: number[]; // Store a history of past ticks for charting
  trend: 'up' | 'down';
  changePct: number;
  dailyHigh?: number;
  dailyLow?: number;
  volume?: number;
}

export type TradeType = 'up' | 'down';

export interface Trade {
  id: string;
  assetId: string;
  assetName: string;
  strikePrice: number;
  type: TradeType;
  amount: number;
  potentialPayout: number;
  expiresAt: number; // UTC timestamp ms
  durationSeconds: number;
  status: 'pending' | 'won' | 'lost';
  isDemo: boolean;
  closePrice?: number;
  createdAt: number; // UTC timestamp ms
}

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  timeUTC: string;
  impact: 'high' | 'medium' | 'low';
  forecast: string;
  previous: string;
  actual?: string;
  importance: 'Important' | 'Normal';
}

export interface TopTrader {
  rank: number;
  name: string;
  country: string;
  totalTrades: number;
  winRate: number; // percentage
  profit: number; // currency amount
  avatarUrl: string;
  isCopied: boolean;
  statusText?: string;
}

export type TransactionStatus = 'Created' | 'Pending' | 'Completed' | 'Rejected';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  method: string;
  status: TransactionStatus;
  createdAt: string;
  phoneOrWallet?: string;
  referenceId: string;
  remarks?: string;
}

export interface TradingStrategy {
  id: string;
  title: string;
  timeframe: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  winRateGoal: number; // e.g. 78%
  description: string;
  instructions: string[];
  indicatorTags: string[];
}
