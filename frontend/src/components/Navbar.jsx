import React from 'react';
import { 
  Building2, Globe, Shield, Activity, Inbox, 
  CheckCircle2, Scale, BarChart3, Languages, ChevronDown
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  selectedCountry, 
  setSelectedCountry, 
  countries, 
  lang, 
  setLang, 
  t, 
  regime 
}) {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Brand & DPG Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                  {t.appName}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-full flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" />
                  {t.dpgBadge}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Mobile Lang & Country Switcher */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="px-2 py-1 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-200"
            >
              {lang === 'en' ? 'हिंदी' : 'EN'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            {t.nav.dashboard}
          </button>

          <button
            onClick={() => setActiveTab('intake')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === 'intake'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            {t.nav.intake}
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === 'review'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t.nav.reviewQueue}
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === 'impact'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {t.nav.impactLedger}
          </button>

          <button
            onClick={() => setActiveTab('trust')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === 'trust'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            {t.nav.trustCenter}
          </button>
        </nav>

        {/* Country Selector & Sovereign Status & Language Toggle */}
        <div className="hidden md:flex items-center gap-3">
          {/* Sovereign Country Select */}
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="appearance-none bg-slate-900/90 hover:bg-slate-900 text-xs font-semibold text-slate-200 pl-3 pr-8 py-1.5 rounded-lg border border-slate-700/80 focus:outline-none focus:border-cyan-500 cursor-pointer shadow-sm"
            >
              {countries.map((c) => (
                <option key={c.name} value={c.name} className="bg-slate-900 text-slate-100">
                  {c.name} ({c.currency_symbol})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sovereign Privacy Tag */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/80 border border-slate-800 rounded-lg text-[11px] text-slate-300">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="font-mono text-cyan-400 font-medium">
              {regime?.regime_name?.split('(')[0] || 'Sovereign Node'}
            </span>
          </div>

          {/* Language Switcher Button */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors shadow-sm"
            title="Toggle Language (English / हिंदी)"
          >
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
