'use client';

import { useEffect, useState, useRef } from 'react';
import { getRealtimeInfrastructureMetrics } from '@/lib/realtime-infrastructure';
import Image from 'next/image';

const regions = [
  { name: 'North America', nodes: 12, status: 'operational' },
  { name: 'Europe', nodes: 8, status: 'operational' },
  { name: 'Asia Pacific', nodes: 6, status: 'operational' },
  { name: 'South America', nodes: 3, status: 'operational' },
];

export default function InfraStructure() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeRegion, setActiveRegion] = useState(0);
  const [realtime, setRealtime] = useState<any>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await getRealtimeInfrastructureMetrics();
      setRealtime(data);
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Update every 5s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRegion((prev) => (prev + 1) % regions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="infra" ref={sectionRef} className="relative py-32 lg:py-40 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20">
          <span
            className={`inline-flex items-center gap-4 text-sm font-mono text-muted-foreground mb-8 transition-all duration-700 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="w-12 h-px bg-foreground/20" />
            Global infrastructure
          </span>

          <div className="grid lg:grid-cols-[auto_1fr] gap-8 lg:gap-16 items-stretch">
            {/* Image globe — colonne gauche, pleine hauteur */}
            <div
              className={`w-48 lg:w-72 xl:w-80 shrink-0 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <Image
                src="/images/infra.png"
                alt="Global network sphere"
                className="w-full h-full object-contain object-center"
                width={1000}
                height={1000}
              />
            </div>

            <div className="flex flex-col justify-center">
              <h2
                className={`text-6xl md:text-7xl lg:text-[128px] font-display tracking-tight leading-[0.9] transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Global by
                <br />
                <span className="text-muted-foreground">default.</span>
              </h2>

              <p
                className={`mt-8 text-xl text-muted-foreground leading-relaxed max-w-lg transition-all duration-1000 delay-100 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Your prompt evaluations run on distributed infrastructure across{' '}
                {realtime?.activeNodes || 29} regions. Sub-50ms scoring latency to 99% of the world.
              </p>
            </div>
          </div>
        </div>

        {/* Realtime Pulse Row */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          {[
            { label: 'Total Tokens Saved', value: realtime?.totalTokensSaved || '450,284,102' },
            { label: 'Total USD Saved', value: `$${realtime?.totalCostSaved || '189,402.21'}` },
            { label: 'Gemini Latency', value: `${realtime?.latencies?.gemini || '342'}ms` },
            { label: 'Claude Latency', value: `${realtime?.latencies?.claude || '645'}ms` },
          ].map((stat, i) => (
            <div key={i} className="p-6 border border-foreground/5 bg-foreground/[0.01]">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#eca8d6] animate-pulse" />
                {stat.label}
              </div>
              <div className="text-2xl font-display text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Large stat card */}
          <div
            className={`lg:col-span-2 relative p-8 lg:p-12 border border-foreground/10 bg-foreground/[0.02] overflow-hidden transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Animated dots background with connecting lines */}
            <div className="absolute inset-0 opacity-70">
              {/* SVG for connecting lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                <defs>
                  <style>{`
                    @keyframes drawLine {
                      0%   { stroke-dashoffset: 1000; opacity: 0; }
                      15%  { opacity: 1; }
                      70%  { opacity: 0.7; }
                      100% { stroke-dashoffset: 0; opacity: 0; }
                    }
                    .connecting-line {
                      stroke: #eca8d6;
                      stroke-width: 1.2;
                      fill: none;
                      stroke-dasharray: 1000;
                      animation: drawLine 3s ease-in-out infinite;
                    }
                  `}</style>
                </defs>
                {[...Array(19)].map((_, i) => {
                  const x1 = 10 + (i % 5) * 20;
                  const y1 = 10 + Math.floor(i / 5) * 25;
                  const x2 = 10 + ((i + 1) % 5) * 20;
                  const y2 = 10 + Math.floor((i + 1) / 5) * 25;
                  return (
                    <line
                      key={`line-${i}`}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      className="connecting-line"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  );
                })}
              </svg>

              {/* Dots */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#eca8d6]"
                  style={{
                    left: `${10 + (i % 5) * 20}%`,
                    top: `${10 + Math.floor(i / 5) * 25}%`,
                    animation: `pulse 2s ease-in-out ${i * 0.1}s infinite`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-8xl lg:text-[10rem] font-display leading-none">
                  {realtime?.activeNodes || 29}
                </span>
                <span className="text-2xl text-muted-foreground">regions</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                Scoring nodes distributed globally for maximum redundancy and minimum latency.
              </p>
            </div>
          </div>

          {/* Stacked stat cards */}
          <div className="flex flex-col gap-6">
            <div
              className={`p-8 border border-[#eca8d6]/20 bg-[#eca8d6]/[0.02] transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <span className="text-5xl lg:text-6xl font-display text-[#eca8d6]">65%</span>
              <span className="block text-sm text-muted-foreground mt-2">Token Compression</span>
              <p className="text-[10px] font-mono text-muted-foreground/50 mt-4 leading-tight uppercase tracking-widest">
                Optimizing payloads via autonomous context pruning.
              </p>
            </div>

            <div
              className={`p-8 border border-foreground/10 bg-foreground/[0.02] transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <span className="text-5xl lg:text-6xl font-display">$0.42</span>
              <span className="block text-sm text-muted-foreground mt-2">Saved per 1M tokens</span>
              <p className="text-[10px] font-mono text-muted-foreground/50 mt-4 leading-tight uppercase tracking-widest">
                Real-time cost arbitrage across distributed models.
              </p>
            </div>
          </div>
        </div>

        {/* Region list */}
        <div
          className={`mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {regions.map((region, index) => (
            <div
              key={region.name}
              className={`p-6 border transition-all duration-300 cursor-default ${
                activeRegion === index
                  ? 'border-foreground/30 bg-foreground/[0.04]'
                  : 'border-foreground/10'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`w-2 h-2 rounded-full transition-colors ${
                    activeRegion === index ? 'bg-[#eca8d6] animate-pulse' : 'bg-foreground/20'
                  }`}
                />
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  {region.status}
                </span>
              </div>
              <span className="font-medium block mb-1">{region.name}</span>
              <span className="text-sm text-muted-foreground">{region.nodes} nodes</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
