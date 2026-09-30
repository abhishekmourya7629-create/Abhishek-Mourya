import React from 'react';
import { AlertTriangle, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function GapMatrixView({ 
  gapData, 
  onSelectGapFilter, 
  activeFilter, 
  t 
}) {
  const unplanned = gapData?.unplanned_gaps || [];
  const ghost = gapData?.ghost_allocations || [];
  const aligned = gapData?.aligned_projects || [];

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
            {t.dashboard.gapMatrixTitle}
          </h3>
          <p className="text-xs text-slate-400">
            Categorizing sovereign district-sectors by citizen demand vs. planned capital expenditure
          </p>
        </div>

        {activeFilter && (
          <button
            onClick={() => onSelectGapFilter(null)}
            className="text-xs text-cyan-400 hover:underline self-start sm:self-auto"
          >
            Clear Matrix Filter
          </button>
        )}
      </div>

      {/* 3 Strategic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Critical Unplanned Gaps */}
        <div 
          onClick={() => onSelectGapFilter('unplanned_gap')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeFilter === 'unplanned_gap'
              ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-950/40'
              : 'bg-slate-900/60 border-slate-800 hover:border-rose-500/50 hover:bg-slate-900/90'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Critical Unplanned Deficit
            </span>
            <span className="font-heading font-extrabold text-lg text-rose-400">
              {unplanned.length}
            </span>
          </div>

          <h4 className="font-heading font-bold text-sm text-white mb-1">
            High Demand · Zero Budget
          </h4>
          <p className="text-xs text-slate-400 mb-3">
            Immediate intervention required. Severe grassroots distress with no matching public funds.
          </p>

          <div className="space-y-1.5 border-t border-slate-800/80 pt-2.5 text-xs">
            {unplanned.slice(0, 3).map((g, i) => (
              <div key={i} className="flex items-center justify-between text-slate-300">
                <span className="truncate max-w-[120px]">
                  {g.district} ({g.sector})
                </span>
                <span className="font-mono text-rose-400 font-semibold">
                  {g.demand_count} reqs | $0.0M
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Ghost Allocations */}
        <div 
          onClick={() => onSelectGapFilter('ghost_allocation')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeFilter === 'ghost_allocation'
              ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-950/40'
              : 'bg-slate-900/60 border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/90'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              Ghost / Overbudgeted
            </span>
            <span className="font-heading font-extrabold text-lg text-purple-300">
              {ghost.length}
            </span>
          </div>

          <h4 className="font-heading font-bold text-sm text-white mb-1">
            Minimal Demand · High Budget
          </h4>
          <p className="text-xs text-slate-400 mb-3">
            Reallocation candidate. Substantial planned budget in areas with already high infrastructure index.
          </p>

          <div className="space-y-1.5 border-t border-slate-800/80 pt-2.5 text-xs">
            {ghost.slice(0, 3).map((g, i) => (
              <div key={i} className="flex items-center justify-between text-slate-300">
                <span className="truncate max-w-[120px]">
                  {g.district} ({g.sector})
                </span>
                <span className="font-mono text-purple-300 font-semibold">
                  {g.demand_count} reqs | ${g.budget_m}M
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Aligned Execution */}
        <div 
          onClick={() => onSelectGapFilter('aligned')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeFilter === 'aligned'
              ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/40'
              : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Aligned Pipeline
            </span>
            <span className="font-heading font-extrabold text-lg text-emerald-400">
              {aligned.length}
            </span>
          </div>

          <h4 className="font-heading font-bold text-sm text-white mb-1">
            High Demand · High Budget
          </h4>
          <p className="text-xs text-slate-400 mb-3">
            Accelerate execution. Citizen voice directly mirrors national capital work plans.
          </p>

          <div className="space-y-1.5 border-t border-slate-800/80 pt-2.5 text-xs">
            {aligned.slice(0, 3).map((g, i) => (
              <div key={i} className="flex items-center justify-between text-slate-300">
                <span className="truncate max-w-[120px]">
                  {g.district} ({g.sector})
                </span>
                <span className="font-mono text-emerald-400 font-semibold">
                  {g.demand_count} reqs | ${g.budget_m}M
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
