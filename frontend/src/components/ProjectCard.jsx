import React from 'react';
import { 
  CheckCircle2, Clock, AlertTriangle, ArrowRight, 
  HelpCircle, Users, DollarSign, Sparkles, XCircle 
} from 'lucide-react';

export default function ProjectCard({ 
  project, 
  rank, 
  onExplain, 
  onAction, 
  t 
}) {
  const isApproved = project.status === 'approved';
  const isDeferred = project.status === 'deferred';
  const isRejected = project.status === 'rejected';

  // Gap badges
  let gapBadge = null;
  if (project.gap_status === 'unplanned_gap') {
    gapBadge = (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Critical Unplanned Gap
      </span>
    );
  } else if (project.gap_status === 'ghost_allocation') {
    gapBadge = (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
        <HelpCircle className="w-3 h-3" />
        Ghost / Overbudgeted
      </span>
    );
  } else if (project.gap_status === 'aligned') {
    gapBadge = (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" />
        Aligned Priority
      </span>
    );
  }

  return (
    <div className={`edge-glass-card rounded-2xl p-4 border transition-all hover:-translate-y-1 duration-300 ${
      isApproved 
        ? 'border-emerald-500/50 bg-emerald-950/20' 
        : isDeferred
        ? 'border-amber-500/30 bg-amber-950/10'
        : 'border-white/10 hover:border-emerald-500/40'
    }`}>
      
      {/* Top Header: Rank, District/Sector & Gap Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-black/40 border border-white/10 text-xs font-mono font-bold text-slate-300 flex items-center justify-center shrink-0">
            #{rank}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            {project.sector}
          </span>
          <span className="text-xs text-slate-300 truncate max-w-[130px] sm:max-w-none">
            {project.district}, {project.state}
          </span>
        </div>

        {gapBadge}
      </div>

      {/* Project Title & Description */}
      <h3 className="font-heading font-bold text-sm text-white mb-1.5 leading-snug">
        {project.title}
      </h3>
      <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
        {project.description}
      </p>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-3 gap-2 text-xs mb-3">
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 block truncate">Beneficiaries</span>
          <span className="font-bold text-white flex items-center gap-1">
            <Users className="w-3 h-3 text-cyan-400" />
            {(project.population_affected / 1000).toFixed(0)}k
          </span>
        </div>

        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 block truncate">Est. Cost</span>
          <span className="font-bold text-amber-300 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-amber-400" />
            ${project.estimated_cost_m}M
          </span>
        </div>

        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 block truncate">Priority Score</span>
          <span className="font-heading font-extrabold text-cyan-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            {project.priority_score}
          </span>
        </div>
      </div>

      {/* Score Breakdown Bars Preview */}
      <div className="space-y-1 mb-3 bg-slate-900/50 p-2 rounded-lg border border-slate-800/60">
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>Demand: {project.score_breakdown?.demand || 0}</span>
          <span>Deprivation: {project.score_breakdown?.deprivation || 0}</span>
          <span>Equity: {project.score_breakdown?.equity || 0}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-cyan-400" 
            style={{ width: `${(project.score_breakdown?.demand || 0) / 3}%` }} 
          />
          <div 
            className="h-full bg-amber-400" 
            style={{ width: `${(project.score_breakdown?.deprivation || 0) / 3}%` }} 
          />
          <div 
            className="h-full bg-rose-400" 
            style={{ width: `${(project.score_breakdown?.equity || 0) / 3}%` }} 
          />
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-2">
        
        {/* Why this ranks here button */}
        <button
          onClick={() => onExplain(project)}
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Why this ranks here</span>
        </button>

        {/* Approval status & Action buttons */}
        <div className="flex items-center gap-1.5">
          {isApproved ? (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t.dashboard.approvedBadge}
            </span>
          ) : isDeferred ? (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {t.dashboard.deferredBadge}
            </span>
          ) : (
            <>
              <button
                onClick={() => onAction(project.id, 'defer')}
                className="px-2 py-1 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
                title="Defer for multi-year review"
              >
                {t.dashboard.defer}
              </button>
              <button
                onClick={() => onAction(project.id, 'approve')}
                className="px-2.5 py-1 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm shadow-cyan-400/20 flex items-center gap-1"
                title="Approve project for immediate sovereign tendering"
              >
                <CheckCircle2 className="w-3 h-3" />
                {t.dashboard.approve}
              </button>
            </>
          )}
        </div>

      </div>

    </div>
  );
}
