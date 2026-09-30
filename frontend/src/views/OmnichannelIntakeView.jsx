import React, { useState } from 'react';
import WhatsAppIntakeSimulator from '../components/WhatsAppIntakeSimulator';
import VoiceMailStudio from '../components/VoiceMailStudio';
import ChatbotView from './ChatbotView';
import IntakeSimulatorView from './IntakeSimulatorView';
import { 
  MessageSquare, Phone, Bot, Cpu, Inbox, 
  Sparkles, Radio, CheckCircle2 
} from 'lucide-react';

export default function OmnichannelIntakeView({ 
  onNavigateTab, 
  selectedCountry = 'India', 
  t 
}) {
  const [activeChannel, setActiveChannel] = useState('whatsapp'); // 'whatsapp' | 'voice' | 'chatbot' | 'simulator'

  const channels = [
    { id: 'whatsapp', label: 'WhatsApp Bot', icon: MessageSquare, badge: 'Popular', color: 'text-emerald-400' },
    { id: 'voice', label: 'Citizen Voicemail & IVR', icon: Phone, badge: 'Multilingual', color: 'text-cyan-400' },
    { id: 'chatbot', label: 'AI Citizen Portal', icon: Bot, badge: '24/7', color: 'text-teal-400' },
    { id: 'simulator', label: 'Batch Ingestion Engine', icon: Cpu, badge: 'DPDP Scrubbed', color: 'text-slate-400' }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Grassroots Ingestion Matrix
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              4 Ingestion Endpoints Online
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2.5">
            <Inbox className="w-7 h-7 text-emerald-400" />
            Omnichannel Intake Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-0.5">
            Collect, scrub, and structure citizen demand data across messaging, voice, portal bots, and emergency hotlines.
          </p>
        </div>

        {/* Channel Switcher */}
        <div className="flex items-center flex-wrap p-1 bg-black/40 rounded-xl border border-white/10 text-xs">
          {channels.map((ch) => {
            const Icon = ch.icon;
            const isActive = activeChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500 text-[#06090c] shadow-md shadow-emerald-500/30 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#06090c]' : ch.color}`} />
                <span>{ch.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Channel View */}
      <div className="transition-all">
        {activeChannel === 'whatsapp' && (
          <WhatsAppIntakeSimulator onNavigateTab={onNavigateTab} />
        )}
        {activeChannel === 'voice' && (
          <VoiceMailStudio onNavigateTab={onNavigateTab} />
        )}
        {activeChannel === 'chatbot' && (
          <ChatbotView selectedCountry={selectedCountry} />
        )}
        {activeChannel === 'simulator' && (
          <IntakeSimulatorView onNavigateTab={onNavigateTab} t={t} />
        )}
      </div>

    </div>
  );
}
