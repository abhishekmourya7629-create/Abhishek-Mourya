import React, { useState, useEffect } from 'react';
import { Zap, Sparkles } from 'lucide-react';

export default function IrisIntroLoader({ onComplete }) {
  const [stage, setStage] = useState(0); // 0: Ring pulse, 1: Logo expand, 2: Fadeout
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Stage 0 -> 1: Expand iris after 600ms
    const t1 = setTimeout(() => {
      setStage(1);
    }, 700);

    // Stage 1 -> 2: Fade out overlay after 1600ms
    const t2 = setTimeout(() => {
      setStage(2);
    }, 1700);

    // Complete after 2100ms
    const t3 = setTimeout(() => {
      setHidden(true);
      if (onComplete) onComplete();
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#07090e] transition-opacity duration-700 pointer-events-none ${
        stage === 2 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Outer ambient warm glow rim matching video 00:00 */}
      <div className="absolute inset-4 sm:inset-12 rounded-3xl border-2 border-orange-500/30 shadow-[0_0_120px_rgba(255,100,0,0.45)] pointer-events-none transition-all duration-1000" />

      {/* Iris Pulse Ring */}
      <div className="relative flex items-center justify-center">
        
        {/* Pulsing ring 1 */}
        <div 
          className={`w-28 h-28 rounded-full border border-orange-500/80 transition-all duration-1000 ease-out ${
            stage >= 1 ? 'scale-[6] opacity-0' : 'scale-100 opacity-90 animate-ping'
          }`} 
        />

        {/* Pulsing ring 2 (inner) */}
        <div 
          className={`absolute w-16 h-16 rounded-full border-2 border-amber-400 transition-all duration-700 ease-out ${
            stage >= 1 ? 'scale-[3] opacity-0' : 'scale-100 opacity-100'
          }`}
        />

        {/* Central Logo / Sovereign Monogram */}
        <div 
          className={`absolute flex flex-col items-center justify-center transition-all duration-700 transform ${
            stage === 0 ? 'scale-75 opacity-70' : stage === 1 ? 'scale-110 opacity-100' : 'scale-125 opacity-0'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-[2px] shadow-2xl shadow-orange-500/50">
            <div className="w-full h-full bg-[#0a0c14] rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8 fill-orange-400 text-orange-400" />
            </div>
          </div>
          <span className="mt-3 font-heading font-black text-xl text-white tracking-widest">
            NAGRIK
          </span>
          <span className="text-[10px] font-mono text-orange-400 tracking-wider">
            INFERENCE AT THE EDGE
          </span>
        </div>

      </div>
    </div>
  );
}
