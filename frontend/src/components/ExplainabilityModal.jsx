import React from 'react';
import { X, ShieldCheck, AlertCircle, ArrowUpRight, BarChart2, FileText, CheckCircle2 } from 'lucide-react';

export default function ExplainabilityModal({ project, isOpen, onClose }) {
  if (!isOpen || !project) return null;

  const exp = project.explainability || {};
  const breakdown = project.score_breakdown || {};
  const evidence = exp.evidence_points || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700/80 shadow-2xl p-6 text-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {project.sector}
              </span>
              <span className="text-xs text-slate-400">
                {project.district}, {project.state} ({project.country})
              </span>
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Score & Recommended Action Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 p-4 rounded-xl border border-slate-700/70 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Transparent Priority Index
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-extrabold text-3xl text-cyan-400">
                {project.priority_score}
              </span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Policy Action Recommendation
            </span>
            <span className="text-xs font-bold text-amber-300">
              {exp.recommendation_action || 'EVALUATE FOR INCLUSION'}
            </span>
          </div>
        </div>

        {/* Grounded Narrative Explanation */}
        <div className="mb-5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
            Plain-Language Grounded Reasoning
          </h4>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
            {exp.summary}
          </div>
        </div>

        {/* Evidence Points Table */}
        <div className="mb-5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Empirical Evidence & Baseline Indicators
          </h4>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-700/60">
                <tr>
                  <th className="p-2.5 font-semibold">Indicator</th>
                  <th className="p-2.5 font-semibold">Observed Value</th>
                  <th className="p-2.5 font-semibold">Policy Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {evidence.map((ev, i) => (
                  <tr key={i} className="hover:bg-slate-800/30">
                    <td className="p-2.5 font-medium text-slate-300">{ev.metric}</td>
                    <td className="p-2.5 font-mono font-semibold text-cyan-300">{ev.value}</td>
                    <td className="p-2.5 text-slate-400">{ev.context}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mathematical Factor Contributions */}
        <div className="mb-5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Factor Weight Contributions (Normalized 0 - 100)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { label: "Citizen Demand", val: breakdown.demand, color: "text-cyan-400" },
              { label: "Deprivation", val: breakdown.deprivation, color: "text-amber-400" },
              { label: "Population Scale", val: breakdown.population, color: "text-sky-400" },
              { label: "Equity Adjustment", val: breakdown.equity, color: "text-rose-400" },
              { label: "Cost-Effectiveness", val: breakdown.cost_effectiveness, color: "text-emerald-400" },
              { label: "Feasibility", val: breakdown.feasibility, color: "text-indigo-400" },
            ].map((f, i) => (
              <div key={i} className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block truncate">{f.label}</span>
                <span className={`font-heading font-bold text-base ${f.color}`}>
                  {f.val || 0}
                  <span className="text-[10px] text-slate-500 font-normal"> / 100</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Provenance & Sovereign Compliance Footer */}
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Digital Public Good Standard & Sovereign Anonymization Guaranteed</span>
          </div>
          <span className="font-mono text-slate-500 hidden sm:inline">
            Prov-Hash: #{project.id?.slice(0, 10)}
          </span>
        </div>

      </div>
    </div>
  );
}
