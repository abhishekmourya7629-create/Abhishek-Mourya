import React, { useState, useEffect } from 'react';
import { 
  Scale, Shield, Lock, FileCode, CheckCircle2, 
  AlertTriangle, Eye, UserX, Database, RefreshCw 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

export default function TrustCenterView({ selectedCountry, regime, t }) {
  const [biasData, setBiasData] = useState(null);
  const [auditLog, setAuditLog] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedCountry]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [biasRes, auditRes] = await Promise.all([
        fetch(`/api/trust/bias-metrics?country=${selectedCountry}`),
        fetch(`/api/trust/audit-log?limit=30&country=${selectedCountry}`)
      ]);
      if (biasRes.ok) setBiasData(await biasRes.json());
      if (auditRes.ok) setAuditLog(await auditRes.json());
    } catch (err) {
      console.error('Failed to load trust data:', err);
    } finally {
      setLoading(false);
    }
  };

  const districtRates = biasData?.district_rates_per_1k || [];
  const underrepresented = biasData?.underrepresented_districts || [];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Title */}
      <div>
        <h2 className="font-heading font-extrabold text-xl text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-cyan-400" />
          {t.trust.title}
        </h2>
        <p className="text-xs text-slate-400">
          {t.trust.subtitle}
        </p>
      </div>

      {/* Sovereign Regulatory Profile Box */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
              Sovereign Data Governance
            </span>
            <h3 className="font-heading font-bold text-base text-white">
              {regime?.regime_name || 'National Data Standard'}
            </h3>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5" />
            {regime?.residency || 'Sovereign In-Country Cloud'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">
              Consent Standard
            </span>
            <p className="text-slate-200 font-medium leading-relaxed">
              {regime?.consent_mechanism || 'Notice & Explicit Consent'}
            </p>
          </div>

          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">
              PII Retention Limit
            </span>
            <p className="text-slate-200 font-medium">
              {regime?.pii_retention_days || 90} Days Automatic Redaction
            </p>
          </div>

          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">
              DPO Contact
            </span>
            <p className="font-mono text-cyan-300 truncate">
              {regime?.dpo_contact || 'dpo@gov.in'}
            </p>
          </div>
        </div>

        <div className="pt-1">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
            Enforced Citizen Statutory Rights:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(regime?.citizen_rights || ["Right to Access", "Right to Correction", "Right to Erasure"]).map((r, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-300 border border-slate-800">
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bias Monitoring Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* District Representation Rates (Recharts) */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-sm text-white">
                Citizen Demand Rate per 1,000 People by District
              </h3>
              <p className="text-xs text-slate-400">
                Flagging digital divide discrepancies across sovereign territories
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Fairness Score</span>
              <span className="font-heading font-extrabold text-lg text-emerald-400">
                {biasData?.fairness_index_score || 88.4} / 100
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtRates} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="district" type="category" stroke="#94a3b8" fontSize={11} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Bar dataKey="rate_per_1k" radius={[0, 4, 4, 0]}>
                  {districtRates.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.rate_per_1k < 0.04 ? '#f43f5e' : (entry.rate_per_1k > 0.15 ? '#38bdf8' : '#0ea5e9')} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Underrepresented Area Interventions */}
          {underrepresented.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                Under-Represented Districts Requiring Offline Outreach:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {underrepresented.map((u, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/25">
                    <div className="font-bold text-slate-200">{u.district} ({u.rate_per_1k} / 1k pop)</div>
                    <div className="text-slate-400 mt-0.5">{u.intervention_suggested}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Urban vs Rural & Gender Breakdowns */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <h4 className="font-heading font-bold text-sm text-white">
              {t.trust.urbanRural}
            </h4>
            
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Rural Districts</span>
                  <span className="font-bold text-cyan-300">{biasData?.urban_rural_split?.rural_pct || 58.8}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${biasData?.urban_rural_split?.rural_pct || 58.8}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Urban / Suburban Centers</span>
                  <span className="font-bold text-amber-300">{biasData?.urban_rural_split?.urban_pct || 41.2}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${biasData?.urban_rural_split?.urban_pct || 41.2}%` }} />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic pt-1">
              {biasData?.urban_rural_split?.balance_status}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <h4 className="font-heading font-bold text-sm text-white">
              {t.trust.genderSplit}
            </h4>
            <div className="space-y-2 text-xs">
              {(biasData?.gender_split || []).map((g, i) => (
                <div key={i} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex justify-between font-semibold text-slate-200 mb-0.5">
                    <span>{g.segment}</span>
                    <span className="text-cyan-400">{g.pct}%</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Key demand: {g.primary_sectors?.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Cryptographic Audit Trail */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              {t.trust.auditTrailTitle}
            </h3>
            <p className="text-xs text-slate-400">
              SHA-256 signed tamper-evident ledger logging all AI decisions and human actions
            </p>
          </div>

          <button
            onClick={fetchData}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
            title="Refresh Audit Records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/60 max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 sticky top-0 border-b border-slate-800">
              <tr>
                <th className="p-3 font-semibold">Timestamp</th>
                <th className="p-3 font-semibold">Actor</th>
                <th className="p-3 font-semibold">Action</th>
                <th className="p-3 font-semibold">Details</th>
                <th className="p-3 font-semibold">Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {auditLog.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40">
                  <td className="p-3 text-slate-400 whitespace-nowrap">
                    {log.timestamp?.slice(0, 19).replace('T', ' ')}
                  </td>
                  <td className="p-3 text-cyan-300 font-sans font-medium whitespace-nowrap">
                    {log.actor}
                  </td>
                  <td className="p-3 text-amber-300 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="p-3 text-slate-300 font-sans max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="p-3 text-emerald-400">
                    #{log.hash_signature}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
