import React, { useState } from 'react';
import GoogleMapsCityLocator from '../components/GoogleMapsCityLocator';
import NLQueryBar from '../components/NLQueryBar';
import { 
  MapPin, Sparkles, Filter, AlertTriangle, 
  ArrowRight, ShieldCheck, Zap, Layers, Activity 
} from 'lucide-react';

export default function LiveCivicMapView({ 
  onNavigateTab, 
  selectedCountry = 'India',
  t 
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeQueryData, setActiveQueryData] = useState(null);

  const handleExecuteNLQuery = async (queryText) => {
    try {
      const res = await fetch('/api/intake/nl-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText, country: selectedCountry })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveQueryData(data);
      }
    } catch (err) {
      console.error('Failed to parse NL query:', err);
    }
  };

  const handleClearQuery = () => {
    setActiveQueryData(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Top Banner: Officer Welcome & Municipal KPI Counters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Municipal Command Center
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Spatial Stream Active
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2.5">
            <MapPin className="w-7 h-7 text-emerald-400" />
            Live Civic Demand Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-0.5">
            Real-time geospatial intelligence of citizen reports, municipal infrastructure bottlenecks, and prioritized field actions.
          </p>
        </div>

        {/* Action Button: Jump to Priority Engine */}
        <button
          onClick={() => onNavigateTab && onNavigateTab('priority')}
          className="self-start lg:self-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-[#06090c] font-black text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-[#06090c]" />
          <span>Launch Priority Engine</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Municipal Officer Natural-Language Search Bar */}
      <div className="relative">
        <NLQueryBar
          onExecuteQuery={handleExecuteNLQuery}
          activeQueryData={activeQueryData}
          onClearQuery={handleClearQuery}
          t={t || {
            dashboard: {
              nlSearchPlaceholder: "Ask AI: 'Show urgent water supply issues in Ward 4' or 'Find unallocated road projects'...",
              filterActive: "Active Filter"
            }
          }}
        />
      </div>

      {/* Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { id: 'all', label: 'All Civic Demands', count: '14,892' },
          { id: 'water', label: '💧 Water & Sanitation', count: '4,120' },
          { id: 'roads', label: '🛣️ Roads & Bridges', count: '5,310' },
          { id: 'power', label: '⚡ Energy & Lighting', count: '2,940' },
          { id: 'health', label: '🏥 Primary Health', count: '2,522' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
              activeFilter === f.id
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20'
                : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06] hover:text-white'
            }`}
          >
            <span>{f.label}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-black/40 rounded text-slate-400">
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Interactive Map & City Locator */}
      <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <GoogleMapsCityLocator />
      </div>

    </div>
  );
}
