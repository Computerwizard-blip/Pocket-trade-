/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  X, 
  User, 
  Bot, 
  HelpCircle, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: {
    name: string;
    email: string;
    phone: string;
  };
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export default function SupportChat({ isOpen, onClose, userProfile }: SupportChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Greeting
  useEffect(() => {
    setMessages([
      {
        id: 'msg-init',
        sender: 'bot',
        text: `Habari! Welcome back, ${userProfile.name}. I am your Pocket Trade technical specialist and advisor.\n\nI can assist you with:\n1. M-PESA deposits and push validation processes\n2. Verification of pending withdrawal settlements\n3. Setting up Fibonacci, MACD, or EMA templates\n4. Solving standard platform inquiries.\n\nWhat are you looking to optimize today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [userProfile]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: 'msg-user-' + Date.now(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const userQuery = inputText.trim().toLowerCase();
    setInputText('');
    setIsTyping(true);

    // Calculate smart options responses
    setTimeout(() => {
      let botResponse = "I have received your inquiry. Let me review your active ledger. Could you confirm if your transaction matches M-PESA, cards, or crypto assets?";

      if (userQuery.includes('mpesa') || userQuery.includes('m-pesa') || userQuery.includes('phone') || userQuery.includes('deposit')) {
        botResponse = `Understood. M-PESA carrier push STK transactions on destination ${userProfile.phone} are routed with high-speed automated gateways. If your push is delayed:\n1. Ensure your mobile line wallet holds more than K$300.\n2. Confirm that you have entered your PIN on the push prompt.\n\nAll verified transactions credit onto the active balance ledger instantly.`;
      } else if (userQuery.includes('withdraw') || userQuery.includes('payout') || userQuery.includes('withdrawing')) {
        botResponse = `Withdrawal clearances under recipient '${userProfile.name}' are held on broker verifications for up to 1-2 hours standard. This maintains PCI compliance and security matching. Once clear, payouts reflect directly in your M-PESA or carrier wallet.`;
      } else if (userQuery.includes('strategy') || userQuery.includes('indicator') || userQuery.includes('chart') || userQuery.includes('win')) {
        botResponse = "Optimal technical indices suggest utilizing the 'EMA-9' cyan line crossing. When the cyan EMA line runs above the fuchsia EMA line, it marks positive momentum. Use 1-minute expiration periods on high payout assets like Crypto IDX (83% yield) for optimal results.";
      } else if (userQuery.includes('real') || userQuery.includes('demo') || userQuery.includes('account')) {
        botResponse = "You can swap between your Real Account (currently displaying real trade margins) and your Demo Account ($10,000 renewable funds) via the top switcher. Standard Demo funds can be recharged instantly.";
      } else if (userQuery.includes('hello') || userQuery.includes('hi') || userQuery.includes('habari')) {
        botResponse = `Hello there! I hope you are having an excellent trading session, ${userProfile.name}. How can I assist you with your option placements or cashier balances?`;
      } else if (userQuery.includes('profile') || userQuery.includes('email') || userQuery.includes('phone')) {
        botResponse = `Your profile is linked under primary contact: ${userProfile.email} with mobile reference ${userProfile.phone}. Account status level is "Standard" with a path to VIP level at K$3,000 accumulative deposits.`;
      }

      const botMsg: Message = {
        id: 'msg-bot-' + Date.now(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const quickQuestions = [
    'How do M-PESA deposits work?',
    'Explain the Fractal Reversal strategy',
    'How to withdraw my earnings?'
  ];

  if (!isOpen) return null;

  return (
    <div id="support-chat-drawer" className="fixed right-0 top-0 bottom-0 w-full sm:w-[380px] bg-slate-950/95 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col justify-between shadow-2xl animate-slide-in">
      
      {/* Drawer Header */}
      <div id="drawer-header" className="px-4 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-300 flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-xs text-white leading-none">Pocket Technical Advisor</span>
            <span className="text-[9px] font-mono text-emerald-400 font-semibold mt-1 flex items-center gap-1 leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Online • Coach Hub
            </span>
          </div>
        </div>

        <button 
          id="close-drawer"
          onClose={onClose}
          onClick={onClose}
          className="p-1 px-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>

      {/* Messages Canvas */}
      <div ref={scrollRef} id="drawer-chat-area" className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar bg-transparent">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div 
              key={msg.id} 
              className={`flex gap-2.5 max-w-[85%] ${
                isBot ? 'self-start' : 'self-end flex-row-reverse'
              }`}
            >
              {/* Sender Identifier circle */}
              <div id={`sender-indicator-${msg.id}`} className={`w-6.5 h-6.5 rounded-full flex items-center justify-center shrink-0 text-[10px] uppercase font-bold leading-none ${
                isBot ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-100 border border-white/10'
              }`}>
                {isBot ? 'PT' : <User size={12} />}
              </div>

              {/* Text cloud bubble */}
              <div 
                id={`bubble-msg-${msg.id}`}
                className={`rounded-2xl p-3 flex flex-col gap-1 text-[11px] font-sans leading-relaxed ${
                  isBot 
                    ? 'bg-white/5 border border-white/5 text-slate-100 rounded-tl-none shadow-md' 
                    : 'bg-blue-600 text-white rounded-tr-none font-medium shadow-md shadow-blue-600/10'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <span className={`text-[8px] font-mono self-end mt-1 ${isBot ? 'text-slate-400' : 'text-slate-200'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing spinner feedback */}
        {isTyping && (
          <div className="flex gap-2.5 max-w-[80%] self-start animate-pulse">
            <div className="w-6.5 h-6.5 rounded-full bg-blue-500/10 text-blue-300 flex items-center justify-center text-[10px] font-mono leading-none">
              advisor
            </div>
            <div className="rounded-2xl p-3 bg-white/5 border border-white/5 text-slate-300 text-[11px] rounded-tl-none">
              Synthesizing response...
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick questions row */}
      <div id="drawer-quick-replies" className="px-4 py-2 border-t border-white/10 flex flex-col gap-1 bg-white/5">
        <span className="text-[9px] font-mono text-slate-400 font-bold uppercase select-none">Quick Inquiries</span>
        <div className="flex flex-wrap gap-1 mt-0.5">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => { setInputText(q); }}
              className="text-[10px] font-sans text-blue-400 hover:text-blue-300 border border-blue-500/15 hover:border-blue-400/30 bg-blue-500/5 hover:bg-blue-500/10 rounded-lg px-2.5 py-1 text-left truncate max-w-full cursor-pointer transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Support Message Composer input */}
      <form onSubmit={handleSend} id="support-composer" className="p-3 border-t border-white/10 bg-slate-950 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`${userProfile.name}, ask advice...`}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-colors"
        />
        <button
          type="submit"
          className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-600/20 active:scale-[0.98]"
        >
          <Send size={14} />
        </button>
      </form>

    </div>
  );
}
