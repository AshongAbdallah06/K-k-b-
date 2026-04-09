import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as d3 from 'd3';
import { ShieldAlert, Activity, MapPin, Users, Zap, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ThreatPoint {
  id: string;
  city: string;
  region: string;
  type: string;
  severity: 'High' | 'Medium' | 'Low';
  coords: [number, number]; // [x, y] percentage for simplified map
  timestamp: string;
}

const MOCK_THREATS: ThreatPoint[] = [
  { id: '1', city: 'Accra', region: 'Greater Accra', type: 'MoMo Reversal', severity: 'High', coords: [55, 85], timestamp: '2m ago' },
  { id: '2', city: 'Kumasi', region: 'Ashanti', type: 'Promo Scam', severity: 'Medium', coords: [45, 65], timestamp: '5m ago' },
  { id: '3', city: 'Tamale', region: 'Northern', type: 'Impersonation', severity: 'High', coords: [50, 35], timestamp: '12m ago' },
  { id: '4', city: 'Takoradi', region: 'Western', type: 'Bank Fraud', severity: 'Medium', coords: [35, 88], timestamp: '15m ago' },
  { id: '5', city: 'Ho', region: 'Volta', type: 'WhatsApp Hijack', severity: 'Low', coords: [75, 75], timestamp: '22m ago' },
  { id: '6', city: 'Sunyani', region: 'Bono', type: 'Job Scam', severity: 'Medium', coords: [30, 55], timestamp: '30m ago' },
];

export default function ThreatMap() {
  const [selectedThreat, setSelectedThreat] = useState<ThreatPoint | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Draw a stylized grid background
    const width = 600;
    const height = 800;

    const grid = svg.append('g').attr('class', 'grid').attr('opacity', 0.1);
    for (let i = 0; i <= width; i += 40) {
      grid.append('line').attr('x1', i).attr('y1', 0).attr('x2', i).attr('y2', height).attr('stroke', '#00F5FF');
    }
    for (let i = 0; i <= height; i += 40) {
      grid.append('line').attr('x1', 0).attr('y1', i).attr('x2', width).attr('y2', i).attr('stroke', '#00F5FF');
    }

    // Stylized Ghana Outline (Simplified)
    const ghanaPath = "M250,100 L350,100 L400,200 L450,400 L450,600 L400,750 L300,780 L200,750 L150,600 L150,400 L200,200 Z";
    
    svg.append('path')
      .attr('d', ghanaPath)
      .attr('fill', 'rgba(0, 245, 255, 0.05)')
      .attr('stroke', 'rgba(0, 245, 255, 0.3)')
      .attr('stroke-width', 2)
      .attr('class', 'ghana-outline');

    // Add threat points
    const points = svg.selectAll('.threat-point')
      .data(MOCK_THREATS)
      .enter()
      .append('g')
      .attr('class', 'threat-point')
      .attr('transform', d => `translate(${(d.coords[0] / 100) * width}, ${(d.coords[1] / 100) * height})`)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => setSelectedThreat(d))
      .on('mouseleave', () => setSelectedThreat(null));

    // Pulsing outer ring
    points.append('circle')
      .attr('r', 15)
      .attr('fill', d => d.severity === 'High' ? '#FF003C' : d.severity === 'Medium' ? '#FFD700' : '#00F5FF')
      .attr('opacity', 0.3)
      .append('animate')
      .attr('attributeName', 'r')
      .attr('values', '10;25;10')
      .attr('dur', '2s')
      .attr('repeatCount', 'indefinite');

    // Inner core
    points.append('circle')
      .attr('r', 6)
      .attr('fill', d => d.severity === 'High' ? '#FF003C' : d.severity === 'Medium' ? '#FFD700' : '#00F5FF')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Labels
    points.append('text')
      .text(d => d.city)
      .attr('dy', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255,255,255,0.6)')
      .attr('font-family', 'JetBrains Mono')
      .attr('font-size', '10px')
      .attr('text-transform', 'uppercase');

  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Map Display */}
        <div className="flex-1 glass rounded-2xl border-white/5 p-8 relative overflow-hidden min-h-[700px]">
          <div className="absolute top-6 left-6 z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-[1px] w-8 bg-neon-cyan" />
              <span className="font-mono text-[10px] text-neon-cyan uppercase tracking-widest">Live Tactical Grid</span>
            </div>
            <h2 className="font-sans font-black text-4xl tracking-tighter uppercase">THREAT <span className="text-neon-cyan">MAP</span></h2>
          </div>

          <div className="absolute top-6 right-6 z-10 flex flex-col gap-4">
            <div className="glass p-4 rounded-xl border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-4 h-4 text-neon-cyan animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-widest">System Status</span>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-xs text-white/40 font-mono uppercase">Nodes</div>
                  <div className="text-xl font-sans font-black text-neon-cyan">128</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-white/40 font-mono uppercase">Uptime</div>
                  <div className="text-xl font-sans font-black text-neon-cyan">99.9%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-full flex items-center justify-center">
            <svg 
              ref={svgRef} 
              viewBox="0 0 600 800" 
              className="w-full max-w-[500px] h-auto drop-shadow-[0_0_30px_rgba(0,245,255,0.1)]"
            />
          </div>

          {/* Legend */}
          <div className="absolute bottom-6 left-6 glass p-4 rounded-xl border-white/5 flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-crimson" />
              <span className="font-mono text-[10px] uppercase text-white/60">High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <span className="font-mono text-[10px] uppercase text-white/60">Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-cyan" />
              <span className="font-mono text-[10px] uppercase text-white/60">Active Monitoring</span>
            </div>
          </div>
        </div>

        {/* Sidebar: Incident Log & Details */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          
          {/* Selected Threat Detail */}
          <AnimatePresence mode="wait">
            {selectedThreat ? (
              <motion.div
                key={selectedThreat.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={cn(
                  "glass p-6 rounded-2xl border-l-4",
                  selectedThreat.severity === 'High' ? "border-l-crimson" : 
                  selectedThreat.severity === 'Medium' ? "border-l-gold" : "border-l-neon-cyan"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-white/40" />
                    <span className="font-mono text-[10px] uppercase text-white/40">{selectedThreat.region}</span>
                  </div>
                  <span className="font-mono text-[10px] text-white/40">{selectedThreat.timestamp}</span>
                </div>
                <h3 className="font-sans font-black text-2xl uppercase tracking-tighter mb-1">{selectedThreat.city}</h3>
                <div className="flex items-center gap-2 mb-6">
                  <Zap className={cn(
                    "w-3 h-3",
                    selectedThreat.severity === 'High' ? "text-crimson" : "text-gold"
                  )} />
                  <span className="font-mono text-[10px] uppercase font-bold text-neon-cyan">{selectedThreat.type}</span>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="text-[10px] font-mono text-white/40 uppercase mb-1">Risk Assessment</div>
                    <p className="text-xs text-white/80 leading-relaxed">
                      Multiple reports of {selectedThreat.type.toLowerCase()} detected in the {selectedThreat.city} metropolitan area. High-pressure social engineering tactics observed.
                    </p>
                  </div>
                  <button className="w-full py-3 bg-neon-cyan text-charcoal font-sans font-black text-xs uppercase tracking-widest rounded-lg hover:bg-white transition-colors">
                    View Forensic Data
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass p-6 rounded-2xl border-white/5 flex flex-col items-center justify-center text-center py-12"
              >
                <AlertCircle className="w-12 h-12 text-white/10 mb-4" />
                <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Hover over a node to view incident intelligence</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Live Incident Log */}
          <div className="glass rounded-2xl border-white/5 overflow-hidden flex-1 flex flex-col">
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-neon-cyan" />
                <span className="font-mono text-[10px] uppercase tracking-widest">Live Incident Log</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
            </div>
            <div className="p-4 space-y-4 overflow-y-auto max-h-[400px]">
              {MOCK_THREATS.map((threat) => (
                <div key={threat.id} className="flex gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
                  <div className={cn(
                    "w-1 h-full rounded-full shrink-0",
                    threat.severity === 'High' ? "bg-crimson" : "bg-gold"
                  )} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-sans font-bold text-xs uppercase">{threat.city}</span>
                      <span className="font-mono text-[8px] text-white/40">{threat.timestamp}</span>
                    </div>
                    <p className="text-[10px] text-white/60 font-mono uppercase tracking-tight">{threat.type}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="p-4 text-center font-mono text-[10px] uppercase tracking-widest text-neon-cyan hover:bg-neon-cyan/10 transition-colors border-t border-white/5">
              Download Full Report
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
