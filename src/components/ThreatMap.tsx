import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as d3 from 'd3';
import { ShieldAlert, Activity, Clock, Zap, AlertCircle, TrendingUp, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import type { ScamAnalysis } from './ScamResult';

interface ThreatMapProps {
  history: ScamAnalysis[];
}

export default function ThreatMap({ history }: ThreatMapProps) {
  const [selectedPoint, setSelectedPoint] = useState<ScamAnalysis | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Data processing
    const data = history.filter(h => h.timestamp).map(h => ({
      ...h,
      date: new Date(h.timestamp!)
    })).sort((a, b) => a.date.getTime() - b.date.getTime());

    if (data.length === 0) return;

    // Scales
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // Axes
    const xAxis = d3.axisBottom(x)
      .ticks(5)
      .tickFormat(d3.timeFormat('%H:%M') as any);
    
    const yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickFormat(d => `${d}%`);

    // Draw Grid
    g.append('g')
      .attr('class', 'grid opacity-10')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickSize(-height).tickFormat(() => ''));

    g.append('g')
      .attr('class', 'grid opacity-10')
      .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(() => ''));

    // Style Axes
    const gx = g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);
    
    gx.selectAll('text').attr('fill', 'rgba(255,255,255,0.4)').attr('font-family', 'JetBrains Mono').attr('font-size', '10px');
    gx.select('.domain').attr('stroke', 'rgba(255,255,255,0.1)');
    gx.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.1)');

    const gy = g.append('g')
      .call(yAxis);
    
    gy.selectAll('text').attr('fill', 'rgba(255,255,255,0.4)').attr('font-family', 'JetBrains Mono').attr('font-size', '10px');
    gy.select('.domain').attr('stroke', 'rgba(255,255,255,0.1)');
    gy.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.1)');

    // Draw Lines connecting points (optional, but looks cool)
    const line = d3.line<any>()
      .x(d => x(d.date))
      .y(d => y(d.confidence_score))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0, 245, 255, 0.1)')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Draw Points
    const points = g.selectAll('.dot')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'dot')
      .attr('transform', d => `translate(${x(d.date)},${y(d.confidence_score)})`)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => setSelectedPoint(d))
      .on('mouseleave', () => setSelectedPoint(null));

    points.append('circle')
      .attr('r', 8)
      .attr('fill', d => d.verdict === 'SCAM' ? '#FF003C' : d.verdict === 'SUSPICIOUS' ? '#FFD700' : '#00F5FF')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('class', 'transition-all duration-300 hover:r-12');

    // Add pulsing effect to SCAM points
    points.filter(d => d.verdict === 'SCAM')
      .append('circle')
      .attr('r', 8)
      .attr('fill', 'none')
      .attr('stroke', '#FF003C')
      .attr('stroke-width', 1)
      .append('animate')
      .attr('attributeName', 'r')
      .attr('values', '8;20;8')
      .attr('dur', '1.5s')
      .attr('repeatCount', 'indefinite');

  }, [history]);

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Scatter Plot Display */}
        <div ref={containerRef} className="flex-1 glass rounded-2xl border-white/5 p-8 relative overflow-hidden min-h-[600px]">
          <div className="absolute top-6 left-6 z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-[1px] w-8 bg-neon-cyan" />
              <span className="font-mono text-[10px] text-neon-cyan uppercase tracking-widest">Personal Threat Timeline</span>
            </div>
            <h2 className="font-sans font-black text-4xl tracking-tighter uppercase">THREAT <span className="text-neon-cyan">TRAJECTORY</span></h2>
          </div>

          <div className="absolute top-6 right-6 z-10 flex flex-col gap-4">
            <div className="glass p-4 rounded-xl border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-4 h-4 text-neon-cyan animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-widest">Risk Trend</span>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-xs text-white/40 font-mono uppercase">Scans</div>
                  <div className="text-xl font-sans font-black text-neon-cyan">{history.length}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-white/40 font-mono uppercase">Avg Risk</div>
                  <div className="text-xl font-sans font-black text-gold">
                    {history.length > 0 
                      ? Math.round(history.reduce((acc, h) => acc + h.confidence_score, 0) / history.length) 
                      : 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center py-40 text-center">
              <div className="glass p-6 rounded-full mb-6 border-white/5">
                <Activity className="w-12 h-12 text-white/10" />
              </div>
              <h3 className="font-sans font-black text-2xl uppercase tracking-tighter mb-2">NO DATA POINTS</h3>
              <p className="font-mono text-xs text-white/40 uppercase tracking-widest">Perform forensic scans to populate your trajectory.</p>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center mt-12">
              <svg 
                ref={svgRef} 
                className="w-full h-[500px] drop-shadow-[0_0_30px_rgba(0,245,255,0.05)]"
              />
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-6 left-6 glass p-4 rounded-xl border-white/5 flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-crimson" />
              <span className="font-mono text-[10px] uppercase text-white/60">Scam</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <span className="font-mono text-[10px] uppercase text-white/60">Suspicious</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-cyan" />
              <span className="font-mono text-[10px] uppercase text-white/60">Safe</span>
            </div>
          </div>
          
          <div className="absolute bottom-6 right-6 font-mono text-[10px] text-white/20 uppercase tracking-widest">
            X: Time | Y: Severity (Confidence)
          </div>
        </div>

        {/* Sidebar: Selected Point Details */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          
          <AnimatePresence mode="wait">
            {selectedPoint ? (
              <motion.div
                key={selectedPoint.report_id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={cn(
                  "glass p-6 rounded-2xl border-l-4",
                  selectedPoint.verdict === 'SCAM' ? "border-l-crimson" : 
                  selectedPoint.verdict === 'SUSPICIOUS' ? "border-l-gold" : "border-l-neon-cyan"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white/40" />
                    <span className="font-mono text-[10px] uppercase text-white/40">
                      {new Date(selectedPoint.timestamp!).toLocaleTimeString()}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-white/40">{selectedPoint.report_id}</span>
                </div>
                <h3 className="font-sans font-black text-2xl uppercase tracking-tighter mb-1">{selectedPoint.scam_category}</h3>
                <div className="flex items-center gap-2 mb-6">
                  <Zap className={cn(
                    "w-3 h-3",
                    selectedPoint.verdict === 'SCAM' ? "text-crimson" : "text-gold"
                  )} />
                  <span className={cn(
                    "font-mono text-[10px] uppercase font-bold",
                    selectedPoint.verdict === 'SCAM' ? "text-crimson" : "text-neon-cyan"
                  )}>{selectedPoint.verdict}</span>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="text-[10px] font-mono text-white/40 uppercase mb-1">Forensic Insight</div>
                    <p className="text-xs text-white/80 leading-relaxed">
                      {selectedPoint.analysis_english}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/5">
                    <Info className="w-3 h-3 text-neon-cyan" />
                    <span className="font-mono text-[9px] uppercase text-white/40">Confidence Score: {selectedPoint.confidence_score}%</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass p-6 rounded-2xl border-white/5 flex flex-col items-center justify-center text-center py-12"
              >
                <AlertCircle className="w-12 h-12 text-white/10 mb-4" />
                <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Hover over a data point to view forensic intelligence</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Activity Mini-Log */}
          <div className="glass rounded-2xl border-white/5 overflow-hidden flex-1 flex flex-col">
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-neon-cyan" />
                <span className="font-mono text-[10px] uppercase tracking-widest">Recent Activity</span>
              </div>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto max-h-[400px]">
              {history.slice(0, 5).map((item, i) => (
                <div key={item.report_id || i} className="flex gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
                  <div className={cn(
                    "w-1 h-full rounded-full shrink-0",
                    item.verdict === 'SCAM' ? "bg-crimson" : item.verdict === 'SUSPICIOUS' ? "bg-gold" : "bg-neon-cyan"
                  )} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-sans font-bold text-xs uppercase">{item.scam_category}</span>
                      <span className="font-mono text-[8px] text-white/40">
                        {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/60 font-mono uppercase tracking-tight">{item.verdict}</p>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <p className="text-center font-mono text-[10px] text-white/20 uppercase py-8">No recent activity</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

