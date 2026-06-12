/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Filter, 
  TrendingUp, 
  Sparkles, 
  CornerDownRight, 
  Globe
} from 'lucide-react';
import { EconomicEvent } from '../types';
import { ECONOMIC_EVENTS } from '../data';

export default function EconomicCalendarTab() {
  const [events, setEvents] = useState<EconomicEvent[]>(ECONOMIC_EVENTS);
  const [filterCurrency, setFilterCurrency] = useState<string>('ALL');
  const [filterImpact, setFilterImpact] = useState<string>('ALL');
  const [currentTime, setCurrentTime] = useState<string>(new Date().toUTCString().slice(17, 25));

  // Update a ticking UTC clock for financial coordination
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toUTCString().slice(17, 25));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currencies = ['ALL', 'USD', 'EUR', 'CAD'];
  const impacts = ['ALL', 'high', 'medium', 'low'];

  const filteredEvents = events.filter(ev => {
    const passCurrency = filterCurrency === 'ALL' || ev.country === filterCurrency;
    const passImpact = filterImpact === 'ALL' || ev.impact === filterImpact;
    return passCurrency && passImpact;
  });

  return (
    <div id="economic-calendar-root" className="w-full flex flex-col gap-4 animate-fade-in select-none">
      
      {/* Header bar */}
      <div id="calendar-filter-bar" className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        
        {/* Clock & Title */}
        <div className="flex items-center gap-3">
          <div className="w-[38px] h-[38px] rounded-xl bg-blue-500/15 text-blue-300 flex items-center justify-center">
            <Calendar size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="font-sans font-bold text-sm md:text-base text-white">Economic Indicators Calendar</h3>
            <span className="font-mono text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Clock size={11} className="text-blue-400" />
              Live Terminal Clock: <span className="text-blue-400 font-semibold">{currentTime} UTC</span>
            </span>
          </div>
        </div>

        {/* Filters Combo selectors */}
        <div id="filters-tray" className="flex flex-wrap items-center gap-3">
          {/* Currency selectors */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Asset Region</span>
            <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-lg">
              {currencies.map(curr => (
                <button
                  key={`curr-filter-${curr}`}
                  onClick={() => setFilterCurrency(curr)}
                  className={`px-3 py-1 text-[10px] font-mono font-bold rounded cursor-pointer transition-all ${
                    filterCurrency === curr 
                      ? 'bg-blue-600 text-white shadow' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Impact Selector */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Volatility Star</span>
            <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-lg">
              {impacts.map(imp => (
                <button
                  key={`imp-filter-${imp}`}
                  onClick={() => setFilterImpact(imp)}
                  className={`px-3 py-1 text-[10px] font-sans font-bold rounded capitalize cursor-pointer transition-all ${
                    filterImpact === imp 
                      ? 'bg-blue-600 text-white shadow' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {imp}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Main events container */}
      <div id="calendar-event-canvas" className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl flex flex-col divide-y divide-white/5 shadow-2xl">
        
        {filteredEvents.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-sans text-xs">No key economic events found matching the specified filters.</div>
        ) : (
          filteredEvents.map(ev => {
            const isHigh = ev.impact === 'high';
            const isMedium = ev.impact === 'medium';
            const isLow = ev.impact === 'low';

            let impactStars = '★';
            let impactColor = 'text-green-400 bg-green-500/10';
            if (isHigh) {
              impactStars = '★★★';
              impactColor = 'text-rose-400 bg-rose-500/10';
            } else if (isMedium) {
              impactStars = '★★';
              impactColor = 'text-amber-400 bg-amber-400/10';
            }

            return (
              <div 
                key={ev.id} 
                id={`calendar-card-${ev.id}`}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors group"
              >
                
                {/* Left Side: Time, Flag Country, and Event Name */}
                <div className="flex items-start gap-3 md:max-w-xl">
                  {/* Time Badge */}
                  <div className="bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg text-center shrink-0 min-w-[76px] font-mono text-xs font-bold text-blue-300">
                    {ev.timeUTC}
                  </div>

                  {/* Flag Circle / Country Badge */}
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10 font-sans font-extrabold text-xs text-slate-100">
                    {ev.country}
                  </div>

                  {/* Title and stats layout */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-sans font-bold text-slate-200 group-hover:text-white transition-colors">{ev.title}</span>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Globe size={11} className="text-slate-500" />
                      <span>Region: <strong className="text-slate-300">{ev.country} Markets</strong></span>
                      <span className="text-slate-500">•</span>
                      <span>Importance: <strong className={ev.importance === 'Important' ? 'text-rose-400' : 'text-slate-300'}>{ev.importance}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Volatility indicator and Forecated Values */}
                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 text-right">
                  
                  {/* Volatility Star rating */}
                  <div className="flex flex-col items-start md:items-end gap-1 select-none">
                    <span className="text-[9px] text-slate-500 font-mono tracking-widest font-semibold leading-none uppercase">Impact</span>
                    <span className={`text-[11px] font-mono font-black scale-y-95 tracking-wide px-1.5 py-0.5 rounded ${impactColor}`}>
                      {impactStars}
                    </span>
                  </div>

                  {/* Forecast vs Previous */}
                  <div className="grid grid-cols-2 gap-3 shrink-0">
                    <div className="flex flex-col items-center p-1.5 bg-white/5 border border-white/5 rounded-lg min-w-[68px]">
                      <span className="text-[8px] text-slate-400 font-mono uppercase leading-none">Forecast</span>
                      <span className="font-mono text-[11px] text-white font-semibold mt-1">{ev.forecast}</span>
                    </div>
                    <div className="flex flex-col items-center p-1.5 bg-white/5 border border-white/5 rounded-lg min-w-[68px]">
                      <span className="text-[8px] text-slate-400 font-mono uppercase leading-none">Previous</span>
                      <span className="font-mono text-[11px] text-[#94a3b8] font-medium mt-1">{ev.previous}</span>
                    </div>
                  </div>

                </div>

              </div>
            );
          })
        )}

      </div>

      {/* Volatility Tip footnote banner */}
      <div id="calendar-tip-banner" className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-3.5 flex items-start gap-2.5 shadow-md">
        <Sparkles size={16} className="text-blue-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
          <strong className="text-blue-400 font-semibold">Volatility Strategy Shield:</strong> In periods of high importance (★★★ ECB / FOMC speeches), currency pairs can fluctuate upwards of 150-200 micro-pips in under 5 minutes. Consider implementing active hedge locks or widening trade expiration times!
        </p>
      </div>

    </div>
  );
}
