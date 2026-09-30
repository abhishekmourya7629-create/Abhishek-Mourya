import React from 'react';
import { Sliders, RotateCcw, Info, Sparkles } from 'lucide-react';

const DEFAULT_WEIGHTS = {
  w_demand: 0.25,
  w_deprivation: 0.20,
  w_population: 0.15,
  w_equity: 0.15,
  w_cost_effectiveness: 0.15,
  w_feasibility: 0.10
};

export default function PrioritySliders({ weights, setWeights, t }) {
  const currentWeights = weights || DEFAULT_WEIGHTS;

  const handleSliderChange = (key, val) => {
    setWeights(prev => ({
      ...prev,
      [key]: parseFloat(val)
    }));
  };

  const handleReset = () => {
    setWeights(DEFAULT_WEIGHTS);
  };

  const total = (
    currentWeights.w_demand +
    currentWeights.w_deprivation +
    currentWeights.w_population +
    currentWeights.w_equity +
    currentWeights.w_cost_effectiveness +
    currentWeights.w_feasibility
  ) || 1.0;

  const sliderFields = [
    { key: 'w_demand', label: t.sliders.demand, color: 'accent-cyan-400', barBg: 'bg-cyan-500' },
    { key: 'w_deprivation', label: t.sliders.deprivation, color: 'accent-amber-400', barBg: 'bg-amber-500' },
    { key: 'w_population', label: t.sliders.population, color: 'accent-sky-400', barBg: 'bg-sky-500' },
    { key: 'w_equity', label: t.sliders.equity, color: 'accent-rose-400', barBg: 'bg-rose-500' },
    { key: 'w_cost_effectiveness', label: t.sliders.costEff, color: 'accent-emerald-400', barBg: 'bg-emerald-500' },
    { key: 'w_feasibility', label: t.sliders.feasibility, color: 'accent-indigo-400', barBg: 'bg-indigo-500' }
  ];

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center gap-2">
              {t.sliders.title}
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono">
                Live Re-Ranking
              </span>
            </h3>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-800"
          title="Reset to default objective weights"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t.sliders.reset}</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sliderFields.map(({ key, label, color, barBg }) => {
          const rawVal = currentWeights[key] || 0.0;
          const sharePct = Math.round((rawVal / total) * 100);

          return (
            <div key={key} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/70 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium truncate pr-2">
                  {label}
                </span>
                <span className="font-mono text-cyan-300 font-bold shrink-0">
                  {sharePct}%
                </span>
              </div>

              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={rawVal}
                onChange={(e) => handleSliderChange(key, e.target.value)}
                className={`w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer ${color}`}
              />

              <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                <span>0.0</span>
                <span className="font-mono">w = {rawVal.toFixed(2)}</span>
                <span>1.0</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
