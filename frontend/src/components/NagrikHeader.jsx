import React from 'react';
import { 
  Menu, Search, MessageSquare, Bell, ChevronDown, 
  Languages, ShieldCheck, Zap, Cpu, Radio 
} from 'lucide-react';

export default function NagrikHeader({ 
  sidebarOpen, 
  setSidebarOpen, 
  selectedCountry, 
  setSelectedCountry, 
  countries, 
  lang, 
  setLang,
  onSearch,
  searchVal,
  setSearchVal,
  onOpenTrustDrawer
}) {
  return (
    <header className="h-16 bg-[#0a0c14]/90 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-lg">
      
      {/* Left: Hamburger & Search Box */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search bar matching high-tech aesthetic */}
        <div className="relative w-full max-w-md hidden sm:block">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            placeholder="Search citizen demands, cities, sectors..."
            className="w-full bg-white/[0.04] text-xs text-slate-200 pl-3.5 pr-9 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-emerald-500/60 focus:bg-white/[0.08] placeholder:text-slate-500 transition-all font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Right: Actions, Country, Language & Sovereign Node Status */}
      <div className="flex items-center gap-3">
        
        {/* Country Selector */}
        <div className="relative">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="appearance-none bg-white/[0.05] hover:bg-white/[0.08] text-xs font-semibold text-slate-200 pl-3 pr-7 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:border-emerald-500 cursor-pointer font-sans"
          >
            {countries.map((c) => (
              <option key={c.name} value={c.name} className="bg-[#080d14] text-slate-200">
                {c.name} ({c.currency_symbol})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
          title="Toggle English / हिंदी"
        >
          <Languages className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'en' ? 'हिंदी' : 'EN'}</span>
        </button>

        {/* Live Ingestion Signal Pulse */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-400 font-mono">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>Edge Telemetry Live</span>
        </div>

        {/* Grievance Notification Alert */}
        <button 
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 relative transition-colors"
          title="Grievance Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1.5 right-1.5 animate-ping"></span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1.5 right-1.5"></span>
        </button>

        {/* Sovereign Node Badge (Click to open Trust & Compliance Drawer) */}
        <button
          onClick={onOpenTrustDrawer}
          className="flex items-center gap-2 pl-3 border-l border-white/10 group cursor-pointer"
          title="Open Sovereign Trust & DPDP Compliance Drawer"
        >
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 transition-all shadow-sm shadow-emerald-500/20">
            <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-xs font-mono font-bold text-emerald-300">
              DPDP Verified
            </span>
          </div>
        </button>

      </div>

    </header>
  );
}
