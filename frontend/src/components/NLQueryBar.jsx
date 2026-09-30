import React, { useState } from 'react';
import { Search, Sparkles, X, Filter } from 'lucide-react';

export default function NLQueryBar({ 
  onExecuteQuery, 
  activeQueryData, 
  onClearQuery, 
  t 
}) {
  const [queryText, setQueryText] = useState('');

  const sampleQueries = [
    "Which districts have high water demand but no planned investment?",
    "Show high demand health gaps without doctors",
    "Find overbudgeted ghost allocations in affluent corridors",
    "Critical road bridge washouts"
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!queryText.trim()) return;
    onExecuteQuery(queryText.trim());
  };

  const handlePillClick = (q) => {
    setQueryText(q);
    onExecuteQuery(q);
  };

  const filters = activeQueryData?.parsed_filters || {};
  const hasFilters = Object.keys(filters).length > 0;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800">
      
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 mb-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder={t.dashboard.nlSearchPlaceholder}
            className="w-full bg-slate-900/90 text-sm text-slate-100 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-cyan-400 placeholder:text-slate-500 shadow-inner"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI Policy Engine</span>
        </button>
      </form>

      {/* Sample Question Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs text-slate-400">
        <span className="shrink-0 text-[11px] text-slate-500 font-medium">Try asking:</span>
        {sampleQueries.map((sample, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handlePillClick(sample)}
            className="px-2.5 py-1 rounded-lg bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all shrink-0 text-[11px]"
          >
            "{sample}"
          </button>
        ))}
      </div>

      {/* Active AI Parsed Filters Chip Display */}
      {hasFilters && (
        <div className="mt-3.5 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
              <Filter className="w-3 h-3" />
              {t.dashboard.filterActive}:
            </span>

            {filters.sector && (
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Sector: {filters.sector}
              </span>
            )}

            {filters.gap_status && (
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-500/15 text-rose-300 border border-rose-500/30">
                Status: {filters.gap_status === 'unplanned_gap' ? 'Critical Deficit' : filters.gap_status}
              </span>
            )}

            {filters.district && (
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                District: {filters.district}
              </span>
            )}

            {filters.min_priority_score && (
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Min Score: {filters.min_priority_score}
              </span>
            )}

            <span className="text-[11px] text-slate-400 italic">
              ({activeQueryData.matched_count || 0} matched projects)
            </span>
          </div>

          <button
            onClick={() => {
              setQueryText('');
              onClearQuery();
            }}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
          >
            <X className="w-3 h-3" />
            <span>{t.dashboard.clearFilters}</span>
          </button>
        </div>
      )}

    </div>
  );
}
