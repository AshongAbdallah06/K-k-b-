import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const ADINKRA_SYMBOLS = [
  {
    name: 'Nyame Nti',
    path: 'M 50 10 L 90 50 L 50 90 L 10 50 Z M 50 30 L 70 50 L 50 70 L 30 50 Z', // Simplified diamond-in-diamond
    description: 'Faith & Protection',
  },
  {
    name: 'Nkonsonkonson',
    path: 'M 30 50 A 20 20 0 1 1 70 50 A 20 20 0 1 1 30 50 M 40 50 A 10 10 0 1 0 60 50 A 10 10 0 1 0 40 50', // Simplified chain link
    description: 'Unity & Security',
  },
];

interface AdinkraBackgroundProps {
  isAnalyzing?: boolean;
}

export default function AdinkraBackground({ isAnalyzing }: AdinkraBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            rotate: Math.random() * 360,
            scale: 0.5 + Math.random() * 1.5
          }}
          animate={{
            y: ['-10%', '110%'],
            rotate: [0, 360],
          }}
          transition={{
            duration: isAnalyzing ? 10 + Math.random() * 20 : 20 + Math.random() * 40,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className={cn(
              "transition-colors duration-500",
              isAnalyzing ? "text-neon-cyan/40" : "text-neon-cyan/20"
            )}
          >
            <path d={ADINKRA_SYMBOLS[i % ADINKRA_SYMBOLS.length].path} />
          </svg>
        </motion.div>
      ))}
      
      {/* Large central pulsing symbol */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
        <motion.svg
          width="600"
          height="600"
          viewBox="0 0 100 100"
          animate={{
            scale: isAnalyzing ? [1, 1.2, 1] : [1, 1.1, 1],
            opacity: isAnalyzing ? [0.05, 0.2, 0.05] : [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: isAnalyzing ? 2 : 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={isAnalyzing ? "text-neon-cyan" : "text-gold"}
        >
          <path d={ADINKRA_SYMBOLS[1].path} fill="currentColor" />
        </motion.svg>
      </div>
    </div>
  );
}
