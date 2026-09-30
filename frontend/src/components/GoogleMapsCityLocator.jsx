import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, Search, Layers, Compass, ExternalLink, 
  AlertTriangle, CheckCircle2, TrendingUp, Navigation 
} from 'lucide-react';
import { VERIFIED_CITIES } from '../data/verifiedCities';

// Custom Google Maps Red Pin Icon
const googleMapsRedPin = L.divIcon({
  className: 'google-maps-pin',
  html: `
    <div style="position: relative; width: 32px; height: 38px; transform: translate(-50%, -100%);">
      <svg viewBox="0 0 24 32" width="32" height="38" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z" fill="#ea4335" />
        <circle cx="12" cy="11" r="5" fill="#ffffff" />
        <circle cx="12" cy="11" r="2.5" fill="#b31412" />
      </svg>
    </div>
  `,
  iconSize: [32, 38],
  iconAnchor: [16, 38],
  popupAnchor: [0, -38]
});

// Component to programmatically pan/zoom map to selected city
function FlyToLocation({ targetCoords, targetZoom }) {
  const map = useMap();
  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, targetZoom || 9, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [targetCoords, targetZoom, map]);
  return null;
}

export default function GoogleMapsCityLocator({ onCitySelect }) {
  const [selectedCity, setSelectedCity] = useState(VERIFIED_CITIES[0]);
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite' | 'terrain'
  const [searchQuery, setSearchQuery] = useState('');

  // Google Maps tile URL schemas
  const getGoogleMapsTileUrl = () => {
    if (mapType === 'satellite') {
      return "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
    } else if (mapType === 'terrain') {
      return "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}";
    }
    return "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
  };

  const filteredCities = VERIFIED_CITIES.filter(c => 
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCityClick = (cityObj) => {
    setSelectedCity(cityObj);
    if (onCitySelect) onCitySelect(cityObj);
  };

  return (
    <div className="edge-glass-card rounded-2xl overflow-hidden">
      
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Demand By City / Region
          </h3>
          <p className="text-xs text-slate-400">
            The top locations where citizen demands are located for this month
          </p>
        </div>

        {/* Google Maps Layer Selector Controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setMapType('roadmap')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              mapType === 'roadmap'
                ? 'bg-emerald-500 text-[#06090c] font-black shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Google Map
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              mapType === 'satellite'
                ? 'bg-emerald-500 text-[#06090c] font-black shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapType('terrain')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              mapType === 'terrain'
                ? 'bg-emerald-500 text-[#06090c] font-black shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Terrain
          </button>
        </div>
      </div>

      {/* Main Grid: Left City List & Right Google Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        
        {/* Left Column: City Demand List */}
        <div className="lg:col-span-5 p-5 border-r border-white/10 flex flex-col justify-between space-y-4">
          
          {/* City Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter cities..."
              className="w-full bg-white/[0.04] text-xs text-slate-200 pl-8 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500/50 placeholder:text-slate-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Cities Progress Bars */}
          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[350px] pr-1">
            {filteredCities.map((item) => {
              const isSelected = selectedCity.city === item.city;
              const maxVal = 6000;
              const widthPct = Math.round((item.demands / maxVal) * 100);

              return (
                <div
                  key={item.city}
                  onClick={() => handleCityClick(item)}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-emerald-500/15 border border-emerald-500/40 shadow-sm' 
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-white flex items-center gap-1.5 truncate">
                      <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className="truncate">{item.city}</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      {item.demands.toLocaleString()}
                    </span>
                  </div>

                  {/* Colored progress bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.barColor}`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                    <span className="truncate">{item.region}</span>
                    <span className={item.severity === 'critical' ? 'text-rose-400 font-semibold' : 'text-slate-400'}>
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom helper tip */}
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-white/10 font-mono">
            <span>Click any city to locate</span>
            <span className="text-emerald-400 font-bold">
              {filteredCities.length} Cities Pinpointed
            </span>
          </div>

        </div>

        {/* Right Column: Google Maps Interactive Viewer */}
        <div className="lg:col-span-7 relative h-[420px] lg:h-auto min-h-[460px]">
          
          <MapContainer
            center={[selectedCity.lat, selectedCity.lng]}
            zoom={8}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            {/* Smooth fly-to when city is clicked */}
            <FlyToLocation 
              targetCoords={[selectedCity.lat, selectedCity.lng]} 
              targetZoom={mapType === 'satellite' ? 12 : 9} 
            />

            {/* Official Google Maps Tiles */}
            <TileLayer
              attribution='&copy; Google Maps'
              url={getGoogleMapsTileUrl()}
              maxZoom={20}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />

            {/* Google Maps Pin Markers for all verified cities */}
            {VERIFIED_CITIES.map((c) => (
              <Marker
                key={c.city}
                position={[c.lat, c.lng]}
                icon={googleMapsRedPin}
                eventHandlers={{
                  click: () => setSelectedCity(c)
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[220px] text-slate-100">
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-700">
                      <div>
                        <h4 className="font-bold text-sm text-white">
                          {c.city}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {c.region}, {c.country}
                        </span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        {c.severity}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Exact Coordinates:</span>
                        <span className="font-mono text-cyan-400 font-semibold">
                          {c.lat.toFixed(4)}°, {c.lng.toFixed(4)}°
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">Citizen Demands:</span>
                        <span className="font-bold text-orange-400">
                          {c.demands.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">Poverty Index:</span>
                        <span className="font-bold text-amber-400">
                          {(c.poverty * 100).toFixed(0)}%
                        </span>
                      </div>

                      <div className="pt-1.5 border-t border-slate-800 mt-1">
                        <span className="text-[10px] text-slate-400 block">Top Infrastructure Need:</span>
                        <span className="font-semibold text-white text-[11px]">
                          {c.topSector}
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Google Maps Brand & Coordinate Badge Overlay */}
          <div className="absolute top-3 right-3 z-[1000] bg-[#0c0e17]/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-xl border border-white/10 text-xs flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></div>
            <div>
              <span className="font-bold text-white block">
                {selectedCity.city}
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                Lat: {selectedCity.lat.toFixed(4)} · Lng: {selectedCity.lng.toFixed(4)}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
