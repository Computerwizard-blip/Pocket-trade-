/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  RefreshCw,
  Coins
} from 'lucide-react';
import { Asset, TradeType } from '../types';

interface OrderFormProps {
  activeAsset: Asset;
  isDemo: boolean;
  currentBalance: number;
  onPlaceTrade: (type: TradeType, amount: number, durationSeconds: number) => void;
  onResetDemo: () => void;
}

export default function OrderForm({
  activeAsset,
  isDemo,
  currentBalance,
  onPlaceTrade,
  onResetDemo
}: OrderFormProps) {
  const [amount, setAmount] = useState<number>(100);
  const [duration, setDuration] = useState<number>(30); // in seconds
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successPulse, setSuccessPulse] = useState<boolean>(false);

  const increments = [10, 20, 50, 100, 200, 500];

  const handleSubmit = (type: TradeType) => {
    setErrorMsg(null);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg('Please enter a valid trade amount.');
      return;
    }
    if (amount > currentBalance) {
      setErrorMsg(`Insufficient ${isDemo ? 'Demo' : 'Real'} balance. Please deposit/top-up.`);
      return;
    }

    // Place the trade
    onPlaceTrade(type, amount, duration);
    setSuccessPulse(true);
    setTimeout(() => setSuccessPulse(false), 850);
  };

  const potentialPayout = amount * (1 + activeAsset.payoutPct / 100);
  const potentialProfit = amount * (activeAsset.payoutPct / 100);

  return (
    <div id="order-form-container" className="w-full lg:w-[325px] bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between backdrop-blur-xl shadow-xl select-none">
      
      {/* Expiry & Investment Config Section */}
      <div id="order-config-deck" className="flex flex-col gap-4">
        {/* Title */}
        <div id="order-header" className="flex items-center justify-between border-b border-white/10 pb-2">
          <span id="order-title-text" className="font-sans font-bold text-sm text-slate-100 tracking-tight">Setup Trade Position</span>
          <span id="order-asset-indicator" className="font-mono text-[9px] text-cyan-300 bg-blue-500/15 border border-blue-500/20 px-2 py-0.5 rounded-md uppercase font-bold">{activeAsset.type}</span>
        </div>

        {/* Investment Amount Input */}
        <div id="investment-field-grp" className="flex flex-col gap-2">
          <label id="invest-label" className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Investment Amount</span>
            <span className="font-mono text-[10px] text-slate-200 bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg flex items-center gap-1.5">
              <Coins size={11} className="text-cyan-400" />
              Bal: ${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </label>
          
          <div id="invest-input-wrapper" className="relative flex items-center">
            <span id="currency-sign" className="absolute left-3.5 font-mono text-slate-400 font-bold">$</span>
            <input 
              id="trade-amount-input"
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 rounded-xl pl-8 pr-4 py-3 font-mono text-sm font-bold text-blue-400 focus:outline-none transition-all text-left"
              placeholder="Enter amount"
            />
          </div>

          {/* Quick preset increments */}
          <div id="increment-grid" className="grid grid-cols-6 gap-1 mt-1">
            {increments.map((step) => (
              <button
                key={`preset-${step}`}
                id={`preset-btn-${step}`}
                onClick={() => setAmount(step)}
                className={`py-1.5 rounded-lg font-mono text-[11px] font-bold border transition-all cursor-pointer ${
                  amount === step 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                ${step}
              </button>
            ))}
          </div>
        </div>

        {/* Trade duration seconds */}
        <div id="duration-field-grp" className="flex flex-col gap-2 mt-1">
          <label id="duration-label" className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Clock size={13} className="text-cyan-400" />
            Expiration Period
          </label>
          <div id="durations-combo" className="grid grid-cols-5 gap-1">
            {[15, 30, 60, 120, 300].map((t) => (
              <button
                key={`dur-${t}`}
                id={`duration-btn-${t}`}
                onClick={() => setDuration(t)}
                className={`py-2 text-[11px] rounded-xl font-mono font-bold border transition-all cursor-pointer ${
                  duration === t 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {t >= 60 ? `${t / 60}m` : `${t}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Profit Multipliers Summary */}
        <div id="profit-projection-card" className="bg-white/5 rounded-xl p-3 border border-white/5 relative overflow-hidden flex flex-col gap-1 mt-1.5">
          <div id="projection-lines" className="flex items-center justify-between text-xs">
            <span id="proj-earn-label" className="text-slate-400">Profit yield ({activeAsset.payoutPct}%)</span>
            <span id="proj-earn-val" className="font-mono font-bold text-emerald-400">+{activeAsset.payoutPct}%</span>
          </div>
          <div id="payout-estimate" className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
            <span id="proj-payout-label" className="text-sm font-semibold text-slate-100">Estimated Payout</span>
            <div id="payout-digits" className="text-right">
              <div id="payout-amount" className="font-mono text-base font-black text-emerald-400">
                ${potentialPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div id="profit-only" className="font-mono text-[10px] text-slate-400">
                Net: +${potentialProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Up or Down Placement Triggers */}
      <div id="order-execution-triggers" className="flex flex-col gap-2 mt-5">
        
        {/* Dynamic validation warnings */}
        {errorMsg && (
          <div id="error-alert-banner" className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] p-2.5 rounded-xl flex items-start gap-2 animate-bounce">
            <AlertTriangle size={15} className="shrink-0 mt-0.5 text-rose-400" />
            <div className="flex flex-col gap-1">
              <span>{errorMsg}</span>
              {isDemo && (
                <button
                  id="error-reset-quick"
                  onClick={onResetDemo}
                  className="text-cyan-400 font-bold underline hover:text-cyan-300 transition-all text-left cursor-pointer"
                >
                  Click to Top-Up Demo Balance (+$5,000)
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quick Demo Recharging Hint */}
        {isDemo && currentBalance < 100 && !errorMsg && (
          <button
            id="quick-recharge-demo-banner"
            onClick={onResetDemo}
            className="bg-white/5 border border-cyan-500/20 hover:border-cyan-400/40 text-[11px] text-cyan-400 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 font-sans font-bold cursor-pointer transition-all"
          >
            <RefreshCw size={11} className="text-cyan-400 animate-spin" />
            Recharge Demo funds to K$10,000!
          </button>
        )}

        {/* Success Confirmation Animation indicator */}
        {successPulse && (
          <div id="trade-success-pulse" className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2 animate-pulse">
            <CheckCircle2 size={14} className="text-[#34d399]" />
            <span className="font-bold">Trade Position Placed Successfully!</span>
          </div>
        )}

        {/* UP Trigger Button */}
        <button
          id="btn-execute-up"
          onClick={() => handleSubmit('up')}
          className="w-full py-4 px-5 rounded-2xl bg-[#10b981] hover:bg-[#34d399] active:bg-[#059669] text-white font-sans font-bold text-center flex items-center justify-between shadow-lg shadow-emerald-500/10 group cursor-pointer hover:scale-[1.01] active:scale-100 transition-all"
        >
          <div className="flex flex-col items-start leading-none gap-0.5 font-sans">
            <span id="btn-up-header" className="text-[11px] font-mono font-bold tracking-widest text-[#d1fae5]/80 uppercase">HIGHER (UP)</span>
            <span id="btn-up-amount" className="text-lg font-extrabold">+$80 Est.</span>
          </div>
          <ArrowUpCircle size={28} className="text-[#d1fae5] group-hover:translate-y-[-2px] transition-transform" />
        </button>

        {/* DOWN Trigger Button */}
        <button
          id="btn-execute-down"
          onClick={() => handleSubmit('down')}
          className="w-full py-4 px-5 rounded-2xl bg-[#f43f5e] hover:bg-[#f87171] active:bg-[#e11d48] text-white font-sans font-bold text-center flex items-center justify-between shadow-lg shadow-rose-500/10 group cursor-pointer hover:scale-[1.01] active:scale-100 transition-all"
        >
          <div className="flex flex-col items-start leading-none gap-0.5 font-sans">
            <span id="btn-down-header" className="text-[11px] font-mono font-bold tracking-widest text-[#ffe4e6]/80 uppercase">LOWER (DOWN)</span>
            <span id="btn-down-amount" className="text-lg font-extrabold">+$80 Est.</span>
          </div>
          <ArrowDownCircle size={28} className="text-[#ffe4e6] group-hover:translate-y-[2px] transition-transform" />
        </button>

        {/* Disclaimer Legal footnote */}
        <p id="trading-disclaimer text" className="text-[10px] text-slate-500 text-center leading-normal mt-1.5">
          {isDemo ? (
            "Virtual trading simulator. All values represent dynamic algorithm ticks. No capital under risk."
          ) : (
            <span className="text-rose-450 font-bold tracking-tight">
              ⚠️ Real trading account involving real capital under risk. Fully active trades.
            </span>
          )}
        </p>
      </div>

    </div>
  );
}
