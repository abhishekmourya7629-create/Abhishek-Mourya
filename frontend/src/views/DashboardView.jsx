import React, { useState, useEffect } from 'react';
import { 
  Building2, Activity, AlertTriangle, ShieldCheck, 
  HelpCircle, CheckCircle2, Sliders, Layers, Sparkles 
} from 'lucide-react';
import MapView from '../components/MapView';
import PrioritySliders from '../components/PrioritySliders';
import ProjectCard from '../components/ProjectCard';
import ExplainabilityModal from '../components/ExplainabilityModal';
import GapMatrixView from '../components/GapMatrixView';
import NLQueryBar from '../components/NLQueryBar';
import ScenarioSimulator from '../components/ScenarioSimulator';

export default function DashboardView({ 
  selectedCountry, 
  t 
}) {
  const [stats, setStats] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [gapData, setGapData] = useState(null);
  const [selectedSector, setSelectedSector] = useState('all');
  const [weights, setWeights] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activeGapFilter, setActiveGapFilter] = useState(null);
  const [activeNLQuery, setActiveNLQuery] = useState(null);
  const [selectedExplainProject, setSelectedExplainProject] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load stats and district map data on country change
  useEffect(() => {
    fetchStats();
    fetchDistricts();
    fetchGaps();
  }, [selectedCountry]);

  // Recalculate recommendations when country, sector, or weights change
  useEffect(() => {
    fetchRecommendations();
  }, [selectedCountry, selectedSector, weights]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/stats/overview?country=${selectedCountry}`);
      if (res.ok) setStats(await res.json());
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchDistricts = async () => {
    try {
      const res = await fetch(`/api/districts/fused?country=${selectedCountry}`);
      if (res.ok) setDistricts(await res.json());
    } catch (err) {
      console.error('Failed to fetch fused districts:', err);
    }
  };

  const fetchGaps = async () => {
    try {
      const res = await fetch(`/api/analytics/gaps?country=${selectedCountry}`);
      if (res.ok) setGapData(await res.json());
    } catch (err) {
      console.error('Failed to fetch gaps:', err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await fetch(`/api/priority/recommendations?country=${selectedCountry}&sector=${selectedSector}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weights || {})
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data);
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    }
  };

  const handleNLQuery = async (queryText) => {
    try {
      const res = await fetch('/api/query/natural-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText, country: selectedCountry })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveNLQuery(data);
        if (data.results) {
          setRecommendations(data.results);
        }
      }
    } catch (err) {
      console.error('NL query failed:', err);
    }
  };

  const handleClearNLQuery = () => {
    setActiveNLQuery(null);
    fetchRecommendations();
  };

  const handleProjectAction = async (projectId, action) => {
    try {
      const res = await fetch(`/api/priority/action/${projectId}?country=${selectedCountry}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, policymaker_notes: `Action taken from Policy Command Center: ${action}` })
      });
      if (res.ok) {
        // Update local state
        setRecommendations(prev => prev.map(p => p.id === projectId ? { ...p, status: action } : p));
        fetchStats();
      }
    } catch (err) {
      console.error('Project action failed:', err);
    }
  };

  // Filter recommendations based on active gap filter if set
  let displayedProjects = recommendations;
  if (activeGapFilter) {
    displayedProjects = displayedProjects.filter(p => p.gap_status === activeGapFilter);
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: t.dashboard.stats.totalRequests, val: stats?.total_requests || 0, color: 'text-emerald-400', icon: Building2 },
          { label: t.dashboard.stats.activeHotspots, val: stats?.active_hotspots || 0, color: 'text-rose-400', icon: AlertTriangle },
          { label: t.dashboard.stats.unplannedGaps, val: stats?.critical_unplanned_gaps || 0, color: 'text-amber-400', icon: HelpCircle },
          { label: t.dashboard.stats.ghostAllocations, val: stats?.ghost_allocations || 0, color: 'text-teal-400', icon: Activity },
          { label: t.dashboard.stats.pendingReviews, val: stats?.pending_human_reviews || 0, color: 'text-cyan-400', icon: CheckCircle2 },
          { label: t.dashboard.stats.auditTrail, val: stats?.audit_trail_entries || 0, color: 'text-emerald-400', icon: ShieldCheck },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="edge-glass-card rounded-2xl p-3.5 border border-white/10 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider truncate">
                  {item.label}
                </span>
                <Icon className={`w-3.5 h-3.5 ${item.color}`} />
              </div>
              <span className={`font-heading font-extrabold text-xl ${item.color}`}>
                {item.val.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Natural Language Query Bar */}
      <NLQueryBar
        onExecuteQuery={handleNLQuery}
        activeQueryData={activeNLQuery}
        onClearQuery={handleClearNLQuery}
        t={t}
      />

      {/* Main Grid: Interactive Map + Gap Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <MapView
            districts={districts}
            selectedCountry={selectedCountry}
            selectedSector={selectedSector}
            setSelectedSector={setSelectedSector}
            t={t}
          />
        </div>
        <div className="lg:col-span-4">
          <GapMatrixView
            gapData={gapData}
            onSelectGapFilter={setActiveGapFilter}
            activeFilter={activeGapFilter}
            t={t}
          />
        </div>
      </div>

      {/* Dynamic Priority Weight Sliders */}
      <PrioritySliders
        weights={weights}
        setWeights={setWeights}
        t={t}
      />

      {/* Ranked Project Recommendations */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              {t.dashboard.priorityTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {t.dashboard.prioritySubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              Showing {displayedProjects.length} candidate interventions
            </span>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedProjects.slice(0, 12).map((proj, idx) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              rank={idx + 1}
              onExplain={setSelectedExplainProject}
              onAction={handleProjectAction}
              t={t}
            />
          ))}
        </div>
      </div>

      {/* Policy Scenario Simulator */}
      <ScenarioSimulator
        country={selectedCountry}
        weights={weights}
        selectedSector={selectedSector}
        t={t}
      />

      {/* Explainability Deep-Dive Modal */}
      <ExplainabilityModal
        project={selectedExplainProject}
        isOpen={!!selectedExplainProject}
        onClose={() => setSelectedExplainProject(null)}
      />

    </div>
  );
}
