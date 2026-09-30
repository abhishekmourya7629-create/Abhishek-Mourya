import React, { useRef, useEffect, useState } from 'react';
import { Globe, Radio, Shield, Zap, Sparkles, Navigation } from 'lucide-react';

// Sovereign BRICS Node GPS coordinates
const SOVEREIGN_NODES = [
  { name: 'New Delhi (HQ)', lat: 28.6139, lon: 77.209, country: 'India', latency: '12ms', status: 'Optimal' },
  { name: 'Mumbai / Banda', lat: 19.076, lon: 72.8777, country: 'India', latency: '14ms', status: 'Hotspot Active' },
  { name: 'Brasília', lat: -15.8267, lon: -47.9218, country: 'Brazil', latency: '28ms', status: 'Optimal' },
  { name: 'Johannesburg', lat: -26.2041, lon: 28.0473, country: 'South Africa', latency: '32ms', status: 'Optimal' },
  { name: 'Moscow', lat: 55.7558, lon: 37.6173, country: 'Russia', latency: '22ms', status: 'Sovereign 152-FZ' },
  { name: 'Beijing', lat: 39.9042, lon: 116.4074, country: 'China', latency: '19ms', status: 'PIPL Standard' }
];

export default function SovereignGlobe({ onSelectNode }) {
  const canvasRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(SOVEREIGN_NODES[0]);
  const [isHovered, setIsHovered] = useState(false);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Generate spherical dot matrix points (Fibonacci sphere distribution)
    const numPoints = 850;
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Convert (x, y, z) to latitude & longitude in radians
      const lat = Math.asin(y);
      const lon = Math.atan2(z, x);

      // Simplified continental density mask
      const isLand = (
        (lat > 0.1 && lat < 1.2 && lon > 0.8 && lon < 2.5) || // Asia / India
        (lat > 0.4 && lat < 1.3 && lon > -0.2 && lon < 1.0) || // Europe
        (lat > -0.6 && lat < 0.6 && lon > -0.4 && lon < 0.9) || // Africa
        (lat > -0.9 && lat < 0.2 && lon > -1.5 && lon < -0.6) || // South America
        (lat > 0.3 && lat < 1.2 && lon > -2.3 && lon < -1.1)    // North America
      );

      points.push({ x, y, z, lat, lon, isLand });
    }

    let angle = 0;

    const render = () => {
      // Rotate steadily
      angle += isHovered ? 0.003 : 0.007;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const sphereRadius = Math.min(width, height) * 0.38;

      // 1. Draw Emerald Atmospheric Horizon Arc Glow
      const glowGrad = ctx.createRadialGradient(
        cx, cy - sphereRadius * 0.85, sphereRadius * 0.4,
        cx, cy - sphereRadius * 0.5, sphereRadius * 1.45
      );
      glowGrad.addColorStop(0, 'rgba(0, 230, 118, 0.45)');
      glowGrad.addColorStop(0.3, 'rgba(16, 185, 129, 0.20)');
      glowGrad.addColorStop(0.7, 'rgba(6, 182, 212, 0.06)');
      glowGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Inner globe dark sphere
      const sphereDarkGrad = ctx.createRadialGradient(
        cx, cy - sphereRadius * 0.2, sphereRadius * 0.1,
        cx, cy, sphereRadius
      );
      sphereDarkGrad.addColorStop(0, 'rgba(10, 18, 24, 0.92)');
      sphereDarkGrad.addColorStop(1, 'rgba(5, 8, 12, 0.98)');
      ctx.fillStyle = sphereDarkGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
      ctx.fill();

      // Top Horizon Rim Highlight Arc
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius, Math.PI * 1.05, Math.PI * 1.95, false);
      ctx.lineWidth = 3.5;
      const arcGrad = ctx.createLinearGradient(cx - sphereRadius, cy, cx + sphereRadius, cy);
      arcGrad.addColorStop(0, 'rgba(0, 230, 118, 0.2)');
      arcGrad.addColorStop(0.5, 'rgba(0, 255, 136, 0.95)');
      arcGrad.addColorStop(1, 'rgba(0, 230, 118, 0.2)');
      ctx.strokeStyle = arcGrad;
      ctx.shadowColor = '#00e676';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.restore();

      // 2. Render 3D Dotted Matrix
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        
        // Rotate around Y axis
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const rotX = p.x * cosA + p.z * sinA;
        const rotZ = -p.x * sinA + p.z * cosA;
        const rotY = p.y;

        const screenX = cx + rotX * sphereRadius;
        const screenY = cy + rotY * sphereRadius;

        // Front vs Back face culling / alpha
        if (rotZ > -0.2) {
          const alpha = Math.min(1, Math.max(0.1, (rotZ + 0.5) / 1.5));
          const dotSize = p.isLand ? (rotZ > 0.2 ? 2.2 : 1.6) : 1.1;

          if (p.isLand) {
            ctx.fillStyle = `rgba(0, ${Math.floor(210 + rotZ * 45)}, ${Math.floor(130 + rotZ * 50)}, ${alpha * 0.9})`;
            ctx.shadowColor = '#00e676';
            ctx.shadowBlur = rotZ > 0.4 ? 4 : 0;
          } else {
            ctx.fillStyle = `rgba(148, 163, 184, ${alpha * 0.35})`;
            ctx.shadowBlur = 0;
          }

          ctx.beginPath();
          ctx.arc(screenX, screenY, dotSize, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Back-side subtle dots for 3D holographic volume
          ctx.fillStyle = `rgba(0, 230, 118, 0.08)`;
          ctx.beginPath();
          ctx.arc(screenX, screenY, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Render Sovereign Nodes with Glowing Markers & Rings
      SOVEREIGN_NODES.forEach((node) => {
        const radLat = (node.lat * Math.PI) / 180;
        const radLon = (node.lon * Math.PI) / 180;

        const nx = Math.cos(radLat) * Math.sin(radLon);
        const ny = -Math.sin(radLat);
        const nz = Math.cos(radLat) * Math.cos(radLon);

        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const rotX = nx * cosA + nz * sinA;
        const rotZ = -nx * sinA + nz * cosA;
        const rotY = ny;

        if (rotZ > 0) {
          const sx = cx + rotX * sphereRadius;
          const sy = cy + rotY * sphereRadius;
          const isCurrent = selectedNode.name === node.name;

          // Pulsing Beacon
          ctx.save();
          ctx.shadowColor = '#00ff88';
          ctx.shadowBlur = 12;

          // Outer ring
          ctx.strokeStyle = isCurrent ? 'rgba(0, 255, 136, 0.9)' : 'rgba(0, 230, 118, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(sx, sy, isCurrent ? 8 : 5.5, 0, Math.PI * 2);
          ctx.stroke();

          // Core dot
          ctx.fillStyle = isCurrent ? '#ffffff' : '#00e676';
          ctx.beginPath();
          ctx.arc(sx, sy, isCurrent ? 3.5 : 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Text label
          ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = isCurrent ? '#ecfdf5' : '#cbd5e1';
          ctx.shadowBlur = 3;
          ctx.shadowColor = '#000000';
          ctx.fillText(node.name, sx + 9, sy + 3);

          ctx.restore();
        }
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHovered, selectedNode]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#06090c] border border-white/10 p-6 md:p-8 shadow-2xl transition-all">
      {/* Background Volumetric Glow Arc */}
      <div 
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[110px]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 230, 118, 0.32) 0%, rgba(6, 182, 212, 0.12) 50%, transparent 80%)'
        }}
      />

      {/* Header Info */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-emerald-500/30 text-xs text-emerald-300 font-mono shadow-sm">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>Global Sovereign Network</span>
        </div>

        <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-snug">
          A Truly Sovereign Network for <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            Real-Time Citizen Intelligence
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
          NAGRIK sovereign edge nodes operate in-country across BRICS nations, ensuring zero citizen data leaves sovereign territory while enabling cross-national DPG federation.
        </p>
      </div>

      {/* 3D Dotted Canvas Globe */}
      <div 
        className="relative my-4 flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <canvas 
          ref={canvasRef} 
          width={640} 
          height={400} 
          className="max-w-full h-auto drop-shadow-[0_20px_50px_rgba(0,230,118,0.2)]"
        />

        {/* Floating Active Node Telemetry Card */}
        <div className="absolute bottom-2 left-4 sm:left-8 p-3 rounded-2xl bg-[#080d14]/90 border border-emerald-500/30 backdrop-blur-xl shadow-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">{selectedNode.name}</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                {selectedNode.latency}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">
              {selectedNode.country} · {selectedNode.status}
            </span>
          </div>
        </div>
      </div>

      {/* Node Switcher Pills */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 pt-2">
        {SOVEREIGN_NODES.map((node) => (
          <button
            key={node.name}
            onClick={() => {
              setSelectedNode(node);
              if (onSelectNode) onSelectNode(node);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              selectedNode.name === node.name
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-500/20 scale-105'
                : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/10'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              selectedNode.name === node.name ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
            }`}></span>
            <span>{node.name}</span>
            <span className="text-[10px] font-mono text-slate-400">{node.latency}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
