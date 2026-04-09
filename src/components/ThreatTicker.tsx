import { motion } from 'motion/react';

const THREATS = [
  { id: 1, location: 'ACCRA', type: 'MOMO SCAM', status: 'NEUTRALIZED', time: '2m ago' },
  { id: 2, location: 'KUMASI', type: 'VOICE DEEPFAKE', status: 'BLOCKED', time: '5m ago' },
  { id: 3, location: 'TAMALE', type: 'PROMO FRAUD', status: 'FLAGGED', time: '12m ago' },
  { id: 4, location: 'TAKORADI', type: 'IMPERSONATION', status: 'NEUTRALIZED', time: '15m ago' },
  { id: 5, location: 'CAPE COAST', type: 'WRONGFUL TRANSFER', status: 'BLOCKED', time: '22m ago' },
  { id: 6, location: 'ACCRA', type: 'FAKE STAFF', status: 'NEUTRALIZED', time: '30m ago' },
];

export default function ThreatTicker() {
  return (
    <div className="h-full w-full overflow-hidden relative border-l border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="absolute top-0 left-0 w-full p-4 bg-crimson/10 border-b border-crimson/30 z-10">
        <h3 className="font-mono text-xs font-bold tracking-widest text-crimson animate-pulse">
          LIVE THREAT FEED
        </h3>
      </div>
      
      <div className="pt-16 pb-4 flex flex-col gap-4 animate-marquee-vertical">
        {[...THREATS, ...THREATS].map((threat, i) => (
          <div 
            key={`${threat.id}-${i}`}
            className="px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors group"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-mono text-[10px] text-neon-cyan">{threat.location}</span>
              <span className="font-mono text-[10px] text-white/40">{threat.time}</span>
            </div>
            <div className="font-sans font-bold text-sm tracking-tight group-hover:text-gold transition-colors">
              {threat.type}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-1 w-1 rounded-full bg-crimson animate-ping" />
              <span className="font-mono text-[9px] text-crimson font-bold uppercase tracking-tighter">
                {threat.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-charcoal to-transparent pointer-events-none" />
    </div>
  );
}
