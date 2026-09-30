import React from 'react';
import { 
  CheckCircle2, ArrowDown, Shield, Mic, Languages, 
  Cpu, MapPin, Layers, AlertCircle, Database, HelpCircle 
} from 'lucide-react';

const STEP_ICONS = {
  1: Shield,
  2: Shield,
  3: Mic,
  4: Languages,
  5: Cpu,
  6: MapPin,
  7: Layers,
  8: Database
};

export default function PipelineVisualizer({ steps = [], summary = null, loading = false }) {
  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-slate-800 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 animate-spin">
          <Cpu className="w-6 h-6" />
        </div>
        <h4 className="font-heading font-bold text-base text-white mb-1">
          Executing Sovereign AI Pipeline...
        </h4>
        <p className="text-xs text-slate-400">
          Consent Verification → PII Scrubbing → Translation → Entity Extraction → Geocoding → Cluster Insertion
        </p>
      </div>
    );
  }

  if (!steps.length) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-slate-800 text-center text-slate-400">
        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center mb-2 text-slate-500">
          <Layers className="w-5 h-5" />
        </div>
        <h4 className="font-heading font-semibold text-sm text-slate-300">
          Ready to Trace Request Pipeline
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          Select or compose a citizen request on the left and click "Process Through Pipeline" to view step-by-step telemetry.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
      
      {/* Visualizer Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Pipeline Execution Telemetry
          </h3>
          <span className="text-xs text-slate-400">
            Request #{summary?.request_id || steps[7]?.output?.request_id}
          </span>
        </div>

        {summary?.needs_human_review ? (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Routed to Human Review
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Autonomous Hotspot Integrated
          </span>
        )}
      </div>

      {/* Step by step stack */}
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const Icon = STEP_ICONS[step.step] || CheckCircle2;

          return (
            <div 
              key={step.step}
              className="bg-slate-900/70 rounded-xl p-3 border border-slate-800 hover:border-slate-700 transition-all text-xs"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 font-mono font-bold text-[11px]">
                    {step.step}
                  </div>
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-200">
                    {step.name}
                  </span>
                </div>

                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {step.status}
                </span>
              </div>

              {/* Render step specific detail */}
              <div className="bg-slate-950/60 p-2 rounded-lg font-mono text-[11px] text-slate-300 border border-slate-900 overflow-x-auto">
                {step.step === 1 && (
                  <div>
                    Receipt: <span className="text-cyan-400">{step.output.receipt_id}</span> · Regime: <span className="text-amber-300">{step.output.regime}</span>
                  </div>
                )}

                {step.step === 2 && (
                  <div>
                    Masked Citizen: <span className="text-emerald-400">{step.output.masked_name}</span> ({step.output.masked_phone})
                  </div>
                )}

                {step.step === 3 && (
                  <div className="flex items-center gap-2">
                    <span>Codec: {step.output.codec}</span>
                    <span>|</span>
                    <span>Confidence: {(step.output.asr_confidence * 100).toFixed(1)}%</span>
                  </div>
                )}

                {step.step === 4 && (
                  <div>
                    <div className="text-slate-400">Detected: <span className="text-cyan-300 uppercase">{step.output.detected_language}</span></div>
                    <div className="text-emerald-300 mt-0.5 truncate">{step.output.english_pivot}</div>
                  </div>
                )}

                {step.step === 5 && (
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <div>Sector: <span className="text-cyan-400 font-bold">{step.output.sector}</span></div>
                    <div>Severity: <span className="text-rose-400 font-bold">{step.output.severity}</span></div>
                    <div>Confidence: <span className="text-emerald-400">{(step.output.confidence * 100).toFixed(0)}%</span></div>
                    <div>Group: <span className="text-slate-300">{step.output.affected_group}</span></div>
                  </div>
                )}

                {step.step === 6 && (
                  <div>
                    District: <span className="text-amber-300 font-bold">{step.output.district}</span>, {step.output.state} [{step.output.lat.toFixed(2)}, {step.output.lng.toFixed(2)}]
                  </div>
                )}

                {step.step === 7 && (
                  <div>
                    Signal Cluster: <span className="text-cyan-400">{step.output.cluster_id}</span> ({step.output.clustering_note})
                  </div>
                )}

                {step.step === 8 && (
                  <div>
                    Demand Pool Status: <span className={step.output.human_review_required ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                      {step.output.review_status.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
