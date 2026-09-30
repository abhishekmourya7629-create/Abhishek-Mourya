import React, { useState, useEffect } from 'react';
import PrioritySliders from '../components/PrioritySliders';
import ProjectCard from '../components/ProjectCard';
import ReviewQueueView from './ReviewQueueView';
import { 
  Zap, Sliders, CheckSquare, Sparkles, Filter, 
  RefreshCw, TrendingUp, AlertTriangle, Layers 
} from 'lucide-react';

export default function PriorityEngineView({ 
  selectedCountry = 'India', 
  t 
}) {
  const [activeSubTab, setActiveSubTab] = useState('ranked'); // 'ranked' | 'review'
  const [weights, setWeights] = useState({
    w_demand: 0.25,
    w_deprivation: 0.20,
    w_population: 0.15,
    w_equity: 0.15,
    w_cost_effectiveness: 0.15,
    w_feasibility: 0.10
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPrioritizedProjects();
  }, [weights, selectedCountry]);

  const fetchPrioritizedProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/priority/rank?country=${selectedCountry}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weights, country: selectedCountry })
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || data);
      }
    } catch (err) {
      console.error('Failed to load prioritized projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectAction = (projectId, action) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) return { ...p, status: action };
      return p;
    }));
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              AI Decision Support System
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2.5">
            <Zap className="w-7 h-7 text-emerald-400" />
            Civic Priority Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-0.5">
            Dynamically score municipal capital works, balance ward equity, and approve field execution.
          </p>
        </div>

        {/* View Switcher: Ranked Projects vs Human-in-the-Loop Review */}
        <div className="flex items-center p-1 bg-black/40 rounded-xl border border-white/10 self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveSubTab('ranked')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'ranked'
                ? 'bg-emerald-500 text-[#06090c] shadow-md shadow-emerald-500/30 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Ranked Projects</span>
          </button>

          <button
            onClick={() => setActiveSubTab('review')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'review'
                ? 'bg-emerald-500 text-[#06090c] shadow-md shadow-emerald-500/30 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Supervisor Review Queue</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'ranked' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Sliders for Policy Tuning */}
          <div className="lg:col-span-1 space-y-4">
            <PrioritySliders
              weights={weights}
              setWeights={setWeights}
              t={t || {
                sliders: {
                  title: 'Policy Weight Calibration',
                  demand: 'Citizen Demand Volume',
                  deprivation: 'Ward Deprivation Index',
                  population: 'Impacted Population Density',
                  equity: 'Equity & Underserved Parity',
                  costEff: 'Cost-Benefit Efficiency',
                  feasibility: 'Execution Feasibility'
                }
              }}
            />

            {/* Quick Municipal Advisory Card */}
            <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10 space-y-2 text-xs">
              <span className="font-mono font-bold text-emerald-400 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Optimization Tip
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Increasing <strong className="text-white">Ward Deprivation</strong> weight ensures capital works immediately target areas with severe drinking water and medical clinic deficits.
              </p>
            </div>
          </div>

          {/* Right Column: Ranked Projects List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm text-white">
                  Top Ranked Capital Projects
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-slate-300">
                  {projects.length || 6} Projects
                </span>
              </div>

              <button
                onClick={fetchPrioritizedProjects}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Recalibrate</span>
              </button>
            </div>

            <div className="space-y-3">
              {(projects.length > 0 ? projects : [
                {
                  id: 'proj-1',
                  sector: 'Water Supply',
                  district: 'Ward 4 (North Zone)',
                  cost_estimate: 2400000,
                  score: 0.94,
                  gap_status: 'unplanned_gap',
                  justification: 'Severe summer groundwater exhaustion affecting 18,000 residents.',
                  status: 'pending'
                },
                {
                  id: 'proj-2',
                  sector: 'Primary Health',
                  district: 'Ward 11 (East Zone)',
                  cost_estimate: 4200000,
                  score: 0.89,
                  gap_status: 'aligned',
                  justification: 'Maternity health center upgrade with 94% citizen demand consensus.',
                  status: 'approved'
                },
                {
                  id: 'proj-3',
                  sector: 'Roads & Bridges',
                  district: 'Ward 8 (Old City)',
                  cost_estimate: 1800000,
                  score: 0.83,
                  gap_status: 'unplanned_gap',
                  justification: 'Critical drainage culvert collapse causing seasonal road blockage.',
                  status: 'pending'
                }
              ]).map((proj, idx) => (
                <ProjectCard
                  key={proj.id || idx}
                  project={proj}
                  rank={idx + 1}
                  onAction={handleProjectAction}
                  onExplain={(p) => alert(`AI Score Breakdown for ${p.sector}: Demand: ${(p.score * 100).toFixed(0)}% | Feasibility: High`)}
                  t={t}
                />
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Supervisor Review Queue */
        <ReviewQueueView t={t} />
      )}

    </div>
  );
}
