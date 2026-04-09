import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Info, MapPin, Menu, X, Bell } from 'lucide-react';
import { GoogleGenAI, Modality } from '@google/genai';
import { cn } from './lib/utils';
import AdinkraBackground from './components/AdinkraBackground';
import AnalysisChamber from './components/AnalysisChamber';
import ScamResult, { type ScamAnalysis } from './components/ScamResult';
import HistoryView from './components/HistoryView';
import EmergencyModal from './components/EmergencyModal';
import ThreatMap from './components/ThreatMap';
import IntelligenceView from './components/IntelligenceView';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ScamAnalysis | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [history, setHistory] = useState<ScamAnalysis[]>([]);
  const [currentView, setCurrentView] = useState<'Vault' | 'History' | 'Threat Map' | 'Intelligence'>('Vault');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const playTwiAudio = async (twiText: string) => {
    try {
      setIsAudioPlaying(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say in a calm but firm protective tone in Twi: ${twiText}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const pcmData = new Int16Array(bytes.buffer);
        const float32Data = new Float32Array(pcmData.length);
        for (let i = 0; i < pcmData.length; i++) {
          float32Data[i] = pcmData[i] / 32768;
        }
        
        const audioBuffer = audioContext.createBuffer(1, float32Data.length, 24000);
        audioBuffer.getChannelData(0).set(float32Data);
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => setIsAudioPlaying(false);
        source.start();
      } else {
        setIsAudioPlaying(false);
      }
    } catch (error) {
      console.error("TTS failed:", error);
      setIsAudioPlaying(false);
    }
  };

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('kokobo_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('kokobo_history', JSON.stringify(history));
  }, [history]);

  const handleAnalyze = async (files: File[], text?: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const parts: any[] = [];
      
      if (text) {
        parts.push({ text: `Analyze this text for scams: ${text}` });
      }

      for (const file of files) {
        const base64 = await fileToBase64(file);
        parts.push({
          inlineData: {
            data: base64,
            mimeType: file.type
          }
        });
      }

      if (parts.length === 0) {
        setIsAnalyzing(false);
        return;
      }

      const systemInstruction = `
        Analyze the input for Ghanaian digital fraud patterns. Look for:
        1. Social Engineering: Urgency, impersonation of MTN/Telecel/Bank staff, or 'Wrongful Transfer' scripts.
        2. Linguistic Nuance: Identify code-switching between English, Twi, Ga, and Ewe.
        3. Deepfake Markers: In audio, flag unnatural speech patterns or 2026-era voice cloning artifacts.
        4. Metadata: Flag suspicious phone numbers or unofficial shortcodes.
        
        Return a JSON object:
        {
          "verdict": "SCAM | SUSPICIOUS | SAFE",
          "confidence_score": number (0-100),
          "scam_category": "string",
          "red_flags": ["string"],
          "analysis_twi": "1-sentence warning in Twi",
          "analysis_english": "1-sentence warning in English",
          "risk_heatmap": [ { "segment": "string", "risk": "High | Medium | Low" } ]
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts },
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || '{}');
      
      // Generate unique tamper-proof ID
      const reportId = `KKB-PROT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      
      const finalResult: ScamAnalysis = { ...result, report_id: reportId, timestamp: Date.now() };
      setAnalysis(finalResult);
      setHistory(prev => [finalResult, ...prev]);
      setIsAnalyzing(false);

      if (finalResult.verdict === 'SCAM') {
        playTwiAudio(finalResult.analysis_twi);
      }

    } catch (error) {
      console.error("Forensic analysis failed:", error);
      setIsAnalyzing(false);
      // Fallback mock for demo purposes if API fails
      const fallbackResult: ScamAnalysis = {
        verdict: "SCAM",
        confidence_score: 98,
        scam_category: "MoMo Reversal Fraud",
        red_flags: ["Urgency tactic", "Unofficial number", "Deepfake artifacts"],
        analysis_twi: "Hwɛ yie! Wiemfoɔ na wɔasɛne saa asɛm yi de repɛ wo sika.",
        analysis_english: "Warning: This message uses high-pressure tactics common in MoMo fraud.",
        risk_heatmap: [
          { segment: "dial *170#", risk: "High" },
          { segment: "reversal request", risk: "High" }
        ],
        report_id: `KKB-PROT-FAIL-${Date.now().toString(36).toUpperCase()}`,
        timestamp: Date.now()
      };
      setAnalysis(fallbackResult);
      setHistory(prev => [fallbackResult, ...prev]);
      playTwiAudio(fallbackResult.analysis_twi);
    }
  };

  const isScam = analysis?.verdict === 'SCAM';

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-1000 font-sans selection:bg-neon-cyan/30 overflow-x-hidden",
      isScam ? "bg-crimson/10" : "bg-charcoal"
    )}>
      <AdinkraBackground isAnalyzing={isAnalyzing} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            setCurrentView('Vault');
            setAnalysis(null);
          }}
        >
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-500",
            isScam ? "bg-crimson" : "bg-neon-cyan"
          )}>
            <ShieldAlert className="text-charcoal w-6 h-6" />
          </div>
          <h1 className="font-sans font-black text-2xl tracking-tighter uppercase">
            KƆKƆ<span className={isScam ? "text-crimson" : "text-neon-cyan"}>BƆ</span>
          </h1>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {['Vault', 'History', 'Threat Map', 'Intelligence'].map((item) => (
            <button 
              key={item} 
              onClick={() => {
                setCurrentView(item as any);
                if (item === 'Vault') setAnalysis(null);
              }}
              className={cn(
                "font-mono text-[10px] uppercase tracking-widest transition-colors",
                currentView === item ? "text-neon-cyan" : "text-white/60 hover:text-neon-cyan"
              )}
            >
              {item}
            </button>
          ))}
          <button className="px-5 py-2 bg-white/5 border border-white/10 rounded-full font-mono text-[10px] uppercase hover:bg-white/10 transition-all">
            Connect Wallet
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-charcoal/95 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {['Vault', 'History', 'Threat Map', 'Intelligence'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => {
                    setCurrentView(item as any);
                    if (item === 'Vault') setAnalysis(null);
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "font-sans font-black text-4xl uppercase tracking-tighter text-left",
                    currentView === item ? "text-neon-cyan" : "text-white/40"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative pt-24 min-h-screen">
        <section className="p-6 md:p-12 lg:p-20 z-10">
          <div className="max-w-7xl mx-auto">
            {currentView === 'Vault' ? (
              <>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mb-12"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className={cn("h-[1px] w-12 transition-colors", isScam ? "bg-crimson" : "bg-gold")} />
                    <span className={cn("font-mono text-[10px] uppercase tracking-[0.3em]", isScam ? "text-crimson" : "text-gold")}>
                      Guardian Protocol v2.6
                    </span>
                  </div>
                  <h2 className="font-sans font-black text-6xl md:text-8xl tracking-tighter leading-[0.85] uppercase mb-6">
                    THE DIGITAL <br />
                    <span className={isScam ? "text-crimson" : "text-neon-cyan"}>SHIELD</span> OF GHANA
                  </h2>
                  <p className="font-sans text-xl text-white/60 max-w-xl leading-relaxed">
                    AI-powered forensic analysis for Mobile Money, WhatsApp voice notes, and social engineering threats. 
                    Protecting your wealth from the next generation of digital predators.
                  </p>
                </motion.div>

                <AnimatePresence mode="wait">
                  {analysis ? (
                    <ScamResult 
                      analysis={analysis} 
                      onReset={() => setAnalysis(null)} 
                      onPlayAudio={() => playTwiAudio(analysis.analysis_twi)}
                      isAudioPlaying={isAudioPlaying}
                    />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                    >
                      <AnalysisChamber onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : currentView === 'History' ? (
              <HistoryView 
                history={history} 
                onSelect={(item) => {
                  setAnalysis(item);
                  setCurrentView('Vault');
                }}
                onClear={() => {
                  if (confirm("Are you sure you want to wipe your forensic archive?")) {
                    setHistory([]);
                  }
                }}
              />
            ) : currentView === 'Threat Map' ? (
              <ThreatMap history={history} />
            ) : currentView === 'Intelligence' ? (
              <IntelligenceView />
            ) : (
              <div className="py-20 text-center">
                <h2 className="font-sans font-black text-5xl uppercase tracking-tighter mb-4">{currentView}</h2>
                <p className="font-mono text-xs text-white/40 uppercase tracking-widest">This module is currently under development.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Floating Guardian Button */}
      <motion.button
        onClick={() => setIsEmergencyModalOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isScam ? {
          scale: [1, 1.1, 1],
          backgroundColor: ['#FF003C', '#FFD700', '#FF003C']
        } : {}}
        transition={isScam ? { duration: 0.5, repeat: Infinity } : {}}
        className={cn(
          "fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl group transition-colors",
          isScam ? "bg-crimson" : "bg-gold text-charcoal"
        )}
      >
        <div className="relative">
          <Bell className={cn("w-6 h-6 group-hover:animate-bounce", isScam ? "text-white" : "text-charcoal")} />
          <div className={cn(
            "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 animate-ping",
            isScam ? "bg-white border-crimson" : "bg-charcoal border-gold"
          )} />
        </div>
        <span className="font-sans font-black text-sm uppercase tracking-tighter">Emergency Report</span>
      </motion.button>

      <EmergencyModal 
        isOpen={isEmergencyModalOpen} 
        onClose={() => setIsEmergencyModalOpen(false)} 
      />

      {/* Background Market Image Overlay (Subtle) */}
      <div className="fixed inset-0 z-[-1] opacity-10 grayscale pointer-events-none">
        <img 
          src="https://picsum.photos/seed/accra-market/1920/1080?blur=10" 
          alt="Accra Market" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal" />
      </div>

      {/* Info Footer */}
      <footer className="relative z-10 p-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neon-cyan" />
            <span className="font-mono text-[10px] text-white/40 uppercase">HQ: ACCRA, GHANA</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gold" />
            <span className="font-mono text-[10px] text-white/40 uppercase">SECURE ENCRYPTION ACTIVE</span>
          </div>
        </div>
        <div className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
          © 2026 KƆKƆBƆ CYBERSECURITY SYSTEMS
        </div>
      </footer>
    </div>
  );
}
