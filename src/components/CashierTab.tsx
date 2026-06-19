/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CreditCard, 
  Wallet, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search,
  MessageSquare,
  Copy,
  TrendingUp,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';
import { Transaction, TransactionStatus } from '../types';

interface CashierTabProps {
  currentBalance: number;
  isDemo: boolean;
  transactions: Transaction[];
  onAddTransaction: (tx: Transaction) => void;
  onUpdateBalance: (amountToAdd: number) => void;
  onOpenSupport: () => void;
}

export default function CashierTab({
  currentBalance,
  isDemo,
  transactions,
  onAddTransaction,
  onUpdateBalance,
  onOpenSupport
}: CashierTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [payMethod, setPayMethod] = useState<'mpesa' | 'card' | 'crypto'>('mpesa');
  
  // Deposit Fields
  const [depositAmount, setDepositAmount] = useState<string>('700');
  const [phoneNumber, setPhoneNumber] = useState<string>('+254 748 480904');
  const [cardNumber, setCardNumber] = useState<string>('4342 9874 1254 9081');
  const [bonusCode, setBonusCode] = useState<string>('');
  
  // Withdrawal Fields
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('Francis');
  const [lastName, setLastName] = useState<string>('Kamau');
  const [walletPhone, setWalletPhone] = useState<string>('+254 748 480904');
  
  // Local success indicators
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const presets = ['300', '700', '1500', '3000', '5000', '10000'];

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const amountNum = parseFloat(depositAmount);
    if (isNaN(amountNum) || amountNum < 300) {
      setErrorMessage('Minimum deposit amount is K$300.');
      return;
    }

    if (payMethod === 'mpesa' && !phoneNumber.trim()) {
      setErrorMessage('Please specify an M-PESA active phone number.');
      return;
    }

    // Process Simulated deposit
    let finalAmountAdded = amountNum;
    let remarksText = 'M-PESA direct simulated deposit.';
    if (bonusCode.toUpperCase() === 'WELCOME100') {
      finalAmountAdded = amountNum * 2;
      remarksText = `Welcome double deposit boost! Loaded $${amountNum} + $${amountNum} bonus.`;
    } else if (bonusCode.toUpperCase() === 'POCKETGOLD') {
      finalAmountAdded = amountNum * 1.5;
      remarksText = `Promo code 50% deposit bonus. Loaded $${amountNum} + $${amountNum * 0.5} bonus.`;
    }

    const referenceId = payMethod === 'mpesa' 
      ? phoneNumber.replace(/\D/g, '') || '254748480904'
      : Math.floor(Math.random() * 1000000).toString();

    const newTx: Transaction = {
      id: 'tx_dep_' + Math.floor(Math.random() * 1000000),
      type: 'deposit',
      amount: amountNum,
      method: payMethod === 'mpesa' ? 'M-PESA' : payMethod === 'card' ? 'Visa/Mastercard' : 'Crypto Wallet',
      status: 'Completed',
      createdAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }),
      phoneOrWallet: payMethod === 'mpesa' ? phoneNumber : payMethod === 'card' ? 'Card Ending 9081' : 'TRC-20 USDT Wallet',
      referenceId,
      remarks: remarksText
    };

    onAddTransaction(newTx);
    onUpdateBalance(finalAmountAdded);
    
    setSuccessMessage(`Demo/Real simulated Cashier alert: Loaded $${amountNum.toLocaleString()} successfully to wallet!`);
    if (bonusCode) {
      setSuccessMessage(`Bonus Booster Activated! Managed deposit of $${amountNum} and credited $${finalAmountAdded} directly!`);
    }
  };

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum < 700) {
      setErrorMessage('Minimum withdrawal threshold is K$700.');
      return;
    }

    if (amountNum > currentBalance) {
      setErrorMessage('Unavailable balance. You cannot withdraw more than your current active ledger.');
      return;
    }

    if (!walletPhone.trim()) {
      setErrorMessage('Target settlement path phone or wallet address is mandatory.');
      return;
    }

    // Process Simulated withdrawal
    const referenceId = '254' + Math.floor(Math.random() * 1000000000);
    const newTx: Transaction = {
      id: 'tx_wdr_' + Math.floor(Math.random() * 1000000),
      type: 'withdrawal',
      amount: amountNum,
      method: payMethod === 'mpesa' ? 'M-PESA' : 'Crypto Address',
      status: 'Pending', // Withdrawals start as pending for structural realism
      createdAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }),
      phoneOrWallet: walletPhone,
      referenceId,
      remarks: 'Withdrawal settlement undergoing broker verifications.'
    };

    onAddTransaction(newTx);
    onUpdateBalance(-amountNum); // Deduct balance immediately
    
    setSuccessMessage(`Withdrawal Request Filed for $${amountNum}! Dynamic status is marked "Pending" showing standard 1-2 hours broker clearances.`);
    setWithdrawAmount('');
  };

  const copyRef = (refId: string) => {
    navigator.clipboard.writeText(refId);
    setCopiedId(refId);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div id="cashier-tab-root" className="w-full flex flex-col gap-4 animate-fade-in">
      
      {/* Cashier Menu Headers */}
      <div id="cashier-main-card" className="bg-[#0e1216] border border-[#1a222a] rounded-2xl overflow-hidden flex flex-col">
        {/* Sub Navigation Tabs */}
        <div id="cashier-tab-header" className="flex items-center justify-between border-b border-[#1a222a] px-4 py-2 bg-[#0a0d10]">
          <div id="cashier-tab-group" className="flex items-center gap-2">
            <button
              id="subtab-deposit"
              onClick={() => { setActiveSubTab('deposit'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`px-4 py-3 text-sm md:text-base font-sans font-black border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'deposit' 
                  ? 'border-blue-500 text-blue-400 font-extrabold select-none scale-105' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Deposit Funds
            </button>
            <button
              id="subtab-withdraw"
              onClick={() => { setActiveSubTab('withdraw'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`px-4 py-3 text-sm md:text-base font-sans font-black border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'withdraw' 
                  ? 'border-blue-500 text-blue-400 font-extrabold select-none scale-105' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Withdrawals
            </button>
            <button
              id="subtab-history"
              onClick={() => { setActiveSubTab('history'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`px-4 py-3 text-sm md:text-base font-sans font-black border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'history' 
                  ? 'border-blue-500 text-blue-400 font-extrabold select-none scale-105' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Ledger History
            </button>
          </div>

          <div id="cashier-balance-card" className="font-sans text-sm md:text-base text-blue-400 font-black px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-2 shadow-[0_0_12px_rgba(59,130,246,0.1)]">
            <Wallet size={14} className="text-blue-400" />
            <span>Balance: ${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* FEEDBACK BANNERS */}
        {successMessage && (
          <div id="cashier-success-msg" className="mx-4 mt-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3.5 rounded-xl flex items-start gap-2 animate-pulse leading-relaxed">
            <CheckCircle2 size={16} className="shrink-0 text-[#34d399] mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div id="cashier-error-msg" className="mx-4 mt-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3.5 rounded-xl flex items-start gap-2 leading-relaxed">
            <XCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. DEPOSIT PORTAL VIEW */}
        {activeSubTab === 'deposit' && (
          <div id="deposit-view" className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Preferred Payment Method selector */}
            <div id="deposit-methods-deck" className="lg:col-span-5 flex flex-col gap-3">
              <span id="gateway-label" className="text-xs text-gray-400 font-mono tracking-wider uppercase font-semibold">Select Direct Gateway</span>
              
              <button
                id="gateway-mpesa"
                onClick={() => setPayMethod('mpesa')}
                type="button"
                className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all text-left group cursor-pointer ${
                  payMethod === 'mpesa' 
                    ? 'bg-blue-500/5 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/10' 
                    : 'bg-[#151c22]/50 border-[#222e38] text-gray-300 hover:bg-[#1a232b] hover:text-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                  payMethod === 'mpesa' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-gray-400 group-hover:text-blue-400'
                }`}>
                  <Smartphone size={20} />
                </div>
                <div className="flex flex-col">
                  <span id="gateway-mpesa-title" className={`font-sans font-black ${
                    payMethod === 'mpesa' ? 'text-blue-400 text-sm md:text-base' : 'text-gray-200 text-xs md:text-sm'
                  }`}>
                    M-PESA Gateways
                  </span>
                  <span id="gateway-mpesa-desc" className="text-[10px] text-gray-400 font-mono mt-0.5">Instant • Min K$300 • Max $130,000</span>
                </div>
              </button>

              <button
                id="gateway-card"
                onClick={() => setPayMethod('card')}
                type="button"
                className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all text-left group cursor-pointer ${
                  payMethod === 'card' 
                    ? 'bg-blue-500/5 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/10' 
                    : 'bg-[#151c22]/50 border-[#222e38] text-gray-300 hover:bg-[#1a232b] hover:text-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                  payMethod === 'card' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-gray-400 group-hover:text-blue-400'
                }`}>
                  <CreditCard size={20} />
                </div>
                <div className="flex flex-col">
                  <span id="gateway-card-title" className={`font-sans font-black ${
                    payMethod === 'card' ? 'text-blue-400 text-sm md:text-base' : 'text-gray-200 text-xs md:text-sm'
                  }`}>
                    Visa / Mastercard
                  </span>
                  <span id="gateway-card-desc" className="text-[10px] text-gray-400 font-mono mt-0.5">Instant Credit • Secure PCI DSS</span>
                </div>
              </button>

              <button
                id="gateway-crypto"
                onClick={() => setPayMethod('crypto')}
                type="button"
                className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all text-left group cursor-pointer ${
                  payMethod === 'crypto' 
                    ? 'bg-blue-500/5 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/10' 
                    : 'bg-[#151c22]/50 border-[#222e38] text-gray-300 hover:bg-[#1a232b] hover:text-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                  payMethod === 'crypto' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-gray-400 group-hover:text-blue-400'
                }`}>
                  <Wallet size={20} />
                </div>
                <div className="flex flex-col">
                  <span id="gateway-crypto-title" className={`font-sans font-black ${
                    payMethod === 'crypto' ? 'text-blue-400 text-sm md:text-base' : 'text-gray-200 text-xs md:text-sm'
                  }`}>
                    USDT / Crypto Ledger
                  </span>
                  <span id="gateway-crypto-desc" className="text-[10px] text-gray-400 font-mono mt-0.5">Direct Binance Pay & ERC-20/TRC-20</span>
                </div>
              </button>
            </div>

            {/* Core Deposit form inputs */}
            <form id="deposit-interactive-form" onSubmit={handleDeposit} className="lg:col-span-7 flex flex-col gap-4 bg-[#11171d] p-5 rounded-2xl border border-[#222d38]">
              <span id="deposit-header-txt" className="text-xs font-bold text-[#f0f2f5] font-sans">Required Deposit Information</span>
              
              {/* Presets and entry fields */}
              <div id="dep-amount-grp" className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400">Specifying Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-gray-400 font-bold">$</span>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-[#151c22] border border-[#222e38] rounded-xl pl-8 pr-4 py-3 font-mono text-sm text-[#f0f2f5] focus:outline-none focus:border-amber-400"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                
                {/* Presets Grid */}
                <div className="grid grid-cols-6 gap-1 mt-1.5">
                  {presets.map(p => (
                    <button
                      key={`dep-preset-${p}`}
                      type="button"
                      onClick={() => setDepositAmount(p)}
                      className={`py-1.5 font-mono text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                        depositAmount === p 
                          ? 'bg-amber-400 border-amber-400 text-[#0b0e11]' 
                          : 'bg-[#151c22] border-[#202a33] text-gray-400 hover:text-white hover:bg-[#1a232b]'
                      }`}
                    >
                      ${p}
                    </button>
                  ))}
                </div>
              </div>

              {/* M-Pesa Gateway options */}
              {payMethod === 'mpesa' && (
                <div id="mpesa-field-details" className="flex flex-col gap-1.5 animate-fade-in">
                  <label className="text-xs text-gray-400 flex items-center justify-between">
                    <span>M-PESA Active Phone Number</span>
                    <span className="font-mono text-[10px] text-amber-500 font-medium">Automatic Push STK PIN Dialog</span>
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-[#151c22] border border-[#222e38] rounded-xl px-4 py-3 font-mono text-sm text-[#f0f2f5] focus:outline-none focus:border-amber-400"
                    placeholder="+254 7XX XXX XXX"
                    required
                  />
                </div>
              )}

              {/* Cards options */}
              {payMethod === 'card' && (
                <div id="card-field-details" className="flex flex-col gap-3 animate-fade-in">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-400">Card Number (Mock input)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#151c22] border border-[#222e38] rounded-xl px-4 py-3 font-mono text-sm text-[#f0f2f5] focus:outline-none focus:border-amber-400"
                      placeholder="XXXX XXXX XXXX XXXX"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-400">Expiry Month/Year</label>
                      <input
                        type="text"
                        defaultValue="12/29"
                        className="w-full bg-[#151c22] border border-[#222e38] rounded-xl px-4 py-3 font-mono text-sm text-[#f0f2f5] focus:outline-none focus:border-amber-400 text-center"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-400">CVC Code</label>
                      <input
                        type="password"
                        defaultValue="382"
                        className="w-full bg-[#151c22] border border-[#222e38] rounded-xl px-4 py-3 font-mono text-sm text-[#f0f2f5] focus:outline-none focus:border-amber-400 text-center"
                        placeholder="XXX"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cryptos options info panel */}
              {payMethod === 'crypto' && (
                <div id="crypto-field-details" className="bg-[#151c22] p-3 rounded-lg border border-[#222e38] flex flex-col gap-2 animate-fade-in">
                  <span className="text-[11px] font-mono font-bold text-amber-400">USDT (TRC-20 Network) Destination:</span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-gray-300 select-all truncate">TYuYg63uA7GjH12zXcn69P88fLqpRwq9K1</span>
                    <button 
                      type="button"
                      onClick={() => copyRef('TYuYg63uA7GjH12zXcn69P88fLqpRwq9K1')}
                      className="text-amber-500 hover:text-amber-400 p-1 bg-slate-900 rounded font-bold text-[10px] uppercase flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Copy size={11} />
                      {copiedId === 'TYuYg63uA7GjH12zXcn69P88fLqpRwq9K1' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {/* Promo code booster row */}
              <div id="bonus-field-row" className="flex flex-col gap-1.5 mt-1">
                <label className="text-[11px] text-gray-400 flex items-center justify-between">
                  <span>Enter Promo / Promotion Code for deposit match</span>
                  <span className="text-amber-400 font-bold font-mono">Try: WELCOME100 or POCKETGOLD</span>
                </label>
                <input
                  type="text"
                  value={bonusCode}
                  onChange={(e) => setBonusCode(e.target.value)}
                  className="w-full bg-[#151c22] border border-[#222e38] rounded-xl px-4 py-2.5 font-mono text-xs text-[#f0f2f5] focus:outline-none focus:border-amber-400"
                  placeholder="WELCOME100 (100% boost) or POCKETGOLD (50% boost)"
                />
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                id="deposit-complete-trigger"
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-black font-sans font-bold rounded-xl text-center shadow-lg shadow-amber-500/10 cursor-pointer hover:scale-[1.01] active:scale-100 transition-all text-sm mt-2"
              >
                Simulate Direct Deposit
              </button>
            </form>
          </div>
        )}

        {/* 2. WITHDRAWAL PORTAL VIEW */}
        {activeSubTab === 'withdraw' && (
          <form id="withdraw-view" onSubmit={handleWithdrawal} className="p-4 md:p-6 flex flex-col gap-4 max-w-2xl mx-auto">
            <span id="withdraw-title-row" className="text-xs font-bold text-gray-400 font-mono tracking-wider uppercase">Submit Withdrawal Settlement</span>
            
            <div id="balance-sub-panel" className="bg-[#11171d] border border-[#222d38] rounded-2xl p-4 flex gap-4 items-center">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
                <ArrowUpRight size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 leading-none">Net Tradable Volume Ledger</span>
                <span className="font-mono text-base font-bold text-white mt-1.5">${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
              </div>
            </div>

            {/* Entry grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400">Settlement Amount ($)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-[#151c22] border border-[#222e38] rounded-xl px-4 py-3 font-mono text-sm text-[#f0f2f5] focus:outline-none focus:border-amber-400"
                  placeholder="Min K$700"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400">Destination Carrier (e.g. Mobile M-PESA)</label>
                <select className="w-full bg-[#151c22] border border-[#222e38] rounded-xl px-4 py-3 text-sm text-[#f0f2f5] focus:outline-none focus:border-amber-400">
                  <option value="mpesa">M-PESA Direct Instant Gate</option>
                  <option value="crypto">Tether TRC-20 Address</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400">Recipient First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-[#151c22] border border-[#222e38] rounded-xl px-4 py-3 text-sm text-[#f0f2f5] focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400">Recipient Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[#151c22] border border-[#222e38] rounded-xl px-4 py-3 text-sm text-[#f0f2f5] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400">Settlement Path Wallet / Mobile Direct Line</label>
              <input
                type="text"
                value={walletPhone}
                onChange={(e) => setWalletPhone(e.target.value)}
                className="w-full bg-[#151c22] border border-[#222e38] rounded-xl px-4 py-3 font-mono text-sm text-[#f0f2f5] focus:outline-none focus:border-amber-400"
                placeholder="+254 7XX XXX XXX / Wallet code"
                required
              />
            </div>

            {/* Execute trigger */}
            <button
              type="submit"
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-sans font-bold text-sm rounded-xl text-center shadow shadow-amber-400/10 cursor-pointer transition-colors mt-2"
            >
              Simulate Settlement Withdrawal
            </button>
          </form>
        )}

        {/* 3. TRANSACTION LEDGER CATALOGUE VIEW */}
        {activeSubTab === 'history' && (
          <div id="history-view" className="p-4 flex flex-col gap-3">
            <span id="ledger-title-txt" className="text-xs font-bold text-gray-400 font-mono tracking-wider uppercase mb-1">Financial Transaction History Logs</span>

            {transactions.length === 0 ? (
              <div className="text-center py-10 text-gray-500 font-sans text-xs">No transactions recorded yet in the ledger.</div>
            ) : (
              <div id="transactions-log-list" className="flex flex-col gap-2.5 overflow-y-auto max-h-[450px]">
                {transactions.map((tx) => {
                  const isDeposit = tx.type === 'deposit';
                  const isCompleted = tx.status === 'Completed';
                  const isPending = tx.status === 'Pending';
                  const isRejected = tx.status === 'Rejected';

                  let statusBadgeStyle = 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
                  if (isCompleted) statusBadgeStyle = 'bg-emerald-500/15 text-[#22c55e] border border-emerald-500/30';
                  if (isPending) statusBadgeStyle = 'bg-amber-500/15 text-[#eab308] border border-amber-500/30';
                  if (isRejected) statusBadgeStyle = 'bg-rose-500/15 text-[#f43f5e] border border-rose-500/30';

                  return (
                    <div 
                      key={tx.id} 
                      id={`tx-card-${tx.id}`}
                      className="bg-[#11171d] border border-[#202a33] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs leading-none relative overflow-hidden group"
                    >
                      {/* Left Block - Type Icon + Method + Details */}
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isDeposit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {isDeposit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-sans font-bold uppercase text-white">
                              {isDeposit ? 'Deposit' : 'Withdrawal'} • {tx.method}
                            </span>
                            <span className="font-mono text-[10px] text-gray-400">Ref ID: {tx.referenceId}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-mono italic">{tx.createdAt}</span>
                        </div>
                      </div>

                      {/* Middle Details - Remarks and Actions */}
                      <div className="flex-1 md:mx-6 flex flex-col gap-1 justify-center">
                        <span className="text-[10px] text-gray-400 font-sans leading-normal">
                          {tx.remarks || 'Standard ledger entry.'}
                        </span>
                        {tx.phoneOrWallet && (
                          <span className="text-[9px] font-mono text-gray-500">Destination: {tx.phoneOrWallet}</span>
                        )}
                      </div>

                      {/* Right Block - Price & Status Badges */}
                      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                        <span className={`font-mono font-black text-sm ${
                          isDeposit ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {isDeposit ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${statusBadgeStyle}`}>
                            {tx.status}
                          </span>

                          <button 
                            type="button"
                            onClick={() => copyRef(tx.referenceId)}
                            className="bg-slate-900/60 p-1 rounded hover:bg-slate-800 text-gray-400 hover:text-[#f0f2f5] "
                            title="Copy Ref ID"
                          >
                            <Copy size={11} />
                          </button>

                          <button 
                            type="button"
                            onClick={onOpenSupport}
                            className="bg-[#1a2530] p-1 rounded hover:bg-slate-800 text-amber-400 hover:text-amber-300"
                            title="Lodge Dispute"
                          >
                            <MessageSquare size={11} />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Trust Sign and Security disclaimer */}
      <div id="cashier-foot-disclaimer" className="flex items-center justify-center gap-2 p-3 bg-[#0a0d10] border border-[#1a222a] rounded-xl text-[10px] text-gray-500 font-mono">
        <ShieldCheck size={13} className="text-emerald-400" />
        Pocket Trade Financial Operations Secured with PCI-DSS Compliance (SANDBOX ENGINE)
      </div>

    </div>
  );
}
