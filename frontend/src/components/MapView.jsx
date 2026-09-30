import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { AlertTriangle, TrendingUp, DollarSign, Users, ShieldAlert, MapPin, Layers } from 'lucide-react';

const COUNTRY_CENTERS = {
  'India': { center: [22.5, 78.9], zoom: 5 },
  'Brazil': { center: [-14.2, -51.9], zoom: 4 },
  'South Africa': { center: [-28.5, 24.7], zoom: 5 },
  'Russia': { center: [60.0, 100.0], zoom: 3 },
  'China': { center: [35.8, 104.1], zoom: 4 }
};

// Component to dynamically re-center map when country changes
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ 
  districts = [], 
  selectedCountry = 'India', 
  selectedSector = 'all', 
  setSelectedSector, 
  t 
}) {
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite' | 'terrain'
  const countryConfig = COUNTRY_CENTERS[selectedCountry] || COUNTRY_CENTERS['India'];

  const sectors = [
    { id: 'all', label: t.sectors.all },
    { id: 'water', label: t.sectors.water },
    { id: 'roads', label: t.sectors.roads },
    { id: 'health', label: t.sectors.health },
    { id: 'electricity', label: t.sectors.electricity },
    { id: 'broadband', label: t.sectors.broadband },
    { id: 'schools', label: t.sectors.schools }
  ];

  // Official Google Maps high-resolution tile layers (Zero watermark, No API key required)
  const getGoogleMapsTileUrl = () => {
    if (mapType === 'satellite') {
      return "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
    } else if (mapType === 'terrain') {
      return "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}";
    }
    return "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
  };

  return (
    <div className="edge-glass-card rounded-2xl p-4 flex flex-col h-[540px] relative overflow-hidden border border-white/10 shadow-2xl">
      
      {/* Map Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 z-10">
        <div>
          <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {t.dashboard.mapTitle}
          </h2>
          <p className="text-xs text-slate-400">
            {t.dashboard.mapSubtitle}
          </p>
        </div>

        {/* Right side: Google Map layer toggle */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setMapType('roadmap')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              mapType === 'roadmap'
                ? 'bg-emerald-500 text-[#06090c] font-black shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Google Map
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              mapType === 'satellite'
                ? 'bg-emerald-500 text-[#06090c] font-black shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapType('terrain')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              mapType === 'terrain'
                ? 'bg-emerald-500 text-[#06090c] font-black shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Terrain
          </button>
        </div>
      </div>

      {/* Sector Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none z-10">
        {sectors.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSelectedSector(sec.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
              selectedSector === sec.id
                ? 'bg-emerald-500 text-[#06090c] font-bold shadow-md shadow-emerald-500/25'
                : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] border border-white/10'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Interactive Google Maps Leaflet Container */}
      <div className="w-full flex-1 rounded-xl overflow-hidden relative border border-white/10 shadow-inner">
        <MapContainer
          key={mapType}
          center={countryConfig.center}
          zoom={countryConfig.zoom}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <MapRecenter center={countryConfig.center} zoom={countryConfig.zoom} />
          
          {/* Official Google Maps Tiles (Replaces outdated Carto watermark tiles) */}
          <TileLayer
            attribution='&copy; Google Maps'
            url={getGoogleMapsTileUrl()}
            maxZoom={20}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />

          {districts.map((d) => {
            const isCritical = d.is_critical_hotspot;
            const normDemand = selectedSector === 'all' 
              ? (d.total_normalized_demand || 5)
              : (d.normalized_demand_per_100k?.[selectedSector] || 0);

            // Radius scaled between 10 and 26
            const radius = Math.min(28, Math.max(10, 8 + normDemand * 1.2));
            
            // Marker color
            let color = '#00e676'; // emerald neon
            let fillColor = '#10b981';
            if (isCritical) {
              color = '#f43f5e'; // rose
              fillColor = '#e11d48';
            } else if (normDemand > 4.0) {
              color = '#f59e0b'; // amber
              fillColor = '#d97706';
            }

            return (
              <React.Fragment key={d.district}>
                {/* Outer halo ring for critical hotspots */}
                {isCritical && (
                  <CircleMarker
                    center={[d.lat, d.lng]}
                    radius={radius + 8}
                    pathOptions={{
                      color: '#f43f5e',
                      fillColor: '#f43f5e',
                      fillOpacity: 0.2,
                      weight: 2,
                      dashArray: '4, 4'
                    }}
                  />
                )}

                <CircleMarker
                  center={[d.lat, d.lng]}
                  radius={radius}
                  pathOptions={{
                    color: color,
                    fillColor: fillColor,
                    fillOpacity: 0.8,
                    weight: 2.5
                  }}
                >
                  <Popup>
                    <div className="p-1 min-w-[240px] text-slate-100">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 mb-2">
                        <div>
                          <h4 className="font-heading font-bold text-sm text-emerald-400">
                            {d.district}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {d.state}, {d.country}
                          </span>
                        </div>
                        {isCritical && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" />
                            HOTSPOT
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 mb-2.5 leading-relaxed">
                        {d.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div className="bg-[#0b1017] p-2 rounded-lg border border-white/5">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                            <Users className="w-3 h-3 text-emerald-400" />
                            Population
                          </span>
                          <span className="font-bold text-white">
                            {d.population?.toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-[#0b1017] p-2 rounded-lg border border-white/5">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                            <TrendingUp className="w-3 h-3 text-amber-400" />
                            Poverty Index
                          </span>
                          <span className="font-bold text-amber-300">
                            {(d.poverty_index * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      {/* Demand vs Planned Table */}
                      <div className="border-t border-slate-800 pt-2">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 font-mono">
                          Sector Demand vs. Planned Budget
                        </span>
                        <div className="space-y-1 text-[11px]">
                          {['water', 'roads', 'health', 'electricity'].map((sec) => (
                            <div key={sec} className="flex items-center justify-between text-slate-300">
                              <span className="capitalize">{sec}:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-emerald-400">
                                  {d.demand_counts?.[sec] || 0} reqs
                                </span>
                                <span className="text-slate-500">|</span>
                                <span className="font-mono text-cyan-300">
                                  ${(d.planned_investment_usd_m?.[sec] || 0).toFixed(1)}M
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-3 right-3 z-[1000] bg-[#080d14]/95 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-[11px] space-y-1 shadow-2xl">
          <div className="font-semibold text-white mb-1 flex items-center gap-1.5 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Demand Density (Google Maps)
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-500/30"></span>
            <span className="text-slate-300">Critical Demand Hotspot</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-300">High Demand Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00e676]"></span>
            <span className="text-slate-300">Normal / Baseline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
