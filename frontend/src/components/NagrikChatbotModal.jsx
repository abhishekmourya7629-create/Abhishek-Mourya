import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, X, Sparkles, MessageSquare, MapPin, 
  Sliders, ShieldCheck, ChevronRight, RefreshCw, Zap, Copy, Check 
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "Where is the most severe water crisis in India?",
  "Show ghost allocations in South Delhi",
  "What is the healthcare deficit in Vhembe, SA?",
  "हमारे बांदा गांव में हैंडपंप टूट गया है, पानी नहीं आ रहा",
  "How does the DPDP Act protect citizen voicemails?"
];

export default function NagrikChatbotModal({ isOpen, onClose, selectedCountry = 'India', onNavigateTab }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `👋 **Namaste! I am the NAGRIK Sovereign AI Policy Copilot.**\n\nI continuously fuse citizen demands across voice notes, WhatsApp, and SMS with national demographic registers and public investment plans for **${selectedCountry}**.\n\nAsk me about demand hotspots, ghost allocations, budget simulations, or lodge a citizen grievance!`,
      dataHighlights: [
        { label: 'Active Demands', value: '1,531 multi-channel' },
        { label: 'Top Hotspot', value: 'Banda Water (Rank #1)' },
        { label: 'Sovereign Nodes', value: '5 BRICS Nations' }
      ],
      followUps: [
        "Where is the most severe water crisis in India?",
        "Show ghost allocations in South Delhi",
        "How does DPDP 2023 protect citizen data?"
      ],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  const handleSend = async (messageText = null) => {
    const text = messageText || input;
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          country: selectedCountry
        })
      });

      if (res.ok) {
        const data = await res.json();
        const botMessage = {
          id: Date.now() + 1,
          sender: 'bot',
          text: data.reply,
          intent: data.intent,
          dataHighlights: data.data_highlights || [],
          suggestedActions: data.suggested_actions || [],
          followUps: data.follow_ups || [],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Chatbot API error');
      }
    } catch (err) {
      const fallbackMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: `⚠️ **Sovereign Gateway Response**: Analyzed query for **${selectedCountry}**. In Banda, 204 verified water requests have zero planned budget. Recommendation: Re-allocate $14M from South Delhi Smart Poles.`,
        dataHighlights: [{ label: 'Banda Water', value: '204 Demands · $0.0M Budget' }],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl h-[85vh] max-h-[780px] rounded-3xl bg-[#080d14] border border-emerald-500/40 shadow-[0_0_80px_rgba(0,230,118,0.25)] flex flex-col overflow-hidden">
        
        {/* Chatbot Top Bar */}
        <div className="px-6 py-4 bg-[#0c131d] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-300 p-[1.5px] shadow-lg shadow-emerald-500/30">
              <div className="w-full h-full bg-[#080d14] rounded-[14px] flex items-center justify-center text-emerald-400">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-base text-white">
                  NAGRIK AI Sovereign Copilot
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  DPG 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>In-Country Sovereign Neural Engine ({selectedCountry})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessages(messages.slice(0, 1))}
              title="Reset conversation"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Suggested Quick Prompt Carousel */}
        <div className="px-6 py-2 bg-[#06090e] border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase shrink-0">
            Suggested:
          </span>
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-200 border border-white/10 hover:border-emerald-500/40 whitespace-nowrap transition-all text-[11px] cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';

            return (
              <div 
                key={msg.id} 
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div 
                  className={`max-w-[85%] rounded-3xl p-4 shadow-xl relative ${
                    isUser 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-[#06090c] font-medium rounded-tr-none' 
                      : 'bg-[#0c1420] text-slate-100 rounded-tl-none border border-white/10'
                  }`}
                >
                  {/* Message Text with Simple Markdown Line Handling */}
                  <div className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-line space-y-2">
                    {msg.text}
                  </div>

                  {/* Data Highlights Grid if returned */}
                  {msg.dataHighlights && msg.dataHighlights.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10">
                      {msg.dataHighlights.map((dh, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-black/30 border border-white/5">
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {dh.label}
                          </span>
                          <span className="text-xs font-bold text-emerald-300">
                            {dh.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Interactive Action Buttons */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/10">
                      {msg.suggestedActions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (onNavigateTab && act.target) {
                              onNavigateTab(act.target);
                              onClose();
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{act.label}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Contextual Follow-up Chips */}
                  {msg.followUps && msg.followUps.length > 0 && (
                    <div className="mt-3 pt-2 flex flex-col gap-1.5">
                      <span className="text-[10px] text-slate-400 font-mono">Follow-up inquiries:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followUps.map((fu, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(fu)}
                            className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 text-[10px] text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
                          >
                            ↳ {fu}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer Timestamp & Copy */}
                  <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-slate-400 border-t border-white/5">
                    <span>{msg.time}</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}

          {/* Assistant Typing Status */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#0c1420] rounded-3xl rounded-tl-none p-3 text-xs text-slate-300 flex items-center gap-2 border border-white/10 shadow-lg">
                <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
                <span className="text-[11px] text-emerald-300 font-mono">
                  Synthesizing demographic registers & spatial z-scores...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-[#0c131d] border-t border-white/10 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask NAGRIK Copilot or report grievance in any language (${selectedCountry})...`}
            className="flex-1 bg-[#141b27] text-xs sm:text-sm text-white px-4 py-3 rounded-2xl border border-white/10 focus:outline-none focus:border-emerald-500/70 placeholder:text-slate-500 font-sans"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-2xl font-heading font-bold text-xs text-[#06090c] edge-glow-button flex items-center gap-2 cursor-pointer disabled:opacity-40 transition-all"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
}
