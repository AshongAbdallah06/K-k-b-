import { useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, ShieldAlert, Globe, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export interface RiskHeatmapItem {
  segment: string;
  risk: 'High' | 'Medium' | 'Low';
}

export interface ScamAnalysis {
  verdict: 'SCAM' | 'SUSPICIOUS' | 'SAFE';
  confidence_score: number;
  scam_category: string;
  red_flags: string[];
  analysis_twi: string;
  analysis_english: string;
  risk_heatmap: RiskHeatmapItem[];
  report_id?: string;
  timestamp?: number;
}

interface ScamResultProps {
  analysis: ScamAnalysis;
  onReset: () => void;
  onPlayAudio: () => void;
  isAudioPlaying: boolean;
}

export default function ScamResult({ analysis, onReset, onPlayAudio, isAudioPlaying }: ScamResultProps) {
  const isScam = analysis.verdict === 'SCAM';
  const isSuspicious = analysis.verdict === 'SUSPICIOUS';

  useEffect(() => {
    // Optional: Auto-play is handled in App.tsx, but we could add logic here if needed.
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Main Verdict Card */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={cn(
            "md:col-span-8 glass p-8 rounded-2xl border-l-8 relative overflow-hidden",
            isScam ? "border-crimson" : isSuspicious ? "border-gold" : "border-neon-cyan"
          )}
        >
          <div className="flex items-start justify-between mb-8">
            <div>
              <h3 className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">FORENSIC VERDICT</h3>
              <div className="flex items-center gap-3">
                {isScam ? (
                  <ShieldAlert className="w-12 h-12 text-crimson" />
                ) : isSuspicious ? (
                  <AlertCircle className="w-12 h-12 text-gold" />
                ) : (
                  <CheckCircle2 className="w-12 h-12 text-neon-cyan" />
                )}
                <h2 className={cn(
                  "font-sans font-black text-6xl tracking-tighter uppercase",
                  isScam ? "text-crimson" : isSuspicious ? "text-gold" : "text-neon-cyan"
                )}>
                  {analysis.verdict}
                </h2>
              </div>
              <p className="font-mono text-xs text-white/60 mt-2 uppercase tracking-tight">
                CATEGORY: <span className="text-white">{analysis.scam_category}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-[10px] text-white/40 block mb-1">CONFIDENCE</span>
              <span className="font-sans font-black text-5xl text-gold">{analysis.confidence_score}%</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass bg-white/5 p-6 rounded-xl border-white/5 relative">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Zap className="w-12 h-12 text-gold" />
              </div>
              <div className="flex justify-between items-start gap-4 mb-4">
                <p className="font-sans text-2xl font-medium leading-tight italic text-gold">
                  "{analysis.analysis_twi}"
                </p>
                <button 
                  onClick={onPlayAudio}
                  disabled={isAudioPlaying}
                  className={cn(
                    "p-3 rounded-full transition-all shrink-0",
                    isAudioPlaying ? "bg-gold/20 text-gold animate-pulse" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  )}
                  title="Listen in Twi"
                >
                  <Zap className={cn("w-5 h-5", isAudioPlaying && "fill-current")} />
                </button>
              </div>
              <p className="font-sans text-lg text-white/80 leading-relaxed">
                {analysis.analysis_english}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-mono text-[10px] text-white/40 uppercase tracking-widest">RED FLAGS</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.red_flags.map((flag, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1 bg-crimson/10 border border-crimson/20 rounded-full">
                      <div className="w-1 h-1 rounded-full bg-crimson" />
                      <span className="font-mono text-[9px] text-crimson uppercase font-bold">{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-mono text-[10px] text-white/40 uppercase tracking-widest">REPORT AUTHENTICITY</h4>
                <div className="glass bg-black/40 p-3 rounded-lg border-white/5">
                  <span className="font-mono text-[9px] text-white/40 block mb-1">TAMPER-PROOF ID</span>
                  <span className="font-mono text-[10px] text-neon-cyan break-all">{analysis.report_id || 'KKB-PROT-XXXX-XXXX'}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Risk Heatmap Card */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-4 glass p-6 rounded-2xl border-t border-white/10 relative h-full"
        >
          <h3 className="font-mono text-[10px] text-gold uppercase tracking-widest mb-6">RISK HEATMAP</h3>
          
          <div className="space-y-4">
            {analysis.risk_heatmap.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 glass bg-white/5 rounded-lg border-white/5">
                <span className="font-mono text-xs text-white/80">{item.segment}</span>
                <span className={cn(
                  "font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase",
                  item.risk === 'High' ? "bg-crimson text-white" : 
                  item.risk === 'Medium' ? "bg-gold text-charcoal" : "bg-neon-cyan text-charcoal"
                )}>
                  {item.risk}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-white/10">
            <button 
              onClick={onReset}
              className="w-full py-4 bg-neon-cyan text-charcoal font-sans font-black uppercase tracking-tighter hover:bg-gold transition-colors rounded-lg flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              NEW FORENSIC SCAN
            </button>
          </div>
        </motion.div>

        {/* 3D Waveform Accent */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-12 glass h-24 rounded-2xl flex items-center justify-center overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/5 to-transparent animate-pulse" />
          <div className="flex items-end gap-1 h-12 relative z-10">
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: [10, Math.random() * 40 + 10, 10],
                  backgroundColor: isScam ? ['#FF003C', '#FFD700', '#FF003C'] : ['#00F5FF', '#FFD700', '#00F5FF']
                }}
                transition={{
                  duration: 0.3 + Math.random() * 0.7,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="w-1 rounded-full opacity-60"
              />
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
