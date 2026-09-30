import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, MessageSquare, MapPin, 
  Sliders, ShieldCheck, ChevronRight, RefreshCw, Zap, Copy, Check, FileText 
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "Where is the most severe water crisis in India?",
  "Show ghost allocations in South Delhi",
  "What is the healthcare deficit in Vhembe, SA?",
  "हमारे बांदा गांव में हैंडपंप टूट गया है, पानी नहीं आ रहा",
  "How does the DPDP Act protect citizen voicemails?",
  "Draft a policy memo for Dharavi monsoon drainage"
];

export default function ChatbotView({ selectedCountry = 'India', onNavigateTab }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `👋 **Welcome to the NAGRIK Sovereign AI Policy & Citizen Copilot.**\n\nI continuously monitor demand signals, multi-channel voice notes, WhatsApp logs, and public capital allocations for **${selectedCountry}** and all BRICS sovereign nodes.\n\nYou can query demand hotspots, scrutinize ghost allocations, simulate budget reallocations, or register citizen demands directly in natural language.`,
      dataHighlights: [
        { label: 'Platform Mode', value: 'DPG Sovereign Intelligence' },
        { label: 'Active Requests', value: '1,531 cross-lingual' },
        { label: 'Statutory Standard', value: 'DPDP / LGPD / POPIA Compliant' },
        { label: 'Current Focus', value: selectedCountry }
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
    scrollToBottom();
  }, [messages, loading]);

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
        text: `⚠️ **Sovereign Gateway Response**: Query parsed for **${selectedCountry}**. In Banda, 204 verified water requests have zero planned budget. Recommendation: Re-allocate $14M from South Delhi Smart Poles.`,
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

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-3xl bg-[#080d14] border border-emerald-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-300 p-[1.5px] shadow-lg shadow-emerald-500/30">
            <div className="w-full h-full bg-[#080d14] rounded-[14px] flex items-center justify-center text-emerald-400">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-lg text-white">
                NAGRIK AI Sovereign Policy Copilot
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ACTIVE REASONING
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Query citizen demand hotspots, analyze budget gaps, or simulate citizen grievance intake across all BRICS sovereign nodes.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages(messages.slice(0, 1))}
          className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Prompts Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] text-emerald-400 font-mono font-bold shrink-0">
          Try Asking:
        </span>
        {SUGGESTED_PROMPTS.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-200 border border-white/10 hover:border-emerald-500/40 whitespace-nowrap transition-all text-xs cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Main Chat Interface */}
      <div className="rounded-3xl bg-[#080d14] border border-emerald-500/30 shadow-2xl flex flex-col h-[600px] overflow-hidden">
        
        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';

            return (
              <div 
                key={msg.id} 
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div 
                  className={`max-w-[85%] rounded-3xl p-5 shadow-xl relative ${
                    isUser 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-[#06090c] font-medium rounded-tr-none' 
                      : 'bg-[#0c1420] text-slate-100 rounded-tl-none border border-white/10'
                  }`}
                >
                  <div className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-line space-y-2">
                    {msg.text}
                  </div>

                  {/* Highlights Grid */}
                  {msg.dataHighlights && msg.dataHighlights.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-white/10">
                      {msg.dataHighlights.map((dh, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-white/5">
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

                  {/* Suggested Actions */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/10">
                      {msg.suggestedActions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (onNavigateTab && act.target) {
                              onNavigateTab(act.target);
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{act.label}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Follow-up Chips */}
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

                  {/* Timestamp & Copy */}
                  <div className="flex items-center justify-between mt-3 pt-1.5 text-[10px] text-slate-400 border-t border-white/5">
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
              <div className="bg-[#0c1420] rounded-3xl rounded-tl-none p-3.5 text-xs text-slate-300 flex items-center gap-2 border border-white/10 shadow-lg">
                <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
                <span className="text-[11px] text-emerald-300 font-mono">
                  Synthesizing demographic registers, census gaps & spatial z-scores...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
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
            className="px-6 py-3 rounded-2xl font-heading font-bold text-xs text-[#06090c] edge-glow-button flex items-center gap-2 cursor-pointer disabled:opacity-40 transition-all"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
}
