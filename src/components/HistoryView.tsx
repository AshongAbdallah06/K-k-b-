import { motion } from 'motion/react';
import { ShieldAlert, AlertCircle, CheckCircle2, Clock, Trash2, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import type { ScamAnalysis } from './ScamResult';

interface HistoryViewProps {
  history: ScamAnalysis[];
  onSelect: (analysis: ScamAnalysis) => void;
  onClear: () => void;
}

export default function HistoryView({ history, onSelect, onClear }: HistoryViewProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="glass p-6 rounded-full mb-6 border-white/5">
          <Clock className="w-12 h-12 text-white/20" />
        </div>
        <h2 className="font-sans font-black text-3xl uppercase tracking-tighter mb-2">NO RECORDS FOUND</h2>
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest">Your forensic history is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-[1px] w-8 bg-gold" />
            <span className="font-mono text-[10px] text-gold uppercase tracking-widest">Archive Access</span>
          </div>
          <h2 className="font-sans font-black text-5xl tracking-tighter uppercase">FORENSIC <span className="text-neon-cyan">HISTORY</span></h2>
        </div>
        <button 
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 glass hover:bg-crimson/20 hover:text-crimson transition-all rounded-lg border-white/5 font-mono text-[10px] uppercase tracking-widest"
        >
          <Trash2 className="w-3 h-3" />
          Wipe Archive
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {history.map((item, i) => (
          <motion.div
            key={item.report_id || i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(item)}
            className="group glass p-6 rounded-xl border-white/5 hover:border-neon-cyan/30 cursor-pointer transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center",
                item.verdict === 'SCAM' ? "bg-crimson/20 text-crimson" : 
                item.verdict === 'SUSPICIOUS' ? "bg-gold/20 text-gold" : "bg-neon-cyan/20 text-neon-cyan"
              )}>
                {item.verdict === 'SCAM' ? <ShieldAlert /> : item.verdict === 'SUSPICIOUS' ? <AlertCircle /> : <CheckCircle2 />}
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className={cn(
                    "font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                    item.verdict === 'SCAM' ? "bg-crimson text-white" : 
                    item.verdict === 'SUSPICIOUS' ? "bg-gold text-charcoal" : "bg-neon-cyan text-charcoal"
                  )}>
                    {item.verdict}
                  </span>
                  <span className="font-mono text-[10px] text-white/40">{item.report_id}</span>
                </div>
                <h3 className="font-sans font-bold text-lg tracking-tight group-hover:text-neon-cyan transition-colors">
                  {item.scam_category}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right hidden sm:block">
                <span className="font-mono text-[10px] text-white/40 block">CONFIDENCE</span>
                <span className="font-sans font-black text-xl text-gold">{item.confidence_score}%</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-neon-cyan transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
