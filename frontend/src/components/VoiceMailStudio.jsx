import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Play, Pause, Square, RefreshCw, Volume2, 
  ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Radio, Sparkles 
} from 'lucide-react';

const VOICEMAIL_INBOX = [
  {
    id: 'vm1',
    citizen: 'Ramesh Sharma',
    location: 'Banda District, Uttar Pradesh',
    country: 'India',
    language: 'Hindi (Bundelkhandi)',
    duration: 14,
    receivedTime: '3 mins ago',
    transcript: 'हमारे बांदा के बबेरू गांव में सारे हैंडपंप और कुएं सूख चुके हैं, 3 किमी दूर से पानी लाना पड़ता है। कृपया तत्काल नया बोरवेल लगवाएं।',
    englishPivot: 'In our Baberu village of Banda, all handpumps and wells have dried up, we have to fetch water from 3km away. Please immediately install a new borewell.',
    sector: 'Water',
    urgency: 'Critical (0.94)',
    asrConfidence: '98.4%',
    waveformPattern: [15, 30, 60, 45, 80, 95, 65, 40, 70, 85, 90, 50, 60, 75, 40, 30, 20]
  },
  {
    id: 'vm2',
    citizen: 'Pooja Jadhav',
    location: 'Dharavi, Mumbai Suburban',
    country: 'India',
    language: 'Marathi',
    duration: 18,
    receivedTime: '12 mins ago',
    transcript: 'धारावी 90 फीट रोडवर नाल्याचे घाण पाणी तुंबून चाळीत शिरले आहे. लेकरांना उलट्या-जुलाब होत आहेत, त्वरित ड्रेनेज साफ करा.',
    englishPivot: 'In Dharavi on 90-ft road dirty drain water has overflowed into chawls. Children are getting sick, please immediately clear drainage.',
    sector: 'Water / Sanitation',
    urgency: 'High (0.89)',
    asrConfidence: '97.8%',
    waveformPattern: [20, 45, 70, 85, 90, 60, 75, 80, 95, 85, 70, 60, 50, 40, 35, 25, 15]
  },
  {
    id: 'vm3',
    citizen: 'Carlos Silva',
    location: 'Caruaru, Pernambuco',
    country: 'Brazil',
    language: 'Portuguese',
    duration: 16,
    receivedTime: '24 mins ago',
    transcript: 'Na zona rural de Caruaru, a ponte de madeira do Riacho do Peixe caiu com a chuva e 80 famílias de agricultores estão isoladas sem poder escoar o leite.',
    englishPivot: 'In the rural area of Caruaru, the wooden bridge of Riacho do Peixe collapsed with the rain and 80 farmer families are isolated without being able to transport milk.',
    sector: 'Roads & Bridges',
    urgency: 'Critical (0.91)',
    asrConfidence: '98.1%',
    waveformPattern: [10, 25, 40, 65, 80, 85, 75, 90, 95, 80, 65, 55, 45, 35, 25, 20, 15]
  },
  {
    id: 'vm4',
    citizen: 'Sipho Ndlovu',
    location: 'Vhembe District, Limpopo',
    country: 'South Africa',
    language: 'isiZulu',
    duration: 12,
    receivedTime: '45 mins ago',
    transcript: 'Emtholampilo waseVhembe akukho gesi njalo kanti nomshini wokubelethisa awusebenzi. Abesifazane baphathwa kabi kakhulu.',
    englishPivot: 'At the Vhembe clinic there is no power always and the maternity machine is not working. Women are suffering greatly.',
    sector: 'Health / Electricity',
    urgency: 'Critical (0.95)',
    asrConfidence: '96.9%',
    waveformPattern: [30, 50, 80, 90, 95, 85, 70, 80, 85, 60, 50, 40, 30, 25, 20, 15, 10]
  }
];

export default function VoiceMailStudio({ onNavigateTab }) {
  const [selectedVm, setSelectedVm] = useState(VOICEMAIL_INBOX[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0); // 0 to 100
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [pipelineResult, setPipelineResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const playTimerRef = useRef(null);
  const recTimerRef = useRef(null);

  // Playback progress loop
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + (100 / (selectedVm.duration * 10));
        });
      }, 100);
    } else {
      clearInterval(playTimerRef.current);
    }
    return () => clearInterval(playTimerRef.current);
  }, [isPlaying, selectedVm]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recTimerRef.current = setInterval(() => {
        setRecordSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(recTimerRef.current);
    }
    return () => clearInterval(recTimerRef.current);
  }, [isRecording]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSelectVm = (vm) => {
    setIsPlaying(false);
    setCurrentProgress(0);
    setSelectedVm(vm);
    setPipelineResult(null);
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setRecordSeconds(0);
      handleProcessVoicemail(selectedVm);
    } else {
      setIsRecording(true);
      setRecordSeconds(0);
      setIsPlaying(false);
    }
  };

  const handleProcessVoicemail = async (vm) => {
    setProcessing(true);
    try {
      const res = await fetch('/api/intake/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'voice',
          raw_text: vm.transcript,
          citizen_name: vm.citizen,
          phone_number: '+91 98765 43210',
          country: vm.country,
          language_hint: 'auto',
          consent_granted: true,
          audio_simulated: true
        })
      });

      if (res.ok) {
        const data = await res.json();
        setPipelineResult(data);
      }
    } catch (err) {
      console.error('Voicemail ASR pipeline failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-3xl bg-[#080d14] border border-emerald-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-lg text-white">
                Sovereign Voice Mail & ASR Studio
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                16 kHz NEURAL ASR
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Listen to native dialect voicemails, inspect real-time phonetic ASR decoding, and test voice notes.
            </p>
          </div>
        </div>

        {/* Live Audio Record Simulation Button */}
        <button
          onClick={handleRecordToggle}
          className={`px-4 py-2.5 rounded-2xl font-heading font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            isRecording 
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-pulse'
              : 'bg-white/[0.05] hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Recording ({recordSeconds}s)</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" />
              <span>Simulate Citizen Mic</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Voicemail Inbox List (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-[#080d14]/90 border border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between px-2 pb-1 border-b border-white/10">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Voicemail Feed ({VOICEMAIL_INBOX.length})
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Gateway
            </span>
          </div>

          <div className="space-y-2">
            {VOICEMAIL_INBOX.map((vm) => {
              const isSelected = selectedVm.id === vm.id;
              return (
                <div
                  key={vm.id}
                  onClick={() => handleSelectVm(vm)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white truncate">
                      {vm.citizen}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {vm.receivedTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate">{vm.location.split(',')[0]}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white/5 text-emerald-300">
                      0:{vm.duration}
                    </span>
                  </div>

                  {/* Micro Waveform Preview */}
                  <div className="flex items-end gap-0.5 h-4 mt-2 opacity-60">
                    {vm.waveformPattern.slice(0, 12).map((h, idx) => (
                      <span
                        key={idx}
                        className="w-1 rounded-full bg-emerald-400"
                        style={{ height: `${Math.max(20, h * 0.4)}%` }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Voicemail Waveform Player & ASR Inspector (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-[#080d14] border border-emerald-500/30 p-6 space-y-6 shadow-2xl flex flex-col justify-between">
          
          <div>
            {/* Top Voicemail Meta Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-extrabold text-xl text-white">
                    {selectedVm.citizen}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {selectedVm.language}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  📍 {selectedVm.location} · Urgency: <strong className="text-rose-400">{selectedVm.urgency}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">ASR Confidence:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                  {selectedVm.asrConfidence}
                </span>
              </div>
            </div>

            {/* Dynamic Waveform Player Box */}
            <div className="my-6 p-5 rounded-2xl bg-[#05080c] border border-white/10 shadow-inner">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-3">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Phonetic Audio Stream</span>
                </span>
                <span>
                  0:{Math.floor((currentProgress / 100) * selectedVm.duration).toString().padStart(2, '0')} / 0:{selectedVm.duration}
                </span>
              </div>

              {/* Animated Waveform Bars */}
              <div className="flex items-center justify-between gap-1.5 h-20 px-2">
                {selectedVm.waveformPattern.map((h, i) => {
                  const barProgress = (i / selectedVm.waveformPattern.length) * 100;
                  const isPassed = currentProgress >= barProgress;
                  const dynamicHeight = isPlaying 
                    ? Math.min(100, Math.max(15, h + Math.sin(Date.now() / 200 + i) * 20))
                    : h;

                  return (
                    <div 
                      key={i} 
                      className="flex-1 flex flex-col items-center justify-center h-full cursor-pointer"
                      onClick={() => setCurrentProgress(barProgress)}
                    >
                      <div 
                        className={`w-full rounded-full transition-all duration-150 ${
                          isPassed
                            ? 'bg-gradient-to-t from-emerald-600 via-emerald-400 to-cyan-300 shadow-[0_0_8px_rgba(0,230,118,0.6)]'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                        style={{ height: `${dynamicHeight}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar & Player Controls */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#06090c] font-black flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-lg shadow-emerald-500/40"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
                </button>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-[11px]">16 kHz · IS 17428 Scrubbed</span>
                </div>
              </div>
            </div>

            {/* ASR Real-Time Transcript Display */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#06090f] border border-white/10">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                  1. Native Speech Transcript (Original Audio):
                </span>
                <p className="text-sm font-medium text-white leading-relaxed">
                  "{selectedVm.transcript}"
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#06090f] border border-white/10">
                <span className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider block mb-1">
                  2. English Pivot Translation (Preserved Sentiment):
                </span>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{selectedVm.englishPivot}"
                </p>
              </div>
            </div>

          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => handleProcessVoicemail(selectedVm)}
              disabled={processing}
              className="px-5 py-2.5 rounded-xl font-heading font-bold text-xs text-[#06090c] edge-glow-button flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${processing ? 'animate-spin' : ''}`} />
              <span>{processing ? 'Processing ASR Pipeline...' : 'Run Full Ingest Pipeline'}</span>
            </button>

            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('map')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.05] hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Pinpoint {selectedVm.location.split(',')[0]} on Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Pipeline Result Snapshot if processed */}
          {pipelineResult && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Demand verified and registered in <strong>{pipelineResult.geocoding?.district}</strong> district database.</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 font-bold">
                LAT: {pipelineResult.geocoding?.lat} · LON: {pipelineResult.geocoding?.lng}
              </span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
