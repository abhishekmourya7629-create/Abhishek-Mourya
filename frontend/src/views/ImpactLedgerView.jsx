import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Activity, ArrowUpRight, MessageSquareCheck, 
  Send, ShieldCheck, RefreshCw, ThumbsUp, Users 
} from 'lucide-react';

export default function ImpactLedgerView({ t }) {
  const [impactItems, setImpactItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [surveyResult, setSurveyResult] = useState(null);
  const [surveyLoading, setSurveyLoading] = useState(false);

  useEffect(() => {
    fetchLedger();
  }, []);

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/impact/ledger');
      if (res.ok) {
        setImpactItems(await res.json());
      }
    } catch (err) {
      console.error('Failed to load impact ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerSurvey = async (projectId) => {
    setSurveyLoading(true);
    try {
      const res = await fetch(`/api/impact/confirm-loop/${projectId}`, {
        method: 'POST'
      });
      if (res.ok) {
        setSurveyResult(await res.json());
      }
    } catch (err) {
      console.error('Confirmation survey loop failed:', err);
    } finally {
      setSurveyLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Civic Accountability Portal
          </span>
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-white">
          {t.impact.tagline}
        </h2>
        <p className="text-xs text-slate-400">
          Transparent public ledger tracking baseline vs. post-delivery infrastructure indices and direct citizen feedback loops.
        </p>
      </div>

      {/* Main Ledger Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {impactItems.map((item) => {
          const isCompleted = item.status === 'completed';
          const progressPct = Math.min(100, Math.round(((item.current_metric - item.baseline_metric) / (item.target_metric - item.baseline_metric)) * 100));

          return (
            <div 
              key={item.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
            >
              {/* Item Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-cyan-300">
                      {item.sector}
                    </span>
                    <span className="text-xs text-slate-400">
                      {item.district}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-white">
                    {item.title}
                  </h3>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 ${
                  isCompleted 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>

              {/* Baseline vs Current Metric Progress */}
              <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Baseline: <strong className="text-slate-200">{item.baseline_metric}</strong></span>
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    +{item.relative_gain_pct}% Index Shift
                  </span>
                  <span>Target: <strong className="text-cyan-300">{item.target_metric}</strong></span>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(15, progressPct)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] pt-1">
                  <span className="text-slate-400">
                    Current Delivery Index: <strong className="text-white">{item.current_metric}</strong>
                  </span>
                  <span className="text-slate-500">
                    Verified: {item.last_verified}
                  </span>
                </div>
              </div>

              {/* Citizen Verification Pulse Trigger */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <ThumbsUp className="w-4 h-4 text-emerald-400" />
                  <span>Citizen Satisfaction: <strong>{item.citizen_satisfaction_rate}%</strong></span>
                </div>

                <button
                  onClick={() => handleTriggerSurvey(item.id)}
                  disabled={surveyLoading}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  <span>Verify with Citizens</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Citizen Confirmation Modal/Drawer */}
      {surveyResult && (
        <div className="glass-card rounded-2xl p-6 border border-cyan-500/40 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
                Automated Verification Pulse Result
              </span>
              <h3 className="font-heading font-bold text-base text-white">
                {t.impact.surveyTitle}
              </h3>
            </div>
            <button
              onClick={() => setSurveyResult(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close Results
            </button>
          </div>

          {/* Survey Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/30 text-center">
              <span className="text-[10px] font-semibold text-emerald-400 block">Fully Resolved</span>
              <span className="font-heading font-extrabold text-xl text-emerald-300">
                {surveyResult.breakdown.yes_fully_resolved_pct}%
              </span>
            </div>

            <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-500/30 text-center">
              <span className="text-[10px] font-semibold text-amber-400 block">Partially Fixed</span>
              <span className="font-heading font-extrabold text-xl text-amber-300">
                {surveyResult.breakdown.partially_resolved_pct}%
              </span>
            </div>

            <div className="bg-rose-950/30 p-3 rounded-xl border border-rose-500/30 text-center">
              <span className="text-[10px] font-semibold text-rose-400 block">Still Unresolved</span>
              <span className="font-heading font-extrabold text-xl text-rose-300">
                {surveyResult.breakdown.unresolved_pct}%
              </span>
            </div>
          </div>

          {/* Sample Citizen Feedback Quotes */}
          <div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Sample Citizen Verification Receipts
            </span>
            <div className="space-y-2">
              {surveyResult.verified_citizen_responses.map((q, i) => (
                <div key={i} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span className="font-semibold text-slate-200">{q.citizen}</span>
                    <span className="text-[11px]">{q.timestamp}</span>
                  </div>
                  <p className="text-slate-300 italic">"{q.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono text-center pt-2">
            {surveyResult.audit_certification}
          </div>
        </div>
      )}

    </div>
  );
}
