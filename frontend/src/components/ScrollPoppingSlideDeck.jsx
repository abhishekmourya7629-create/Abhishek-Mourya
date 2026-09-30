import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp, 
  ArrowRight, Layers, Cpu, Award, Zap, Radio, Globe, Sliders,
  MapPin, Check, ExternalLink, BarChart3, TrendingUp
} from 'lucide-react';

const STATS_DATA = [
  { label: 'Citizen Demands Fused', value: '1,531+', change: '+12% this week', desc: 'Real multi-channel inputs across 5 nations' },
  { label: 'Sovereign BRICS Districts', value: '21+', change: '100% Geocoded', desc: 'Sub-ward gazetteer demarcation' },
  { label: 'Critical Unplanned Deficits', value: '32.5%', change: '$0.0M Planned', desc: 'Surfaced from citizen demand hotspots' },
  { label: 'Avg. AI Triage & Dispatch', value: '2m:35s', change: 'Real-time Edge', desc: 'Zero cloud latency or PII leakage' }
];

const HOW_IT_WORKS_STEPS = [
  {
    step: 'Step 1',
    title: 'Multi-Channel Citizen Intake',
    subtitle: 'Voice Mails · WhatsApp · SMS · Web',
    desc: 'Citizens submit grievances in their native tongue. NAGRIK automatically strips PII (Aadhaar, phones, names) and issues an immutable SHA-256 consent token.',
    tags: ['16 kHz ASR', 'Bundelkhandi Hindi', 'Zulu', 'Marathi', 'Russian'],
    cardAccent: '#00e676',
    mockDetails: {
      channel: 'WhatsApp & Voice Notes',
      throughput: '120 req/min',
      privacyStandard: 'IS 17428 Anonymized'
    }
  },
  {
    step: 'Step 2',
    title: 'Sovereign AI Extraction & Geocoding',
    subtitle: 'Google Maps Pinpoint & Deduplication',
    desc: 'Neural entity models extract sector, sub-type, and urgency, while fuzzy gazetteers map village and mohalla names directly to exact Google Maps GPS coordinates.',
    tags: ['Google Maps Exact', 'N-Gram TF-IDF', '0.75 Human Review Threshold'],
    cardAccent: '#10b981',
    mockDetails: {
      hotspotsIdentified: 'Banda, Dharavi, Vhembe',
      zScoreThreshold: 'Gi* > 2.58 (p < 0.01)',
      dedupRate: '94.2% accuracy'
    }
  },
  {
    step: 'Step 3',
    title: 'Explainable Priority & Capital Alignment',
    subtitle: '6-Factor Formula & Public Ledger',
    desc: 'Ranks infrastructure interventions mathematically to eliminate ghost allocations and recommend budget reallocations to policymakers with grounded evidence.',
    tags: ['Demand', 'Deprivation', 'Population', 'Equity', 'Cost-Eff', 'Feasibility'],
    cardAccent: '#06b6d4',
    mockDetails: {
      budgetSimulation: 'Live Sliders',
      auditLedger: 'SHA-256 Public Proof',
      citizenConfirmation: 'IVR Pulse Feedback'
    }
  }
];

const CAPACITY_PROGRAMS = [
  {
    title: 'ASR Dialect Expansion',
    tag: '14 Vernacular Models',
    desc: 'Custom acoustic models fine-tuned on rural dialects with noise cancellation for ambient village background audio.',
    icon: Zap,
    metric: '98.4% Accuracy'
  },
  {
    title: 'Sub-Ward Gazetteer Sync',
    tag: 'Google Maps Hybrid',
    desc: 'Dynamic synchronization with official census blocks and administrative boundaries down to ward and mohalla levels.',
    icon: MapPin,
    metric: '100% Resolved'
  },
  {
    title: 'Ghost Allocation Audits',
    tag: '$18.5M Diverted Funds',
    desc: 'Automated statistical detection of overfunded affluent urban zones with zero grassroots citizen demand.',
    icon: ShieldCheck,
    metric: 'Zero False Flags'
  },
  {
    title: 'Citizen IVR Pulse Feedback',
    tag: 'Bi-Directional Proof',
    desc: 'Automated outbound confirmation calls to citizens once infrastructure works break ground in their ward.',
    icon: Radio,
    metric: '92% Confirmation'
  }
];

const FAQ_ITEMS = [
  {
    q: "How does NAGRIK protect citizen voice notes under the DPDP Act?",
    a: "Every citizen voice note is decoded using in-country neural models. Phone numbers are pseudonymized (e.g. +91 98*** **210) before text is stored, and an immutable SHA-256 consent receipt is generated."
  },
  {
    q: "What is a 'Ghost Allocation' and how does the platform detect it?",
    a: "A Ghost Allocation occurs when public budgets designate millions of dollars to affluent areas (e.g. South Delhi smart poles) that have virtually zero citizen demand, while neighboring rural districts suffer severe unbudgeted water deficits."
  },
  {
    q: "How does Google Maps pinpoint exact district locations?",
    a: "NAGRIK connects sovereign gazetteers to official Google Maps coordinate layers. When a citizen mentions 'Banda Baberu' or 'Dharavi 90ft Road', the system pins exact GPS latitude and longitude with sub-meter accuracy."
  },
  {
    q: "Can the 6-factor priority weights be customized by policymakers?",
    a: "Yes! Policymakers can adjust weights for Demand, Deprivation, Population, Equity, Cost-effectiveness, and Feasibility via live sliders to model specific municipal budget scenarios."
  },
  {
    q: "Does NAGRIK work completely offline without external cloud dependencies?",
    a: "Yes! NAGRIK includes a built-in deterministic offline mock engine that runs 100% locally with zero API keys required, while seamlessly supporting Google Gemini 1.5 Flash when configured."
  }
];

export default function ScrollPoppingSlideDeck({ onOpenChatbot, onExploreMaps, onSimulateIntake }) {
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [spotlightCard, setSpotlightCard] = useState(null);

  // Mouse spotlight for metric cards (matching reference video 00:06 - 00:09)
  const handleCardMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setSpotlightCard(index);
  };

  return (
    <div className="space-y-16 py-8">
      
      {/* 1. Kinetic Scrolling Marquee Banner (Matching Video 00:10 - 00:15) */}
      <div className="relative overflow-hidden py-4 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/15 to-cyan-500/10 border border-emerald-500/25 shadow-xl">
        <div className="flex gap-8 whitespace-nowrap animate-[marquee_25s_linear_infinite] select-none">
          {[1, 2].map((iter) => (
            <div key={iter} className="flex items-center gap-8 text-sm sm:text-base font-heading font-black text-slate-300">
              <span className="text-emerald-400">⚡ SOVEREIGN PUBLIC GOOD</span>
              <span className="text-slate-600">/</span>
              <span className="text-cyan-400">BRICS CITIZEN DEMAND</span>
              <span className="text-slate-600">/</span>
              <span className="text-teal-400">EXPLAINABLE 6-FACTOR PRIORITY</span>
              <span className="text-slate-600">/</span>
              <span className="text-white">ZERO PII LEAKAGE</span>
              <span className="text-slate-600">/</span>
              <span className="text-emerald-300">REAL-TIME INFERENCE AT THE EDGE</span>
              <span className="text-slate-600">/</span>
              <span className="text-teal-300">GOOGLE MAPS PINPOINT</span>
              <span className="text-slate-600">/</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Popping Metric Cards with Cursor Spotlight (Matching Video 00:06 - 00:09) */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            SOVEREIGN TELEMETRY
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
            Real Citizen Demand Signals <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Empowering Transparent Public Capital
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS_DATA.map((st, i) => (
            <div
              key={i}
              onMouseMove={(e) => handleCardMouseMove(e, i)}
              onMouseLeave={() => setSpotlightCard(null)}
              className="relative overflow-hidden rounded-2xl bg-[#080d14]/90 border border-white/10 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 shadow-xl group cursor-default"
            >
              {/* Spotlight Glow Effect */}
              {spotlightCard === i && (
                <div
                  className="pointer-events-none absolute -inset-px transition-opacity opacity-100"
                  style={{
                    background: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 230, 118, 0.22), transparent 75%)`
                  }}
                />
              )}

              <div>
                <span className="text-xs text-slate-400 font-sans block mb-1">
                  {st.label}
                </span>
                <span className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                  {st.value}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  {st.change}
                </span>
                <span className="text-[10px] text-slate-500 truncate max-w-[130px]">
                  {st.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. "How Does It Work?" 3D Stacked Popping Deck (Matching Video 00:19 - 00:25) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#06090c] border border-white/10 p-6 sm:p-12 shadow-2xl">
        
        {/* Background glow wave */}
        <div 
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-[130px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0, 230, 118, 0.25) 0%, rgba(6, 182, 212, 0.12) 50%, transparent 80%)'
          }}
        />

        <div className="relative z-10 text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            ARCHITECTURE WORKFLOW
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            How Does It Work?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Your end-to-end pathway from raw citizen voicemails and WhatsApp texts to explainable municipal infrastructure projects.
          </p>

          {/* Step Selector Pills */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {HOW_IT_WORKS_STEPS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  activeStep === idx
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/70 shadow-lg scale-105'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                <span>{s.step}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3D Stacked Popping Cards Container */}
        <div className="relative max-w-3xl mx-auto h-[320px] flex items-center justify-center">
          {HOW_IT_WORKS_STEPS.map((item, idx) => {
            const isActive = activeStep === idx;
            const diff = idx - activeStep;

            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                style={{
                  transform: isActive 
                    ? 'translateY(0px) scale(1) translateZ(0px)' 
                    : `translateY(${diff * 20}px) scale(${1 - Math.abs(diff) * 0.08}) translateZ(${-Math.abs(diff) * 50}px)`,
                  zIndex: isActive ? 20 : 10 - Math.abs(diff),
                  opacity: isActive ? 1 : 0.45
                }}
                className={`absolute inset-x-0 top-0 rounded-3xl bg-[#0a0f18] border p-6 sm:p-8 transition-all duration-500 cursor-pointer shadow-2xl flex flex-col justify-between ${
                  isActive ? 'border-emerald-500/70 shadow-[0_0_40px_rgba(0,230,118,0.2)]' : 'border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {item.subtitle}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {item.desc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.tags.map((tg, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/10 text-[10px] font-mono text-slate-300">
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                    {Object.entries(item.mockDetails).map(([k, v]) => (
                      <span key={k}>
                        <strong className="text-white capitalize">{k.replace(/([A-Z])/g, ' $1')}:</strong> {v}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (idx === 0 && onSimulateIntake) onSimulateIntake();
                      if (idx === 1 && onExploreMaps) onExploreMaps();
                      if (idx === 2 && onOpenChatbot) onOpenChatbot();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 4. Municipal Capacity Programs Grid (Matching Video 00:30 - 00:35) */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            CAPACITY EXPANSION
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            Municipal Capacity Programs
          </h2>
          <p className="text-xs text-slate-400">
            Enterprise-ready modules for state and city administrations to scale citizen demand intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CAPACITY_PROGRAMS.map((prog, i) => {
            const Icon = prog.icon;
            return (
              <div 
                key={i}
                className="edge-glass-card rounded-2xl p-5 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 border-white/10 hover:border-emerald-500/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 text-emerald-300 border border-emerald-500/30">
                      {prog.tag}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-base text-white mb-1.5">
                    {prog.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {prog.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Benchmark:</span>
                  <span className="text-emerald-400 font-bold">{prog.metric}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Popping Certificate Card with Animated Ring (Matching Video 00:26 - 00:30) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a0f18] to-[#06090c] border border-emerald-500/40 p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 font-mono">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>DPG Standard Certified</span>
          </div>

          <h3 className="font-heading font-black text-2xl sm:text-3xl text-white">
            Digital Public Good Verification
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every citizen demand signal processed on NAGRIK generates a cryptographically signed SHA-256 audit token. Verified against Digital Public Good Alliance Standards with zero proprietary lock-in.
          </p>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2">
            <span>License: <strong className="text-white">Apache 2.0</strong></span>
            <span>Residency: <strong className="text-white">In-Country Sovereign</strong></span>
          </div>
        </div>

        {/* Animated Circular Verification Stamp */}
        <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl bg-[#080d14] border border-emerald-500/30 shadow-2xl">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Outer Rotating Glow Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/40 border-t-emerald-400 animate-spin" />
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/50 flex flex-col items-center justify-center text-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <span className="text-[9px] font-mono text-emerald-300 font-bold uppercase mt-0.5">
                VERIFIED
              </span>
            </div>
          </div>
          <span className="mt-3 font-mono text-[11px] text-slate-300 font-bold">
            TOKEN: SHA256-NAGRIK-2026
          </span>
        </div>
      </div>

      {/* 6. Interactive FAQ Accordion (Matching Video 01:15 - 01:20) */}
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="text-center space-y-1 mb-6">
          <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase">
            Platform Inquiries
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                  isOpen 
                    ? 'bg-[#0a0f18] border-emerald-500/50 shadow-lg' 
                    : 'bg-[#080d14] border-white/10 hover:border-emerald-500/30'
                }`}
                onClick={() => setOpenFaq(isOpen ? -1 : idx)}
              >
                <div className="p-4 flex items-center justify-between gap-4">
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {item.q}
                  </span>
                  <span className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </div>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/5 animate-fadeIn">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
