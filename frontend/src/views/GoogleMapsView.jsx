import React from 'react';
import GoogleMapsCityLocator from '../components/GoogleMapsCityLocator';
import { MapPin, Globe, Sparkles, Navigation } from 'lucide-react';

export default function GoogleMapsView() {
  return (
    <div className="space-y-5 pb-12 animate-fadeIn">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Google Maps Location Engine
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-400" />
            NAGRIK — Exact City Location & Demand Intelligence
          </h2>
          <p className="text-xs text-slate-300">
            Locate verified grassroots demands across cities with high-precision Google Maps satellite & roadmap layers.
          </p>
        </div>
      </div>

      {/* Main Google Maps Component */}
      <GoogleMapsCityLocator />

    </div>
  );
}
