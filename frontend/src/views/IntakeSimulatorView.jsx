import React, { useState } from 'react';
import { 
  Send, Mic, MessageSquare, PhoneCall, Globe, 
  ShieldCheck, Sparkles, Volume2, Play, Square, RefreshCw 
} from 'lucide-react';
import PipelineVisualizer from '../components/PipelineVisualizer';

const PRESET_TEMPLATES = [
  {
    label: "Banda Water Crisis (Hindi)",
    country: "India",
    channel: "voice",
    language: "hi",
    name: "Ramesh Sharma",
    phone: "+91 98765 43210",
    text: "हमारे बांदा के बबेरू गांव में सारे हैंडपंप और कुएं सूख चुके हैं, 3 किमी दूर से पानी लाना पड़ता है। कृपया तत्काल नया बोरवेल लगवाएं।"
  },
  {
    label: "Dharavi Sewer Flooding (Marathi)",
    country: "India",
    channel: "whatsapp",
    language: "mr",
    name: "Pooja Jadhav",
    phone: "+91 98220 12345",
    text: "धारावी 90 फीट रोडवर नाल्याचे घाण पाणी तुंबून चाळीत शिरले आहे. लेकरांना उलट्या-जुलाब होत आहेत, त्वरित ड्रेनेज साफ करा."
  },
  {
    label: "Agreste Broken Bridge (Portuguese)",
    country: "Brazil",
    channel: "sms",
    language: "pt",
    name: "Carlos Silva",
    phone: "+55 81 99876 5432",
    text: "Na zona rural de Caruaru, a ponte de madeira do Riacho do Peixe caiu com a chuva e 80 famílias de agricultores estão isoladas sem poder escoar o leite."
  },
  {
    label: "Vhembe Clinic Outage (isiZulu)",
    country: "South Africa",
    channel: "voice",
    language: "zu",
    name: "Sipho Ndlovu",
    phone: "+27 82 123 4567",
    text: "Emtholampilo waseVhembe akukho gesi njalo kanti nomshini wokubelethisa awusebenzi. Abesifazane baphathwa kabi kakhulu."
  },
  {
    label: "Yakutsk Heating Rupture (Russian)",
    country: "Russia",
    channel: "web",
    language: "ru",
    name: "Dmitry Smirnov",
    phone: "+7 914 123 4567",
    text: "В Якутске по улице Дзержинского прорыв теплотрассы в минус 42 градуса, батареи остыли в 12 многоквартирных домах."
  },
  {
    label: "Zhoukou School Heating (Mandarin)",
    country: "China",
    channel: "whatsapp",
    language: "zh",
    name: "Wang Qiang",
    phone: "+86 138 0000 1234",
    text: "周口市太康县农村小学教室冬天没有暖气，窗户漏风严重，几十个孩子双手生了冻疮，急需安装电暖器。"
  },
  {
    label: "Hinglish Urgent Pipeline Request",
    country: "India",
    channel: "whatsapp",
    language: "en-IN",
    name: "Anil Patel",
    phone: "+91 98110 56789",
    text: "Banda ke Baberu village me paani bilkul nahi aa raha hai, tanker mafia loot rahe hain, please urgent pipeline repair karo."
  }
];

export default function IntakeSimulatorView({ selectedCountry, t }) {
  const [channel, setChannel] = useState('voice');
  const [language, setLanguage] = useState('hi');
  const [country, setCountry] = useState(selectedCountry || 'India');
  const [name, setName] = useState('Ramesh Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [rawText, setRawText] = useState(PRESET_TEMPLATES[0].text);
  const [consentGranted, setConsentGranted] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  const [pipelineSteps, setPipelineSteps] = useState([]);
  const [pipelineSummary, setPipelineSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleApplyPreset = (preset) => {
    setChannel(preset.channel);
    setLanguage(preset.language);
    setCountry(preset.country);
    setName(preset.name);
    setPhone(preset.phone);
    setRawText(preset.text);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!rawText.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/intake/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          raw_text: rawText,
          citizen_name: name,
          phone_number: phone,
          country,
          language_hint: language,
          consent_granted: consentGranted,
          audio_simulated: channel === 'voice'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setPipelineSteps(data.pipeline_steps || []);
        setPipelineSummary(data.summary || null);
      }
    } catch (err) {
      console.error('Intake simulation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Title */}
      <div>
        <h2 className="font-heading font-extrabold text-xl text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          {t.intake.title}
        </h2>
        <p className="text-xs text-slate-400">
          {t.intake.subtitle}
        </p>
      </div>

      {/* Preset Pills */}
      <div className="glass-card p-3 rounded-xl border border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">Sample Citizen Inputs:</span>
        {PRESET_TEMPLATES.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleApplyPreset(p)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] shrink-0 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 2-Column Grid: Intake Form & Pipeline Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            
            {/* Channel Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                {t.intake.channelLabel}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'voice', label: 'Voice Note', icon: Mic },
                  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                  { id: 'sms', label: 'SMS IVR', icon: PhoneCall },
                  { id: 'web', label: 'Web Portal', icon: Globe },
                ].map((ch) => {
                  const Icon = ch.icon;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setChannel(ch.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all ${
                        channel === ch.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{ch.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Voice Audio Simulation Waveform Player */}
            {channel === 'voice' && (
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Volume2 className="w-4 h-4" />
                    Simulated Citizen Voice Recording (14.2s)
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white"
                  >
                    {isPlayingAudio ? <Square className="w-3 h-3 text-rose-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                    <span>{isPlayingAudio ? "Stop Audio" : "Listen Audio"}</span>
                  </button>
                </div>

                {/* Animated Waveform Bars */}
                <div className="flex items-center justify-between gap-1 h-8 px-2 bg-slate-950/60 rounded-lg">
                  {Array.from({ length: 32 }).map((_, i) => {
                    const heightPct = isPlayingAudio 
                      ? Math.sin((i + Date.now() / 200)) * 40 + 50 
                      : (Math.sin(i * 0.4) * 30 + 40);
                    return (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-150 ${isPlayingAudio ? 'bg-cyan-400' : 'bg-slate-700'}`}
                        style={{ height: `${Math.max(15, heightPct)}%` }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Message Area */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                {t.intake.rawTextLabel}
              </label>
              <textarea
                rows={4}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Enter grievance description in native language or script..."
                className="w-full bg-slate-900/90 text-sm text-slate-100 p-3 rounded-xl border border-slate-700/80 focus:outline-none focus:border-cyan-400 placeholder:text-slate-500 shadow-inner"
              />
            </div>

            {/* Country & Language Hint */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  {t.intake.countryLabel}
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-900 text-xs text-slate-200 p-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-400"
                >
                  <option value="India">India</option>
                  <option value="Brazil">Brazil</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Russia">Russia</option>
                  <option value="China">China</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  {t.intake.languageLabel}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-900 text-xs text-slate-200 p-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-400"
                >
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="mr">Marathi (मराठी)</option>
                  <option value="en-IN">Hinglish (Code-Mixed)</option>
                  <option value="pt">Portuguese (Português)</option>
                  <option value="zu">isiZulu</option>
                  <option value="ru">Russian (Русский)</option>
                  <option value="zh">Mandarin (中文)</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            {/* Simulated Citizen Metadata (PII Redaction Preview) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  {t.intake.nameLabel}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 text-xs text-slate-200 p-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  {t.intake.phoneLabel}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 text-xs text-slate-200 p-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Consent Gate Checkbox */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="consent"
                checked={consentGranted}
                onChange={(e) => setConsentGranted(e.target.checked)}
                className="mt-0.5 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="consent" className="text-[11px] text-slate-400 cursor-pointer leading-relaxed">
                <span className="font-semibold text-slate-300 block mb-0.5">Sovereign Privacy Consent (DPDP / LGPD / POPIA)</span>
                {t.intake.consentNotice}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-heading font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? t.intake.processing : t.intake.submitButton}</span>
            </button>

          </form>
        </div>

        {/* Right Column: Visualizer */}
        <div className="lg:col-span-6">
          <PipelineVisualizer
            steps={pipelineSteps}
            summary={pipelineSummary}
            loading={loading}
          />
        </div>

      </div>

    </div>
  );
}
