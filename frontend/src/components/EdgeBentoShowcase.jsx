import React, { useState } from 'react';
import { 
  Mic, MessageSquare, MapPin, Sliders, ShieldCheck, 
  Cpu, ArrowRight, Zap, CheckCircle2, Sparkles, Volume2 
} from 'lucide-react';

const SHOWCASE_TABS = [
  {
    id: 'voice',
    title: 'Voice Note ASR',
    badge: 'Hindi · Marathi · Zulu · Russian',
    icon: Mic,
    headline: 'Phonetic Dialect Transcription at 28ms Latency',
    description: 'Converts rural audio notes and informal voicemails directly into normalized text, preserving local vernacular without loss of context.',
    sample: '"बांदा में पिछले तीन हफ्ते से पानी की टंकी सूखी पड़ी है, कृपया तुरंत नया पाइपलाइन बिछाएं।"',
    telemetry: { accuracy: '98.4%', dialect: 'Bundelkhandi Hindi', bitrate: '16 kHz Mono', latency: '28ms' },
    codeSnippet: 'simulate_asr(audio_bytes) -> { text: "...", confidence: 0.98 }'
  },
  {
    id: 'extraction',
    title: 'Multilingual Extraction',
    badge: 'DPDP & BRICS Scrubbed',
    icon: Cpu,
    headline: 'Neural Entity Extraction with Zero PII Leakage',
    description: 'Identifies infrastructure sector, required action, urgency, and citizen sentiment while automatically redacting Aadhaar, phone numbers, and names.',
    sample: 'PII Scrubbed: "[CITIZEN_ID_REDACTED] requested urgent borehole repair at [COORDS_BANDA]"',
    telemetry: { sector: 'Water & Sanitation', urgency: 'Critical (0.94)', sentiment: 'Distressed', privacyStandard: 'ISO 27701' },
    codeSnippet: 'extract_entities(text) -> { sector: "Water", urgency: 0.94, pii_scrubbed: true }'
  },
  {
    id: 'geocoding',
    title: 'Google Maps Gazetteer',
    badge: 'Exact GPS Coordinates',
    icon: MapPin,
    headline: 'Sub-Ward Geocoding & GPS Demarcation',
    description: 'Resolves ambiguous village and mohalla names against sovereign gazetteers, linking citizen demands to exact Google Maps coordinates.',
    sample: 'Resolved: Banda District, Uttar Pradesh (GPS: 25.4754° N, 80.3347° E) · Ward 14',
    telemetry: { confidence: '99.1%', subWard: 'Kalu Kuan Mohalla', censusCode: 'UP-BAN-04', mapProvider: 'Google Maps Hybrid' },
    codeSnippet: 'geocode_location("Banda") -> { lat: 25.4754, lon: 80.3347, status: "VERIFIED" }'
  },
  {
    id: 'priority',
    title: '6-Factor Priority Formula',
    badge: '100% Explainable AI',
    icon: Sliders,
    headline: 'Mathematical Deprivation & Impact Weighting',
    description: 'Ranks projects using transparent civic formulas with zero black-box bias: Demand + Deprivation + Population + Equity + Cost-Eff + Feasibility.',
    sample: 'Score = (0.25×92) + (0.20×88) + (0.15×85) + (0.15×90) + (0.15×78) + (0.10×84) = 86.7 / 100',
    telemetry: { rank: '#1 Recommended', roiEstimate: '4.8x Civic Value', beneficiaries: '14,200 Citizens', auditHash: 'SHA-256 Verified' },
    codeSnippet: 'compute_priority(factors, weights) -> score: 86.7, reason: "Severe Water Deprivation"'
  }
];

export default function EdgeBentoShowcase({ onTryPipeline, onOpenMaps }) {
  const [activeTab, setActiveTab] = useState(SHOWCASE_TABS[0]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#06090c] border border-white/10 p-6 md:p-10 shadow-2xl mb-8">
      {/* Ambient emerald glow in top-right */}
      <div 
        className="pointer-events-none absolute -top-20 -right-20 w-[450px] h-[450px] rounded-full blur-[110px]"
        style={{
          background: 'radial-gradient(circle, rgba(0, 230, 118, 0.28) 0%, transparent 70%)'
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-emerald-500/30 text-xs text-emerald-300 font-mono shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sovereign Intelligence Architecture</span>
        </div>

        <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
          Use Citizen Intelligence Faster <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            and More Transparently at the Edge
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
          NAGRIK decentralizes civic data pipelines directly to sovereign municipal zones. Explore how each neural layer executes with instant deterministic speed.
        </p>
      </div>

      {/* Interactive Bento Navigation Tabs */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-8">
        {SHOWCASE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab.id === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2.5 ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 shadow-lg shadow-emerald-500/20 scale-105'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/10'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{tab.title}</span>
            </button>
          );
        })}
      </div>

      {/* Bento Active Showcase Card */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Interactive Details & Code Snippet (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#080d14]/90 border border-emerald-500/30 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {activeTab.badge}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Edge Model</span>
              </div>
            </div>

            <h3 className="font-heading font-extrabold text-xl text-white mb-2">
              {activeTab.headline}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {activeTab.description}
            </p>

            {/* Live Sample Box */}
            <div className="rounded-xl bg-[#05080c] border border-white/10 p-3.5 mb-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Citizen Inflow Sample:
              </span>
              <p className="text-xs text-emerald-200 font-mono italic">
                {activeTab.sample}
              </p>
            </div>

            {/* Code Pipeline Callout */}
            <div className="rounded-xl bg-black/60 border border-white/10 p-3 font-mono text-[11px] text-slate-300 flex items-center justify-between">
              <code>{activeTab.codeSnippet}</code>
              <span className="text-emerald-400 text-[10px] font-bold">EDGE EXEC</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-6 border-t border-white/10">
            <button
              onClick={onTryPipeline}
              className="px-5 py-2 rounded-xl text-xs font-heading font-bold text-[#06090c] edge-glow-button flex items-center gap-2 cursor-pointer"
            >
              <span>Test Intake Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenMaps}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.05] hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 transition-colors cursor-pointer"
            >
              <span>View On Google Maps</span>
            </button>
          </div>
        </div>

        {/* Right: Live Telemetry Matrix (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#080d14]/80 border border-white/10 p-6 flex flex-col justify-between">
          <div>
            <h4 className="font-heading font-bold text-sm text-white mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Edge Telemetry</span>
            </h4>
            <p className="text-[11px] text-slate-400 mb-4">
              Real-time benchmarks recorded across active municipal gateways.
            </p>

            {/* Key/Value Telemetry Grid */}
            <div className="space-y-3">
              {Object.entries(activeTab.telemetry).map(([key, val]) => (
                <div 
                  key={key} 
                  className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs font-mono"
                >
                  <span className="text-slate-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}:
                  </span>
                  <span className="font-bold text-emerald-300">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-6 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Sovereign Security:</span>
            <span className="text-emerald-400 font-bold">100% IN-COUNTRY</span>
          </div>
        </div>

      </div>

    </div>
  );
}
