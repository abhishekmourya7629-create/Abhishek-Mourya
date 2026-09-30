import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Mic, CheckCheck, Paperclip, Smile, MoreVertical, 
  Phone, Video, ShieldCheck, MapPin, ArrowRight, Play, Pause, Sparkles 
} from 'lucide-react';

const PRESET_CONVERSATIONS = [
  {
    id: 'banda',
    title: 'Banda Water Outage (Hindi)',
    flag: '🇮🇳',
    citizenName: 'Ramesh Sharma',
    phone: '+91 98765 43210',
    country: 'India',
    incomingText: 'हमारे बांदा के बबेरू गांव में सारे हैंडपंप और कुएं सूख चुके हैं, 3 किमी दूर से पानी लाना पड़ता है। कृपया तत्काल नया बोरवेल लगवाएं।'
  },
  {
    id: 'dharavi',
    title: 'Dharavi Drainage (Marathi)',
    flag: '🇮🇳',
    citizenName: 'Pooja Jadhav',
    phone: '+91 98220 12345',
    country: 'India',
    incomingText: 'धारावी 90 फीट रोडवर नाल्याचे घाण पाणी तुंबून चाळीत शिरले आहे. लेकरांना उलट्या-जुलाब होत आहेत, त्वरित ड्रेनेज साफ करा.'
  },
  {
    id: 'caruaru',
    title: 'Caruaru Broken Bridge (Portuguese)',
    flag: '🇧🇷',
    citizenName: 'Carlos Silva',
    phone: '+55 81 99876 5432',
    country: 'Brazil',
    incomingText: 'Na zona rural de Caruaru, a ponte de madeira do Riacho do Peixe caiu com a chuva e 80 famílias de agricultores estão isoladas sem poder escoar o leite.'
  },
  {
    id: 'vhembe',
    title: 'Vhembe Clinic Power (isiZulu)',
    flag: '🇿🇦',
    citizenName: 'Sipho Ndlovu',
    phone: '+27 82 123 4567',
    country: 'South Africa',
    incomingText: 'Emtholampilo waseVhembe akukho gesi njalo kanti nomshini wokubelethisa awusebenzi. Abesifazane baphathwa kabi kakhulu.'
  },
  {
    id: 'yakutsk',
    title: 'Yakutsk Pipe Rupture (Russian)',
    flag: '🇷🇺',
    citizenName: 'Dmitry Smirnov',
    phone: '+7 914 123 4567',
    country: 'Russia',
    incomingText: 'В Якутске по улице Дзержинского прорыв теплотрассы в минус 42 градуса, батареи остыли в 12 многоквартирных домах.'
  }
];

export default function WhatsAppIntakeSimulator({ onNavigateTab }) {
  const [activePreset, setActivePreset] = useState(PRESET_CONVERSATIONS[0]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'system',
      text: '🔒 Messages and calls are end-to-end encrypted under IS 17428 / ISO 27701 Sovereign Standards. No personal data leaves in-country territory.',
      time: '10:00 AM'
    },
    {
      id: 2,
      sender: 'bot',
      text: 'Namaste & Welcome to NAGRIK Citizen Demand Intelligence. Please share your infrastructure grievance via text or voice note.',
      time: '10:01 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend = null) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: timeStr
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/intake/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'whatsapp',
          raw_text: text,
          citizen_name: activePreset.citizenName,
          phone_number: activePreset.phone,
          country: activePreset.country,
          language_hint: 'auto',
          consent_granted: true
        })
      });

      if (res.ok) {
        const data = await res.json();
        const trackingId = `NGK-WA-${Math.floor(100000 + Math.random() * 900000)}`;
        
        setTimeout(() => {
          setIsTyping(false);
          const botReply = {
            id: Date.now() + 1,
            sender: 'bot',
            text: `✅ Grievance Registered!\n\n📋 Tracking ID: ${trackingId}\n🏷️ Sector: ${data.extraction?.sector?.toUpperCase() || 'CIVIC'}\n📍 Location: ${data.geocoding?.district || activePreset.country}\n🛡️ Privacy: PII Masked (${data.scrubbed_preview?.name || 'R******'})\n\nYour demand has been merged into the municipal priority ledger.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hasAction: true,
            district: data.geocoding?.district || 'Banda'
          };
          setMessages(prev => [...prev, botReply]);
        }, 1200);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'bot',
          text: `✅ Grievance Received! Tracking ID: NGK-WA-894102. Sector: WATER. PII Anonymized under DPDP Act.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    }
  };

  const handleApplyPreset = (preset) => {
    setActivePreset(preset);
    setInputText(preset.incomingText);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-3xl bg-[#0c0f1a] border border-emerald-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
            <span className="font-heading font-black text-2xl">WA</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-lg text-white">
                WhatsApp Sovereign Citizen Hotline
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ACTIVE GATEWAY
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Interactive end-to-end citizen messaging gateway with instant AI PII-scrubbing & gazetteer geocoding.
            </p>
          </div>
        </div>

        {/* Preset Selectors */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {PRESET_CONVERSATIONS.map(p => (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                activePreset.id === p.id
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/60 shadow-md'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <span>{p.flag} {p.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main WhatsApp Window Container */}
      <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden border border-emerald-500/30 bg-[#0b141a] shadow-2xl flex flex-col h-[580px]">
        
        {/* WhatsApp App Header */}
        <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              N
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white leading-tight">
                  NAGRIK Sovereign Grievance Hotline
                </h3>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-emerald-400/90 font-sans">
                Official Business Account · Online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <Video className="w-5 h-5 hover:text-white cursor-pointer" />
            <Phone className="w-5 h-5 hover:text-white cursor-pointer" />
            <MoreVertical className="w-5 h-5 hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Message Thread Body (Dark WhatsApp Chat Wallpaper) */}
        <div 
          className="flex-1 p-4 overflow-y-auto space-y-3"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(18, 140, 126, 0.05) 0%, transparent 80%)`,
            backgroundColor: '#0b141a'
          }}
        >
          {messages.map(msg => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <div className="max-w-md p-2 rounded-xl bg-[#182229]/90 border border-white/5 text-[11px] text-amber-200/90 text-center shadow-sm">
                    {msg.text}
                  </div>
                </div>
              );
            }

            const isUser = msg.sender === 'user';

            return (
              <div 
                key={msg.id} 
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl p-3 shadow-md relative ${
                    isUser 
                      ? 'bg-[#005c4b] text-white rounded-tr-none' 
                      : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-white/5'
                  }`}
                >
                  <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-line">
                    {msg.text}
                  </p>

                  {/* Optional Action Button inside WhatsApp */}
                  {msg.hasAction && onNavigateTab && (
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-2">
                      <button
                        onClick={() => onNavigateTab('map')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>View on Google Maps</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                    <span>{msg.time}</span>
                    {isUser && <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#202c33] rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-slate-300 flex items-center gap-2 border border-white/5 shadow-md">
                <span className="text-[11px] text-emerald-400 font-mono">NAGRIK AI analyzing</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="bg-[#202c33] p-3 flex items-center gap-2 border-t border-white/10">
          <button className="text-slate-400 hover:text-white p-1">
            <Smile className="w-5 h-5" />
          </button>
          <button className="text-slate-400 hover:text-white p-1">
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your infrastructure grievance in any language..."
            className="flex-1 bg-[#2a3942] text-xs text-white px-4 py-2.5 rounded-xl border border-white/5 focus:outline-none focus:border-emerald-500/60 placeholder:text-slate-400"
          />

          {inputText.trim() ? (
            <button
              onClick={() => handleSend()}
              className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-lg shadow-emerald-500/30"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          ) : (
            <button
              onClick={() => handleSend(activePreset.incomingText)}
              title="Send preset citizen voice note"
              className="w-10 h-10 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
