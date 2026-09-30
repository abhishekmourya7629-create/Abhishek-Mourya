import React, { useState } from 'react';
import { 
  ArrowRight, TrendingUp, TrendingDown, RefreshCw, 
  BarChart2, Radio, Clock, Smartphone, Monitor, ChevronRight, Sparkles 
} from 'lucide-react';
import EdgeCircuitMotionHero from '../components/EdgeCircuitMotionHero';
import GoogleMapsCityLocator from '../components/GoogleMapsCityLocator';
import SovereignGlobe from '../components/SovereignGlobe';
import EdgeBentoShowcase from '../components/EdgeBentoShowcase';
import EmeraldLoadingScreen from '../components/EmeraldLoadingScreen';
import ScrollPoppingSlideDeck from '../components/ScrollPoppingSlideDeck';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

// Data for Citizen Metrics Line Chart (bottom left)
const CITIZEN_METRICS_DATA = [
  { date: 'Nov 05', users: 20, pageViews: 45, sessions: 30 },
  { date: 'Nov 10', users: 35, pageViews: 70, sessions: 50 },
  { date: 'Nov 15', users: 40, pageViews: 60, sessions: 42 },
  { date: 'Nov 18', users: 65, pageViews: 85, sessions: 58 },
  { date: 'Nov 22', users: 50, pageViews: 65, sessions: 48 },
  { date: 'Nov 26', users: 75, pageViews: 95, sessions: 70 },
  { date: 'Nov 30', users: 90, pageViews: 110, sessions: 85 }
];

// Data for Traffic Sources Chart (bottom right)
const INTAKE_SOURCES_DATA = [
  { date: 'Nov 05', whatsapp: 40, voice: 25, sms: 15 },
  { date: 'Nov 10', whatsapp: 65, voice: 35, sms: 22 },
  { date: 'Nov 15', whatsapp: 55, voice: 30, sms: 18 },
  { date: 'Nov 18', whatsapp: 80, voice: 45, sms: 28 },
  { date: 'Nov 22', whatsapp: 70, voice: 40, sms: 25 },
  { date: 'Nov 26', whatsapp: 95, voice: 55, sms: 35 },
  { date: 'Nov 30', whatsapp: 115, voice: 65, sms: 40 }
];

// Donut data for Mobile Sessions (65% Mobile / 35% Desktop)
const MOBILE_DONUT_DATA = [
  { name: 'Mobile (WhatsApp/Voice/SMS)', value: 65, color: '#00e676' },
  { name: 'Desktop (Web Portal)', value: 35, color: '#16222f' }
];

// Sparkline SVG helper
function Sparkline({ points, color = "#00e676" }) {
  return (
    <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 25" preserveAspectRatio="none">
      <path
        d={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
}

export default function NagrikDashboardView({ selectedCountry, onNavigateTab }) {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      
      {/* Cinematic Emerald Loading Screen (Matching Reference Link 00:00 - 00:03) */}
      {showLoadingScreen && (
        <EmeraldLoadingScreen onComplete={() => setShowLoadingScreen(false)} />
      )}

      {/* 1. Gcore-Style Neural Circuit Motion Hero (from the Pinterest link) */}
      <EdgeCircuitMotionHero
        onExploreMaps={() => onNavigateTab && onNavigateTab('map')}
        onSimulateIntake={() => onNavigateTab && onNavigateTab('intake')}
        onReplayIntro={() => setShowLoadingScreen(true)}
      />

      {/* Subnav Tabs & Settings Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 gap-3 pb-2">
        
        {/* Left Sub-nav pills */}
        <div className="flex items-center gap-6 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Edge Overview' },
            { id: 'grievances', label: 'Citizen Grievances' },
            { id: 'hotspots', label: 'Demand Hotspots' },
            { id: 'network', label: 'Sovereign Network' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`pb-2 transition-all relative ${
                activeSubTab === t.id
                  ? 'text-emerald-400 border-b-2 border-emerald-500 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Right Settings Links */}
        <div className="flex items-center gap-4 text-xs text-slate-400 hidden sm:flex">
          <button 
            onClick={() => onNavigateTab && onNavigateTab('trust')}
            className="hover:text-emerald-400 transition-colors"
          >
            Sovereign Settings
          </button>
          <button 
            onClick={() => onNavigateTab && onNavigateTab('impact')}
            className="hover:text-emerald-400 transition-colors"
          >
            Impact Reports
          </button>
        </div>

      </div>

      {/* 4 KPI Metric Cards with Glowing Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Unplanned Gap Rate */}
        <div className="edge-glass-card rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm shadow-emerald-500/20">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-xl text-white">
                  32.53%
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/20">
                  -0.8%
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Unplanned Gap Rate
              </span>
            </div>
          </div>
          <div className="mt-3">
            <Sparkline points="M0,18 Q20,5 40,15 T80,8 T100,12" color="#00e676" />
          </div>
        </div>

        {/* Card 2: Citizen Grievances */}
        <div className="edge-glass-card rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400 shrink-0 shadow-sm shadow-teal-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-xl text-white">
                  7,682
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  +0.1%
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Citizen Grievances
              </span>
            </div>
          </div>
          <div className="mt-3">
            <Sparkline points="M0,15 Q25,20 50,8 T75,18 T100,5" color="#14b8a6" />
          </div>
        </div>

        {/* Card 3: Priority Score Index */}
        <div className="edge-glass-card rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm shadow-emerald-500/20">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-xl text-white">
                  68.8
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  +0.4%
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Priority Score Index
              </span>
            </div>
          </div>
          <div className="mt-3">
            <Sparkline points="M0,12 Q30,18 60,7 T100,16" color="#10b981" />
          </div>
        </div>

        {/* Card 4: Avg. Resolution Time */}
        <div className="edge-glass-card rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shrink-0 shadow-sm shadow-cyan-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-xl text-white">
                  2m:35s
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  +0.8%
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Avg. Triage & Dispatch
              </span>
            </div>
          </div>
          <div className="mt-3">
            <Sparkline points="M0,16 Q20,10 40,20 T70,5 T100,10" color="#06b6d4" />
          </div>
        </div>

      </div>

      {/* Middle Row: Google Maps City Locator & Mobile Sessions Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Center: Google Maps City Locator (8 cols) */}
        <div className="lg:col-span-8">
          <GoogleMapsCityLocator />
        </div>

        {/* Right: Mobile Sessions Donut Gauge Card (4 cols) */}
        <div className="lg:col-span-4 edge-glass-card rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-white">
              Mobile Sessions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              The percentage of citizens who use mobile channels (WhatsApp, Voice, SMS) compared to web portals.
            </p>
          </div>

          {/* Donut Chart Ring */}
          <div className="relative h-48 my-3 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOBILE_DONUT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={78}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  {MOBILE_DONUT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Bold Percentage */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-heading font-black text-3xl text-emerald-400">
                65%
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                EDGE ADOPTION
              </span>
            </div>
          </div>

          {/* Legend Counters matching reference layout */}
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-3 text-xs">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#00e676]"></span>
                <span className="font-semibold uppercase tracking-wider text-[10px]">Mobile</span>
              </div>
              <span className="font-heading font-extrabold text-lg text-white">
                6,098
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                <span className="font-semibold uppercase tracking-wider text-[10px]">Desktop</span>
              </div>
              <span className="font-heading font-extrabold text-lg text-white">
                3,902
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Interactive Bento Showcase (Matching Video 00:08 - 00:17) */}
      <EdgeBentoShowcase 
        onTryPipeline={() => onNavigateTab && onNavigateTab('intake')}
        onOpenMaps={() => onNavigateTab && onNavigateTab('map')}
      />

      {/* 3. 3D Dotted Matrix Sovereign Globe (Matching Video 00:18 - 00:22) */}
      <SovereignGlobe 
        onSelectNode={() => onNavigateTab && onNavigateTab('map')}
      />

      {/* Bottom Row: Audience Metrics Line Chart & Traffic Sources Area Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Citizen Demand Trends */}
        <div className="edge-glass-card rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="font-heading font-bold text-base text-white">
              Citizen Demand Trends
            </h3>
            <p className="text-xs text-slate-400">
              Measures citizens' sessions and verified demand signals over time.
            </p>
          </div>

          {/* Top Metric Counters */}
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="font-heading font-extrabold text-lg text-white block">
                120,500
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                Citizens
              </span>
            </div>

            <div>
              <span className="font-heading font-extrabold text-lg text-white block">
                360,108
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Demands
              </span>
            </div>

            <div>
              <span className="font-heading font-extrabold text-lg text-white block">
                150,712
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                Resolved
              </span>
            </div>
          </div>

          {/* Smooth Multi-Line Recharts */}
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CITIZEN_METRICS_DATA}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#080d14', borderColor: '#1f2e3d', borderRadius: '0.75rem', fontSize: '11px', color: '#ffffff' }}
                />
                <Line type="monotone" dataKey="users" stroke="#06b6d4" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="pageViews" stroke="#00e676" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="sessions" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Intake Channel Sources */}
        <div className="edge-glass-card rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="font-heading font-bold text-base text-white">
              Intake Channel Sources
            </h3>
            <p className="text-xs text-slate-400">
              Measures channels that generate demand signals to your platform.
            </p>
          </div>

          {/* Top Metric Counters */}
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="font-heading font-extrabold text-lg text-white block">
                86,376
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00e676]"></span>
                WhatsApp
              </span>
            </div>

            <div>
              <span className="font-heading font-extrabold text-lg text-white block">
                25,001
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                Voice ASR
              </span>
            </div>

            <div>
              <span className="font-heading font-extrabold text-lg text-white block">
                12,909
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                SMS IVR
              </span>
            </div>
          </div>

          {/* Area Chart matching the emerald theme */}
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={INTAKE_SOURCES_DATA}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#080d14', borderColor: '#1f2e3d', borderRadius: '0.75rem', fontSize: '11px', color: '#ffffff' }}
                />
                <Area type="monotone" dataKey="whatsapp" stackId="1" stroke="#00e676" fill="#00e676" fillOpacity={0.6} />
                <Area type="monotone" dataKey="voice" stackId="1" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.5} />
                <Area type="monotone" dataKey="sms" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 4. Popping Slide Deck & Kinetic Scrolling (Matching Reference Video Motion) */}
      <ScrollPoppingSlideDeck
        onOpenChatbot={() => onNavigateTab && onNavigateTab('chatbot')}
        onExploreMaps={() => onNavigateTab && onNavigateTab('map')}
        onSimulateIntake={() => onNavigateTab && onNavigateTab('intake')}
      />

    </div>
  );
}
