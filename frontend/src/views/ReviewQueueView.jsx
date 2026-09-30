import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, AlertTriangle, Edit3, 
  RefreshCw, Check, ArrowRight, ShieldAlert, UserCheck 
} from 'lucide-react';

export default function ReviewQueueView({ t }) {
  const [queueItems, setQueueItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [correctedSector, setCorrectedSector] = useState('');
  const [correctedSeverity, setCorrectedSeverity] = useState('');
  const [reviewerNotes, setReviewerNotes] = useState('');

  useEffect(() => {
    fetchReviewQueue();
  }, []);

  const fetchReviewQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/review-queue');
      if (res.ok) {
        const data = await res.json();
        setQueueItems(data);
      }
    } catch (err) {
      console.error('Failed to load review queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (itemId, action) => {
    try {
      const res = await fetch(`/api/review-queue/${itemId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          corrected_sector: correctedSector || undefined,
          corrected_severity: correctedSeverity || undefined,
          reviewer_notes: reviewerNotes || `Supervisor ${action} completed`
        })
      });

      if (res.ok) {
        setQueueItems(prev => prev.filter(item => item.id !== itemId));
        setEditingItem(null);
        setCorrectedSector('');
        setCorrectedSeverity('');
        setReviewerNotes('');
      }
    } catch (err) {
      console.error('Review action failed:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            {t.review.title}
          </h2>
          <p className="text-xs text-slate-400">
            {t.review.subtitle}
          </p>
        </div>

        <button
          onClick={fetchReviewQueue}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue ({queueItems.length})</span>
        </button>
      </div>

      {/* Queue Items List */}
      {queueItems.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 mx-auto flex items-center justify-center text-emerald-400 mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="font-heading font-bold text-base text-white">
            {t.review.emptyState}
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            All incoming citizen complaints currently satisfy autonomous high-confidence criteria. New low-confidence inputs will route here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {queueItems.map((item) => {
            const isEditing = editingItem === item.id;
            const ext = item.extracted || {};

            return (
              <div 
                key={item.id}
                className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                {/* Item Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-cyan-400 font-bold">
                      {item.request_id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                      {item.channel}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-amber-300">
                      Lang: {item.detected_language}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">AI Confidence:</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      {(item.confidence * 100).toFixed(0)}% (Low)
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Original Native Input
                    </span>
                    <p className="text-slate-200 leading-relaxed font-sans">
                      {item.original_text}
                    </p>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      English Pivot Translation
                    </span>
                    <p className="text-cyan-300 leading-relaxed font-sans">
                      {item.translated_text}
                    </p>
                  </div>
                </div>

                {/* Supervisor Reason */}
                <div className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{item.reviewer_notes}</span>
                </div>

                {/* Inline Editing Controls */}
                {isEditing && (
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-cyan-500/40 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">Correct Sector</label>
                      <select
                        value={correctedSector || ext.sector || 'water'}
                        onChange={(e) => setCorrectedSector(e.target.value)}
                        className="w-full bg-slate-950 text-slate-200 p-2 rounded-lg border border-slate-700"
                      >
                        <option value="water">water</option>
                        <option value="roads">roads</option>
                        <option value="health">health</option>
                        <option value="electricity">electricity</option>
                        <option value="broadband">broadband</option>
                        <option value="schools">schools</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">Correct Severity</label>
                      <select
                        value={correctedSeverity || ext.severity || 'high'}
                        onChange={(e) => setCorrectedSeverity(e.target.value)}
                        className="w-full bg-slate-950 text-slate-200 p-2 rounded-lg border border-slate-700"
                      >
                        <option value="critical">critical</option>
                        <option value="high">high</option>
                        <option value="medium">medium</option>
                        <option value="low">low</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">Supervisor Notes</label>
                      <input
                        type="text"
                        value={reviewerNotes}
                        onChange={(e) => setReviewerNotes(e.target.value)}
                        placeholder="Correction rationale..."
                        className="w-full bg-slate-950 text-slate-200 p-2 rounded-lg border border-slate-700"
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      if (isEditing) {
                        setEditingItem(null);
                      } else {
                        setEditingItem(item.id);
                        setCorrectedSector(ext.sector || 'water');
                        setCorrectedSeverity(ext.severity || 'high');
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? "Cancel Edit" : "Edit Classification"}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(item.id, 'reject')}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{t.review.reject}</span>
                    </button>

                    <button
                      onClick={() => handleAction(item.id, 'approve')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.review.approve}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
