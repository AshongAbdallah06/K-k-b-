import { motion } from 'motion/react';
import { Brain, TrendingUp, ShieldCheck, Globe, Zap, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

const INSIGHTS = [
  {
    title: "Linguistic Evolution",
    description: "Fraudsters are increasingly using 'Deep Twi' and localized slang to bypass standard AI filters. Kɔkɔbɔ's 2026 engine now detects 45+ regional dialects.",
    icon: MessageSquare,
    stat: "+24% Accuracy",
    color: "text-neon-cyan"
  },
  {
    title: "MoMo Protocol Vulnerability",
    description: "A new 'Ghost Reversal' technique has been spotted in the Ashanti region. Users are advised to verify all reversal requests via official bank channels only.",
    icon: Zap,
    stat: "High Alert",
    color: "text-crimson"
  },
  {
    title: "Global Threat Correlation",
    description: "We've identified patterns linking local MoMo scams to international phishing syndicates in Southeast Asia. Cross-border intelligence is active.",
    icon: Globe,
    stat: "Sync Active",
    color: "text-gold"
  }
];

export default function IntelligenceView() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-[1px] w-8 bg-neon-cyan" />
          <span className="font-mono text-[10px] text-neon-cyan uppercase tracking-widest">AI Core Intelligence</span>
        </div>
        <h2 className="font-sans font-black text-5xl tracking-tighter uppercase">STRATEGIC <span className="text-neon-cyan">INSIGHTS</span></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {INSIGHTS.map((insight, i) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-2xl border-white/5 relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <insight.icon className="w-24 h-24" />
            </div>
            
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-6 bg-white/5", insight.color)}>
              <insight.icon className="w-6 h-6" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans font-black text-xl uppercase tracking-tighter">{insight.title}</h3>
              <span className={cn("font-mono text-[10px] font-bold uppercase", insight.color)}>{insight.stat}</span>
            </div>

            <p className="font-sans text-sm text-white/60 leading-relaxed">
              {insight.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-2xl border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <Brain className="w-6 h-6 text-neon-cyan" />
            <h3 className="font-sans font-black text-2xl uppercase tracking-tighter">Neural Network Status</h3>
          </div>
          
          <div className="space-y-6">
            {[
              { label: "Pattern Recognition", value: 98.4 },
              { label: "Linguistic Analysis", value: 96.2 },
              { label: "Deepfake Detection", value: 94.8 },
              { label: "Metadata Correlation", value: 99.1 }
            ].map((stat) => (
              <div key={stat.label}>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-mono text-[10px] text-white/40 uppercase">{stat.label}</span>
                  <span className="font-sans font-bold text-neon-cyan">{stat.value}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-neon-cyan shadow-[0_0_10px_rgba(0,245,255,0.5)]" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-8 rounded-2xl border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-6 h-6 text-gold" />
              <h3 className="font-sans font-black text-2xl uppercase tracking-tighter">Threat Trajectory</h3>
            </div>
            <p className="font-sans text-sm text-white/60 leading-relaxed mb-6">
              Current data suggests a 15% increase in AI-generated voice scams targeting elderly users in the next quarter. We are deploying preemptive educational filters to high-risk zones.
            </p>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-gold/10 border border-gold/20 rounded-xl">
            <ShieldCheck className="w-8 h-8 text-gold shrink-0" />
            <div>
              <div className="font-sans font-black text-sm uppercase text-gold">Preemptive Shield Active</div>
              <p className="font-mono text-[10px] text-gold/60 uppercase">Protecting 1.2M+ active MoMo nodes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
