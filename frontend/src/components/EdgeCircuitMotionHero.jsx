import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, Mic, MessageSquare, 
  MapPin, Sliders, Zap, Cpu, Radio, Shield, RotateCcw 
} from 'lucide-react';

const FLOATING_HERO_TOKENS = [
  { text: '(1,531 Demands)', top: '12%', left: '8%', delay: '0s' },
  { text: '[w1...w6 Formula]', top: '15%', right: '10%', delay: '1s' },
  { text: 'Σ Getis-Ord Gi*', bottom: '10%', left: '12%', delay: '2s' },
  { text: '(12+12)', bottom: '15%', right: '14%', delay: '1.5s' },
  { text: '0.15 Index Deficit', top: '48%', right: '4%', delay: '0.5s' }
];

export default function EdgeCircuitMotionHero({ onExploreMaps, onSimulateIntake, onReplayIntro }) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [activeNode, setActiveNode] = useState(null);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden rounded-3xl bg-[#06090c] border border-white/10 p-6 md:p-12 mb-8 shadow-[0_0_60px_-15px_rgba(0,230,118,0.35)] transition-all"
    >
      {/* 1. Volumetric Emerald Neon Radiant Flare from Top-Right (matching reference link) */}
      <div 
        className="pointer-events-none absolute -top-28 -right-28 w-[600px] h-[600px] rounded-full blur-[130px] transition-transform duration-700 ease-out"
        style={{
          background: `radial-gradient(circle, rgba(0, 230, 118, 0.45) 0%, rgba(16, 185, 129, 0.18) 40%, transparent 70%)`,
          transform: `translate(${(mousePos.x - 0.5) * 45}px, ${(mousePos.y - 0.5) * 45}px)`
        }}
      />

      {/* Subtle Cyan Counter-Glow on Bottom-Left */}
      <div 
        className="pointer-events-none absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full blur-[110px]"
        style={{
          background: `radial-gradient(circle, rgba(6, 182, 212, 0.16) 0%, transparent 70%)`
        }}
      />

      {/* Floating Mathematical Tokens (matching reference video 00:01 - 00:05) */}
      {FLOATING_HERO_TOKENS.map((tk, idx) => (
        <span
          key={idx}
          style={{
            top: tk.top,
            bottom: tk.bottom,
            left: tk.left,
            right: tk.right,
            animationDelay: tk.delay
          }}
          className="absolute font-mono font-bold text-xs text-emerald-400/40 select-none animate-float pointer-events-none hidden sm:inline"
        >
          {tk.text}
        </span>
      ))}

      {/* 2. Top Header Announcement Pill & Replay Motion */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
        
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-emerald-500/30 text-xs text-emerald-300 font-mono shadow-sm backdrop-blur-md animate-float">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>✨ Sovereign Multilingual AI 2.0 · Live Edge Intake</span>
          </div>

          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              title="Replay Cinematic Emerald Entrance Loading Screen"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 text-xs font-mono transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">Replay Loading Screen</span>
            </button>
          )}
        </div>

        {/* Display Headline matching "Inference at the Edge" */}
        <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
          Demand Intelligence <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            at the Edge
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
          Aggregating citizen requests via voice notes, messaging and text across BRICS nations.
          Real-time neural entity extraction, demographic fusion, and explainable infrastructure prioritization.
        </p>

        {/* Glowing Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onExploreMaps}
            className="px-6 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm text-[#06090c] edge-glow-button flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Google Maps</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onSimulateIntake}
            className="px-6 py-2.5 rounded-xl font-heading font-semibold text-xs sm:text-sm text-slate-200 bg-white/[0.05] hover:bg-emerald-500/20 hover:text-emerald-300 border border-white/15 hover:border-emerald-500/40 transition-all cursor-pointer backdrop-blur-md"
          >
            <span>Simulate Citizen Voice</span>
          </button>
        </div>

      </div>

      {/* 3. Interactive Neural Circuit Board & AI Core (matching reference video) */}
      <div className="relative mt-12 pt-6 pb-2 max-w-4xl mx-auto">
        
        {/* Background SVG Animated Circuit Traces with Traveling Photon Energy Packets */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" 
          viewBox="0 0 800 240" 
          fill="none"
        >
          <defs>
            <filter id="photonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Left Branch 1 (Voice Node) */}
          <path
            id="circuitPathVoice"
            d="M 180 60 H 320 C 350 60, 370 100, 390 120"
            stroke="rgba(0, 230, 118, 0.25)"
            strokeWidth="1.5"
          />
          <path
            d="M 180 60 H 320 C 350 60, 370 100, 390 120"
            stroke="#00e676"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="animate-circuit-trace"
          />
          {/* Traveling Photon Bead 1 */}
          <circle r="4" fill="#ffffff" stroke="#00ff88" strokeWidth="2" filter="url(#photonGlow)">
            <animateMotion 
              path="M 180 60 H 320 C 350 60, 370 100, 390 120" 
              dur="2.4s" 
              repeatCount="indefinite" 
            />
          </circle>

          {/* Left Branch 2 (WhatsApp Node) */}
          <path
            id="circuitPathMsg"
            d="M 180 180 H 320 C 350 180, 370 140, 390 120"
            stroke="rgba(0, 230, 118, 0.25)"
            strokeWidth="1.5"
          />
          <path
            d="M 180 180 H 320 C 350 180, 370 140, 390 120"
            stroke="#00e676"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="animate-circuit-trace"
            style={{ animationDelay: '1.2s' }}
          />
          {/* Traveling Photon Bead 2 */}
          <circle r="4" fill="#ffffff" stroke="#00ff88" strokeWidth="2" filter="url(#photonGlow)">
            <animateMotion 
              path="M 180 180 H 320 C 350 180, 370 140, 390 120" 
              dur="2.8s" 
              begin="1s"
              repeatCount="indefinite" 
            />
          </circle>

          {/* Right Branch 1 (Google Maps City Node) */}
          <path
            id="circuitPathMaps"
            d="M 410 120 C 430 100, 450 60, 480 60 H 620"
            stroke="rgba(0, 230, 118, 0.25)"
            strokeWidth="1.5"
          />
          <path
            d="M 410 120 C 430 100, 450 60, 480 60 H 620"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="animate-circuit-trace"
            style={{ animationDelay: '0.6s' }}
          />
          {/* Traveling Photon Bead 3 */}
          <circle r="4" fill="#ffffff" stroke="#00e676" strokeWidth="2" filter="url(#photonGlow)">
            <animateMotion 
              path="M 410 120 C 430 100, 450 60, 480 60 H 620" 
              dur="2.2s" 
              begin="0.5s"
              repeatCount="indefinite" 
            />
          </circle>

          {/* Right Branch 2 (Priority Engine Node) */}
          <path
            id="circuitPathPriority"
            d="M 410 120 C 430 140, 450 180, 480 180 H 620"
            stroke="rgba(0, 230, 118, 0.25)"
            strokeWidth="1.5"
          />
          <path
            d="M 410 120 C 430 140, 450 180, 480 180 H 620"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="animate-circuit-trace"
            style={{ animationDelay: '1.8s' }}
          />
          {/* Traveling Photon Bead 4 */}
          <circle r="4" fill="#ffffff" stroke="#00e676" strokeWidth="2" filter="url(#photonGlow)">
            <animateMotion 
              path="M 410 120 C 430 140, 450 180, 480 180 H 620" 
              dur="2.6s" 
              begin="1.5s"
              repeatCount="indefinite" 
            />
          </circle>
        </svg>

        {/* Central Pulsing AI Microchip Core */}
        <div className="relative z-10 flex items-center justify-between">
          
          {/* Left Peripheral Nodes: Channels */}
          <div className="space-y-12">
            
            {/* Node 1: Voice Note ASR */}
            <div 
              onMouseEnter={() => setActiveNode('voice')}
              onMouseLeave={() => setActiveNode(null)}
              onClick={onSimulateIntake}
              className={`p-3 rounded-2xl bg-[#080d14]/90 border transition-all cursor-pointer backdrop-blur-md flex items-center gap-3 shadow-lg group ${
                activeNode === 'voice' 
                  ? 'border-emerald-500 shadow-emerald-500/30 scale-105' 
                  : 'border-white/10 hover:border-emerald-500/50 hover:shadow-emerald-500/10'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Mic className="w-4 h-4" />
              </div>
              <div className="text-left pr-2">
                <span className="text-[11px] font-bold text-white block">
                  Voice Note ASR
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  Hindi · Zulu · Russian
                </span>
              </div>
            </div>

            {/* Node 2: WhatsApp & SMS Intake */}
            <div 
              onMouseEnter={() => setActiveNode('messaging')}
              onMouseLeave={() => setActiveNode(null)}
              onClick={onSimulateIntake}
              className={`p-3 rounded-2xl bg-[#080d14]/90 border transition-all cursor-pointer backdrop-blur-md flex items-center gap-3 shadow-lg group ${
                activeNode === 'messaging' 
                  ? 'border-emerald-500 shadow-emerald-500/30 scale-105' 
                  : 'border-white/10 hover:border-emerald-500/50 hover:shadow-emerald-500/10'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-left pr-2">
                <span className="text-[11px] font-bold text-white block">
                  WhatsApp & SMS
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  Multi-Channel Ingest
                </span>
              </div>
            </div>

          </div>

          {/* Central AI Microchip */}
          <div className="relative group cursor-pointer">
            {/* Ambient Radial Energy Ring */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 blur-xl opacity-50 group-hover:opacity-90 transition-opacity duration-500 animate-pulse"></div>

            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#080d14] border-2 border-emerald-500/70 p-2 flex flex-col items-center justify-center text-center shadow-2xl animate-pulse-glow group-hover:scale-105 transition-transform">
              
              {/* Microchip Pins Top & Bottom */}
              <div className="absolute -top-1.5 inset-x-4 flex justify-between">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-xs bg-emerald-400 shadow-sm shadow-emerald-400"></div>
                ))}
              </div>
              <div className="absolute -bottom-1.5 inset-x-4 flex justify-between">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-xs bg-emerald-400 shadow-sm shadow-emerald-400"></div>
                ))}
              </div>

              {/* Bold "AI" in center */}
              <span className="font-heading font-black text-2xl sm:text-3xl tracking-wider text-white">
                AI
              </span>
              <span className="text-[9px] font-mono text-emerald-400 font-semibold tracking-widest uppercase">
                NAGRIK CORE
              </span>

              {/* Micro status light */}
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 mt-1 shadow-sm shadow-cyan-300 animate-pulse"></div>
            </div>
          </div>

          {/* Right Peripheral Nodes: Outputs */}
          <div className="space-y-12">
            
            {/* Node 3: Google Maps City Grid */}
            <div 
              onMouseEnter={() => setActiveNode('maps')}
              onMouseLeave={() => setActiveNode(null)}
              onClick={onExploreMaps}
              className={`p-3 rounded-2xl bg-[#080d14]/90 border transition-all cursor-pointer backdrop-blur-md flex items-center gap-3 shadow-lg group ${
                activeNode === 'maps' 
                  ? 'border-emerald-500 shadow-emerald-500/30 scale-105' 
                  : 'border-white/10 hover:border-emerald-500/50 hover:shadow-emerald-500/10'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-left pr-2">
                <span className="text-[11px] font-bold text-white block">
                  Google Maps Cities
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  Exact GPS Pinpoint
                </span>
              </div>
            </div>

            {/* Node 4: Explainable Priority Engine */}
            <div 
              onMouseEnter={() => setActiveNode('priority')}
              onMouseLeave={() => setActiveNode(null)}
              onClick={() => onExploreMaps && onExploreMaps()}
              className={`p-3 rounded-2xl bg-[#080d14]/90 border transition-all cursor-pointer backdrop-blur-md flex items-center gap-3 shadow-lg group ${
                activeNode === 'priority' 
                  ? 'border-emerald-500 shadow-emerald-500/30 scale-105' 
                  : 'border-white/10 hover:border-emerald-500/50 hover:shadow-emerald-500/10'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                <Sliders className="w-4 h-4" />
              </div>
              <div className="text-left pr-2">
                <span className="text-[11px] font-bold text-white block">
                  Priority Engine
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  6 Transparent Weights
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
