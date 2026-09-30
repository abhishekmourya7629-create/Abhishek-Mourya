import React, { useState } from 'react';
import { 
  LayoutDashboard, Layers, FileText, BarChart2, MapPin, 
  Table, ChevronDown, ChevronRight, Inbox, CheckCircle2, 
  Activity, Scale, Sliders, Shield, Compass, Sparkles, Cpu, Zap,
  Bot, MessageSquare, Mic
} from 'lucide-react';

export default function NagrikSidebar({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen 
}) {
  const [dashboardOpen, setDashboardOpen] = useState(true);

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0c14]/95 backdrop-blur-2xl border-r border-white/10 text-white transition-transform duration-300 ease-in-out md:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } flex flex-col shadow-2xl`}>
      
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-300 p-[1.5px] shadow-lg shadow-emerald-500/30">
            <div className="w-full h-full bg-[#080d14] rounded-[6px] flex items-center justify-center font-heading font-black text-sm text-emerald-400">
              <Zap className="w-4 h-4 fill-emerald-400" />
            </div>
          </div>
          <span className="font-heading font-black text-xl tracking-wider text-white">
            NAGRIK
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 ml-auto">
            AI 2.0
          </span>
        </div>
      </div>

      {/* Sovereign System Core Node Badge */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3 bg-white/[0.02]">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 relative">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 ring-2 ring-[#080d14]"></span>
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-bold text-white truncate tracking-tight">
              Sovereign Core Node
            </h4>
          </div>
          <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            DPDP / BRICS Verified
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        
        {/* Section: MAIN MENU */}
        <div>
          <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 font-mono">
            COMMAND CENTER
          </span>

          {/* Dashboard Group */}
          <div className="space-y-1">
            <button
              onClick={() => setDashboardOpen(!dashboardOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dashboard' || activeTab === 'priority' || activeTab === 'map'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Dashboard</span>
              </div>
              {dashboardOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {/* Sub-menu items */}
            {dashboardOpen && (
              <div className="pl-9 pr-2 py-1 space-y-1 text-xs">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left py-1.5 px-2 rounded-md font-medium transition-colors ${
                    activeTab === 'dashboard'
                      ? 'text-emerald-300 font-bold bg-emerald-500/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Neural Edge Monitor
                </button>

                <button
                  onClick={() => setActiveTab('map')}
                  className={`w-full text-left py-1.5 px-2 rounded-md font-medium transition-colors ${
                    activeTab === 'map'
                      ? 'text-emerald-300 font-bold bg-emerald-500/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Google Maps City Locator
                </button>

                <button
                  onClick={() => setActiveTab('priority')}
                  className={`w-full text-left py-1.5 px-2 rounded-md font-medium transition-colors ${
                    activeTab === 'priority'
                      ? 'text-emerald-300 font-bold bg-emerald-500/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Priority Projects & Sliders
                </button>
              </div>
            )}
          </div>

          {/* AI Chatbot Copilot (Most Important) */}
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`w-full flex items-center justify-between px-3 py-2 mt-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'chatbot'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-500/20'
                : 'text-slate-200 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>AI Chatbot Copilot</span>
            </div>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
              NEW
            </span>
          </button>

          {/* WhatsApp Hotline */}
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 mt-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Hotline</span>
          </button>

          {/* Voice Mail & ASR Studio */}
          <button
            onClick={() => setActiveTab('voicemail')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 mt-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'voicemail'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4 text-teal-400" />
            <span>Voice Mail & ASR Studio</span>
          </button>

          {/* Intake Simulator (Forms) */}
          <button
            onClick={() => setActiveTab('intake')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 mt-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'intake'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4 text-emerald-400" />
            <span>Multi-Channel Pipeline (8 Steps)</span>
          </button>

          {/* Review Queue */}
          <button
            onClick={() => setActiveTab('review')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 mt-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'review'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Human Review Queue</span>
          </button>

          {/* Impact Ledger */}
          <button
            onClick={() => setActiveTab('impact')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 mt-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'impact'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Public Impact Ledger</span>
          </button>

          {/* Trust & Bias Monitor */}
          <button
            onClick={() => setActiveTab('trust')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 mt-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'trust'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Trust & Bias Center</span>
          </button>
        </div>

        {/* Section: PLATFORM MODULES */}
        <div>
          <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 font-mono">
            CAPABILITIES
          </span>

          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('map')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Google Maps View</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              onClick={() => setActiveTab('priority')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Priority Weights Engine</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              onClick={() => setActiveTab('trust')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Sovereign Compliance</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between font-mono">
        <span>NAGRIK v2.0</span>
        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px]">
          EDGE AI ACTIVE
        </span>
      </div>

    </aside>
  );
}
