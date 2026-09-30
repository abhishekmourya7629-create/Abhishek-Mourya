import React, { useState, useEffect } from 'react';
import { Zap, Sparkles, ShieldCheck } from 'lucide-react';

const FLOATING_SYMBOLS = [
  { text: '(1,531 Demands)', top: '18%', left: '15%', size: 'text-xs sm:text-sm', delay: '0s' },
  { text: '[w1...w6 Formula]', top: '25%', right: '18%', size: 'text-xs sm:text-sm', delay: '1s' },
  { text: 'Σ Getis-Ord Gi*', top: '65%', left: '12%', size: 'text-sm sm:text-base', delay: '2s' },
  { text: '(12+12)', top: '75%', right: '22%', size: 'text-xs', delay: '1.5s' },
  { text: 'DPDP 2023 · ISO 27701', top: '82%', left: '25%', size: 'text-[11px]', delay: '0.5s' },
  { text: '0.15 Index Deficit', top: '35%', right: '12%', size: 'text-xs sm:text-sm', delay: '2.5s' },
  { text: '25.47°N, 80.33°E', top: '55%', right: '28%', size: 'text-[11px]', delay: '1.8s' }
];

export default function EmeraldLoadingScreen({ onComplete }) {
  const [stage, setStage] = useState(0); // 0: Ambient aurora, 1: Text reveal, 2: Fadeout
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Stage 0 -> 1: Reveal logo and title after 400ms
    const t1 = setTimeout(() => {
      setStage(1);
    }, 400);

    // Stage 1 -> 2: Fade out overlay after 1900ms
    const t2 = setTimeout(() => {
      setStage(2);
    }, 2000);

    // Complete after 2400ms
    const t3 = setTimeout(() => {
      setHidden(true);
      if (onComplete) onComplete();
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#06090c] transition-opacity duration-700 pointer-events-none ${stage === 2 ? 'opacity-0' : 'opacity-100'
        }`}
    >
      {/* Volumetric Emerald Aurora Glow in Center/Top (Matching Video 00:00 - 00:02) */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] rounded-full blur-[130px] transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(0, 230, 118, 0.35) 0%, rgba(16, 185, 129, 0.15) 45%, transparent 75%)'
        }}
      />

      {/* Floating Data & Mathematical Symbols */}
      {FLOATING_SYMBOLS.map((sym, idx) => (
        <span
          key={idx}
          style={{
            top: sym.top,
            left: sym.left,
            right: sym.right,
            animationDelay: sym.delay
          }}
          className={`absolute font-mono font-bold text-emerald-400/40 select-none animate-floatSlow pointer-events-none ${sym.size} ${stage >= 1 ? 'opacity-60 scale-100' : 'opacity-0 scale-75'
            } transition-all duration-1000`}
        >
          {sym.text}
        </span>
      ))}

      {/* Outer Border Glow Frame */}
      <div className="absolute inset-4 sm:inset-10 rounded-3xl border border-emerald-500/25 shadow-[0_0_100px_rgba(0,230,118,0.25)] pointer-events-none transition-all duration-1000" />

      {/* Center Reveal */}
      <div className="relative flex flex-col items-center justify-center text-center max-w-lg px-6">

        {/* Glowing Monogram */}
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-[2px] shadow-2xl shadow-emerald-500/40 transition-all duration-700 transform ${stage >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
        >
          <div className="w-full h-full bg-[#080d12] rounded-[14px] flex items-center justify-center">
            <Zap className="w-8 h-8 fill-emerald-400 text-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Title Reveal */}
        <h1
          className={`mt-4 font-heading font-black text-2xl sm:text-3xl text-white tracking-wider transition-all duration-700 delay-150 transform ${stage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
        >
          NAGRIK
        </h1>

        <p
          className={`mt-1 text-xs font-mono text-emerald-400 font-semibold tracking-widest uppercase transition-all duration-700 delay-300 transform ${stage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
        >
          SOVEREIGN CITIZEN DEMAND INTELLIGENCE
        </p>

        {/* Subtitle / Loading progress bar */}
        <div
          className={`mt-5 w-48 h-1 rounded-full bg-white/10 overflow-hidden transition-all duration-500 delay-500 ${stage >= 1 ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-[loadingBar_1.8s_ease-out_forwards]" />
        </div>

      </div>
    </div>
  );
}
