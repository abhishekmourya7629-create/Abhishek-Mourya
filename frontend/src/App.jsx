import React, { useState, useEffect } from 'react';
import NagrikSidebar from './components/NagrikSidebar';
import NagrikHeader from './components/NagrikHeader';
import NagrikDashboardView from './views/NagrikDashboardView';
import GoogleMapsView from './views/GoogleMapsView';
import DashboardView from './views/DashboardView';
import IntakeSimulatorView from './views/IntakeSimulatorView';
import ReviewQueueView from './views/ReviewQueueView';
import ImpactLedgerView from './views/ImpactLedgerView';
import TrustCenterView from './views/TrustCenterView';
import WhatsAppView from './views/WhatsAppView';
import VoiceMailView from './views/VoiceMailView';
import ChatbotView from './views/ChatbotView';
import NagrikChatbotModal from './components/NagrikChatbotModal';
import { translations } from './i18n/translations';
import { Bot, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [countries, setCountries] = useState([]);
  const [regime, setRegime] = useState(null);
  const [lang, setLang] = useState('en');
  const [searchVal, setSearchVal] = useState('');
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const t = translations[lang] || translations.en;

  // Load countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Load regime when selected country changes
  useEffect(() => {
    fetchRegime(selectedCountry);
  }, [selectedCountry]);

  const fetchCountries = async () => {
    try {
      const res = await fetch('/api/countries');
      if (res.ok) {
        const data = await res.json();
        setCountries(data);
      }
    } catch (err) {
      console.error('Failed to fetch countries:', err);
    }
  };

  const fetchRegime = async (countryName) => {
    try {
      const res = await fetch(`/api/regime/${countryName}`);
      if (res.ok) {
        const data = await res.json();
        setRegime(data);
      }
    } catch (err) {
      console.error('Failed to fetch regime:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#06090c] edge-nebula flex text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Sovereign Left Navigation Sidebar */}
      <NagrikSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${
        sidebarOpen ? 'md:ml-64' : 'ml-0'
      }`}>
        
        {/* Top Header Bar */}
        <NagrikHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          countries={countries}
          lang={lang}
          setLang={setLang}
          searchVal={searchVal}
          setSearchVal={setSearchVal}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <NagrikDashboardView
              selectedCountry={selectedCountry}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'map' && (
            <GoogleMapsView />
          )}

          {activeTab === 'priority' && (
            <DashboardView
              selectedCountry={selectedCountry}
              t={t}
            />
          )}

          {activeTab === 'whatsapp' && (
            <WhatsAppView onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'voicemail' && (
            <VoiceMailView onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'chatbot' && (
            <ChatbotView selectedCountry={selectedCountry} onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'intake' && (
            <IntakeSimulatorView
              selectedCountry={selectedCountry}
              t={t}
            />
          )}

          {activeTab === 'review' && (
            <ReviewQueueView
              t={t}
            />
          )}

          {activeTab === 'impact' && (
            <ImpactLedgerView
              t={t}
            />
          )}

          {activeTab === 'trust' && (
            <TrustCenterView
              selectedCountry={selectedCountry}
              regime={regime}
              t={t}
            />
          )}
        </main>

        {/* Global Floating AI Copilot Trigger (Bottom-Right) - Emerald Neon */}
        <button
          onClick={() => setIsChatModalOpen(true)}
          title="Open NAGRIK AI Copilot"
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-[#06090c] font-black shadow-[0_0_35px_rgba(0,230,118,0.65)] hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2 group"
        >
          <Bot className="w-5 h-5 text-[#06090c] animate-pulse" />
          <span className="text-xs font-heading font-black tracking-wide pr-1 hidden sm:inline">
            AI Copilot
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 absolute -top-1 -right-1 ring-2 ring-[#06090c] animate-ping" />
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 absolute -top-1 -right-1 ring-2 ring-[#06090c]" />
        </button>

        {/* Global AI Chatbot Modal */}
        <NagrikChatbotModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          selectedCountry={selectedCountry}
          onNavigateTab={setActiveTab}
        />

        {/* Footer */}
        <footer className="border-t border-white/10 bg-[#070b10]/95 py-4 px-6 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-emerald-400 text-sm tracking-wide">
              NAGRIK AI
            </span>
            <span>—</span>
            <span>Demand Intelligence at the Sovereign Edge</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="text-emerald-400 font-semibold">
              Google Maps Enabled
            </span>
            <span>·</span>
            <span>Regime: {regime?.regime_name || 'DPDP Act, 2023'}</span>
          </div>
        </footer>

      </div>

    </div>
  );
}
