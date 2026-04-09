import { useCallback, useState, type FormEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Shield, AlertTriangle, FileAudio, FileText, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface AnalysisChamberProps {
  onAnalyze: (files: File[], text?: string) => void;
  isAnalyzing: boolean;
}

export default function AnalysisChamber({ onAnalyze, isAnalyzing }: AnalysisChamberProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [textInput, setTextInput] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onAnalyze(acceptedFiles);
    }
  }, [onAnalyze]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'text/plain': ['.txt']
    },
    multiple: true
  } as any);

  const handleTextSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      onAnalyze([], textInput);
    }
  };

  return (
    <div 
      className={cn(
        "relative group w-full max-w-2xl mx-auto space-y-6",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative Neon Corners */}
      <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-neon-cyan z-20" />
      <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-neon-cyan z-20" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Dropzone Area */}
        <div 
          {...getRootProps()} 
          className={cn(
            "aspect-[16/8] w-full glass rounded-lg flex flex-col items-center justify-center p-8 transition-all duration-500 cursor-pointer overflow-hidden relative",
            isDragActive ? "bg-neon-cyan/10 border-neon-cyan scale-[0.98]" : "hover:bg-white/10 border-white/10",
            isAnalyzing && "pointer-events-none opacity-50"
          )}
        >
          <input {...getInputProps()} />
          
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-neon-cyan animate-spin" />
                  <Shield className="w-6 h-6 text-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center">
                  <h2 className="font-sans font-black text-xl tracking-tighter text-neon-cyan mb-1 uppercase">
                    SCANNING DIGITAL SIGNATURES
                  </h2>
                  <p className="font-mono text-[10px] text-white/60 uppercase tracking-widest">
                    Analyzing MoMo protocols & deepfake artifacts...
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="relative group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-0 bg-neon-cyan/20 blur-2xl rounded-full scale-150 animate-pulse" />
                  <div className="relative glass p-4 rounded-full border-neon-cyan/30">
                    <Upload className="w-8 h-8 text-neon-cyan" />
                  </div>
                </div>
                
                <div>
                  <h2 className="font-sans font-black text-3xl tracking-tighter mb-1 uppercase">
                    DROP <span className="text-neon-cyan">EVIDENCE</span>
                  </h2>
                  <p className="font-mono text-[10px] text-white/40 max-w-xs mx-auto uppercase tracking-tight">
                    Upload voice notes, MoMo screenshots, or suspicious files.
                  </p>
                </div>

                <div className="flex gap-3 mt-2">
                  <div className="flex items-center gap-2 px-3 py-1 glass rounded-full border-white/5">
                    <FileAudio className="w-3 h-3 text-gold" />
                    <span className="font-mono text-[9px] uppercase">Audio</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 glass rounded-full border-white/5">
                    <FileText className="w-3 h-3 text-neon-cyan" />
                    <span className="font-mono text-[9px] uppercase">Screenshots</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, #00F5FF 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </div>

        {/* Text Input Area */}
        <motion.form 
          onSubmit={handleTextSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-lg p-4 border-white/10 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-mono text-[10px] text-white/40 uppercase tracking-widest">RAW TEXT ANALYSIS</h3>
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-neon-cyan animate-pulse" />
              <span className="font-mono text-[8px] text-neon-cyan uppercase">SMS / WhatsApp Mode</span>
            </div>
          </div>
          
          <textarea 
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste suspicious SMS or WhatsApp message here..."
            className="w-full h-24 bg-black/20 border border-white/5 rounded-md p-3 font-sans text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30 transition-colors resize-none mb-3"
            disabled={isAnalyzing}
          />
          
          <button 
            type="submit"
            disabled={isAnalyzing || !textInput.trim()}
            className="w-full py-2 bg-white/5 border border-white/10 rounded-md font-mono text-[10px] uppercase tracking-widest hover:bg-neon-cyan hover:text-charcoal transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            ANALYZE TEXT STRING
          </button>
        </motion.form>
      </div>

      <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-neon-cyan z-20" />
      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-neon-cyan z-20" />
    </div>
  );
}
