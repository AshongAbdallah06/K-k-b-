import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, Send, AlertTriangle } from 'lucide-react';
import { useState, type FormEvent } from 'react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg glass border-crimson/30 rounded-2xl p-8 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-crimson animate-pulse" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-20 h-20 bg-neon-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-10 h-10 text-neon-cyan" />
                </div>
                <h2 className="font-sans font-black text-3xl uppercase tracking-tighter mb-2">REPORT TRANSMITTED</h2>
                <p className="font-mono text-xs text-white/40 uppercase tracking-widest">Authorities and network providers have been alerted.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-crimson rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,0,60,0.4)]">
                    <ShieldAlert className="text-white w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="font-sans font-black text-3xl uppercase tracking-tighter leading-none">EMERGENCY REPORT</h2>
                    <p className="font-mono text-[10px] text-crimson font-bold uppercase tracking-widest mt-1">Direct Link to Cyber-Taskforce</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">SUSPECT NUMBER / SHORTCODE</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. 024 XXX XXXX or *170#"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-4 font-sans text-white focus:outline-none focus:border-crimson/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">INCIDENT DESCRIPTION</label>
                    <textarea 
                      required
                      placeholder="Describe the scam attempt briefly..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-4 font-sans text-white h-32 resize-none focus:outline-none focus:border-crimson/50 transition-colors"
                    />
                  </div>

                  <div className="bg-crimson/10 border border-crimson/20 p-4 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-crimson shrink-0" />
                    <p className="font-mono text-[9px] text-crimson leading-tight uppercase font-bold">
                      WARNING: False reporting is a criminal offense under the Cybersecurity Act 2020.
                    </p>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-crimson text-white font-sans font-black uppercase tracking-tighter hover:bg-white hover:text-crimson transition-all rounded-lg shadow-lg"
                  >
                    TRANSMIT REPORT NOW
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
