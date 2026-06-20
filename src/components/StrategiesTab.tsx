/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Layers, 
  Target, 
  TrendingUp, 
  CornerDownRight, 
  Trophy, 
  Sparkles, 
  Gift, 
  Flame, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { TradingStrategy } from '../types';
import { TRADING_STRATEGIES } from '../data';

interface StrategiesTabProps {
  onUpdateBalance: (amountToAdd: number) => void;
  onAddTransaction: (tx: any) => void;
}

export default function StrategiesTab({ onUpdateBalance, onAddTransaction }: StrategiesTabProps) {
  const [promoCode, setPromoCode] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'WELCOME100') {
      onUpdateBalance(1000);
      const newTx = {
        id: 'tx_promo_' + Math.floor(Math.random() * 100000),
        type: 'deposit',
        amount: 1000,
        method: 'Promo Code WELCOME100',
        status: 'Completed',
        createdAt: new Date().toLocaleString(),
        referenceId: 'WELC100',
        remarks: 'Direct live account promotion voucher.'
      };
      onAddTransaction(newTx);
      setSuccessMsg('Congratulations! WELCOME100 has been redeemed for +$1,000 credit!');
      setPromoCode('');
    } else if (code === 'POCKETGOLD') {
      onUpdateBalance(500);
      const newTx = {
        id: 'tx_promo_' + Math.floor(Math.random() * 100000),
        type: 'deposit',
        amount: 500,
        method: 'Promo Code POCKETGOLD',
        status: 'Completed',
        createdAt: new Date().toLocaleString(),
        referenceId: 'PKTGOLD',
        remarks: 'Redeemed weekly options bonus credit.'
      };
      onAddTransaction(newTx);
      setSuccessMsg('Success! Code POCKETGOLD redeemed for +$500 free options credit!');
      setPromoCode('');
    } else {
      setErrorMsg('Invalid or expired promotional code. Please try again.');
    }
  };

  return (
    <div id="strategies-root" className="w-full flex flex-col gap-5 animate-fade-in select-none">
      
      {/* Promotion codes console */}
      <div id="promo-claims-deck" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center shadow-xl">
        <div className="lg:col-span-7 flex flex-col gap-2">
          <span className="text-[10px] bg-blue-500/15 text-blue-300 border border-blue-500/30 font-mono font-bold py-1 px-2.5 rounded-full uppercase w-max flex items-center gap-1.5 leading-none">
            <Gift size={11} className="" />
            Promo Ledger Voucher Code
          </span>
          <h2 className="font-sans font-black text-lg md:text-xl text-white tracking-tight">Claim Options Voucher Bonuses</h2>
          <p className="font-sans text-xs text-slate-300 leading-normal">
            Input active Pocket Trade promo codes below to instantly credit active options credits onto your wallet balance. Standard user codes: <span className="text-blue-300 font-mono font-bold">WELCOME100</span> ($1,000) or <span className="text-blue-300 font-mono font-bold">POCKETGOLD</span> ($500).
          </p>
        </div>

        {/* Claim inputs */}
        <form onSubmit={handlePromoSubmit} className="lg:col-span-5 flex flex-col gap-2 bg-white/5 p-4 rounded-xl border border-white/10 w-full shadow-inner">
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs uppercase text-blue-300 focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="ENTER PROMO CODE"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-sans font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              Redeem
            </button>
          </div>

          {successMsg && (
            <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-1 leading-none">
              <CheckCircle2 size={13} />
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 mt-1 leading-none">
              <AlertCircle size={13} />
              {errorMsg}
            </div>
          )}
        </form>
      </div>

      {/* Strategy Tutorials list */}
      <div id="strategies-deck" className="flex flex-col gap-4">
        <span className="text-xs text-slate-400 font-mono tracking-wider uppercase font-semibold">Pro Options Trading Blueprints</span>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRADING_STRATEGIES.map((strategy) => {
            return (
              <div 
                key={strategy.id} 
                id={`strat-card-${strategy.id}`}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/30 transition-all relative overflow-hidden group shadow-xl"
              >
                {/* Visual glow indicator */}
                <span className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-tr from-blue-500/10 to-transparent blur-xl"></span>

                <div className="flex flex-col gap-3">
                  {/* Top card parameters */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-blue-300 font-bold bg-blue-500/15 border border-blue-500/20 px-2.5 py-0.5 rounded uppercase">
                      {strategy.difficulty}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                      <Target size={11} className="text-slate-500" />
                      Win Rate Goal: {strategy.winRateGoal}%
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div className="flex flex-col leading-none">
                    <h3 className="font-sans font-bold text-base text-white mt-1 group-hover:text-blue-300 transition-colors">{strategy.title}</h3>
                    <span className="text-[10px] text-slate-500 font-mono mt-1.5 flex items-center gap-1">Timeframe window: {strategy.timeframe}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{strategy.description}</p>

                  {/* Bullet steps detailed instructions */}
                  <div id="steps-box" className="mt-2.5 flex flex-col gap-2 border-t border-white/10 pt-3">
                    <span className="text-[9px] font-sans uppercase tracking-widest text-blue-400 font-extrabold leading-none">Standard Directives:</span>
                    <div className="flex flex-col gap-1.5">
                      {strategy.instructions.map((ins, idx) => (
                        <div key={`idx-${idx}`} className="flex items-start gap-1 leading-normal">
                          <span className="font-mono text-[10px] font-bold text-blue-400 shrink-0 select-none mt-0.5">{idx + 1}.</span>
                          <span className="text-[11px] text-slate-300 font-sans">{ins}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sub Indicator labels */}
                <div className="flex flex-wrap gap-1 mt-4 border-t border-white/10 pt-3">
                  {strategy.indicatorTags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
