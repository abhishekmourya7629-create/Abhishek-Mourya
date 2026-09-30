import React from 'react';
import { 
  MapPin, Zap, Activity, Inbox, ShieldCheck, 
  X, ChevronRight, Sparkles, Cpu, Layers 
} from 'lucide-react';

export default function NagrikSidebar({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen,
  onOpenTrustDrawer 
}) {
  const primaryNavItems = [
    {
      id: 'map',
      label: 'Live Civic Map',
      description: 'Geospatial hot-spots & demand search',
      icon: MapPin,
      badge: 'Live'
    },
    {
      id: 'priority',
      label: 'Civic Priority Engine',
      description: 'AI scoring, sliders & supervisor review',
      icon: Zap,
      badge: 'Core'
    },
    {
      id: 'ledger',
      label: 'Public Impact Ledger',
      description: 'Budget allocations & delivery audit',
      icon: Activity,
      badge: null
    },
    {
      id: 'intake',
      label: 'Omnichannel Intake Hub',
      description: 'WhatsApp, Voicemail & Citizen Portal',
      icon: Inbox,
      badge: '4 Channels'
    }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden animate-fadeIn"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0c14]/98 backdrop-blur-2xl border-r border-white/10 text-white transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col shadow-2xl`}>
        
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-300 p-[1.5px] shadow-lg shadow-emerald-500/30">
              <div className="w-full h-full bg-[#080d14] rounded-[6px] flex items-center justify-center font-heading font-black text-sm text-emerald-400">
                <Zap className="w-4 h-4 fill-emerald-400" />
              </div>
            </div>
            <span className="font-heading font-black text-xl tracking-wider text-white">
              NAGRIK
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              AI 2.0
            </span>
          </div>

          {/* Close Sidebar Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sovereign Municipal Officer Node Badge */}
        <div 
          onClick={() => onOpenTrustDrawer && onOpenTrustDrawer()}
          className="px-5 py-3.5 border-b border-white/10 flex items-center gap-3 bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer group"
          title="Click to inspect Sovereign DPDP & Algorithmic Audit"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 relative group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 ring-2 ring-[#080d14]"></span>
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white truncate tracking-tight">
                Sovereign Trust Node
              </h4>
              <span className="text-[9px] font-mono text-emerald-400 font-bold">100%</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              DPDP Act 2023 Verified
            </p>
          </div>
        </div>

        {/* Core Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 font-mono">
            MUNICIPAL WORKSPACE
          </span>

          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition-all flex items-start gap-3 border ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : 'bg-transparent text-slate-300 border-transparent hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className={`p-1.5 rounded-lg mt-0.5 ${
                  isActive ? 'bg-emerald-500 text-[#06090c]' : 'bg-white/5 text-slate-300'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`truncate ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold shrink-0 ${
                        isActive 
                          ? 'bg-emerald-500/40 text-emerald-200' 
                          : 'bg-white/10 text-slate-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate font-normal mt-0.5">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between font-mono bg-white/[0.01]">
          <span>MUNICIPAL AI v2.0</span>
          <button
            onClick={() => onOpenTrustDrawer && onOpenTrustDrawer()}
            className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] hover:bg-emerald-500/20 transition-colors"
          >
            AUDIT READY
          </button>
        </div>

      </aside>
    </>
  );
}
