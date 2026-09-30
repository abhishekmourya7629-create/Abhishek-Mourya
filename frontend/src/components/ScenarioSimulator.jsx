import React, { useState, useEffect } from 'react';
import { Calculator, Users, TrendingUp, CheckCircle2, DollarSign, ArrowUpRight } from 'lucide-react';

export default function ScenarioSimulator({ 
  country = 'India', 
  weights, 
  selectedSector, 
  t 
}) {
  const [budgetLimit, setBudgetLimit] = useState(35.0);
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    runSimulation(budgetLimit);
  }, [budgetLimit, country, weights, selectedSector]);

  const runSimulation = async (budget) => {
    setLoading(true);
    try {
      const res = await fetch('/api/scenario/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          budget_limit_m: budget,
          weights,
          selected_sector: selectedSector
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationResult(data);
      }
    } catch (err) {
      console.error('Scenario simulation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const funded = simulationResult?.funded_projects || [];

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800">
      
      {/* Header & Budget Slider */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calculator className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-slate-100">
              {t.dashboard.scenarioTitle}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Simulate capital budget allocation to project citizen access gains and infrastructure index shifts
          </p>
        </div>

        {/* Budget Slider */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center gap-4 min-w-[280px]">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Budget Envelope:</span>
              <span className="font-mono font-bold text-emerald-400">
                ${budgetLimit} Million USD
              </span>
            </div>
            <input
              type="range"
              min="10.0"
              max="100.0"
              step="5.0"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* Projection Impact Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">
            Capital Allocated
          </span>
          <span className="font-heading font-extrabold text-lg text-emerald-400">
            ${simulationResult?.spent_budget_m || 0}M
            <span className="text-xs text-slate-500 font-normal"> / ${budgetLimit}M</span>
          </span>
        </div>

        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">
            People Gaining Access
          </span>
          <span className="font-heading font-extrabold text-lg text-cyan-400 flex items-center gap-1">
            <Users className="w-4 h-4" />
            {((simulationResult?.total_beneficiaries_gaining_access || 0) / 1000).toFixed(0)}k
          </span>
        </div>

        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">
            Grievances Resolved
          </span>
          <span className="font-heading font-extrabold text-lg text-amber-400 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            {simulationResult?.total_citizen_demands_resolved || 0}
          </span>
        </div>

        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">
            Avg. Infra Index Gain
          </span>
          <span className="font-heading font-extrabold text-lg text-rose-400 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +{simulationResult?.avg_infra_index_gain || 0} pts
          </span>
        </div>

      </div>

      {/* Funded Projects Under Scenario */}
      <div>
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Top {funded.length} Projects Funded in Scenario</span>
          <span className="text-[11px] text-slate-500 font-normal">
            Remaining Budget: ${simulationResult?.remaining_budget_m || 0}M
          </span>
        </h4>

        <div className="space-y-2">
          {funded.slice(0, 4).map((p, idx) => (
            <div 
              key={p.id}
              className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-5 h-5 rounded bg-slate-800 text-[10px] font-mono text-cyan-400 font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-semibold text-white truncate">
                  {p.title}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase bg-slate-800 text-slate-300">
                  {p.sector}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
                <span className="text-amber-300">
                  ${p.estimated_cost_m}M
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  {p.baseline_infra_index} → {p.new_projected_index}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
