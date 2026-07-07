'use client';

import { useEffect, useState } from 'react';
import { AsciiWave } from './ascii-wave';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* ASCII Wave full width and height */}
      <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
        <AsciiWave className="w-full h-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-24">
        {/* Badge */}
        <div
          className={`flex justify-center mb-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        ></div>

        {/* Headline */}
        <div className="text-center max-w-5xl mx-auto mb-10">
          <h1
            className={`text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95] mb-8 transition-all duration-700 delay-100 lg:text-7xl ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ fontFamily: 'var(--font-geist-pixel-line), monospace' }}
          >
            <span className="text-balance">The operating system for</span>
            <br />
            <span className="text-balance">your AI</span>{' '}
            <span className="text-primary">prompts.</span>
          </h1>

          <p
            className={`text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Enhance, compare, score, and manage production-grade prompts. Designed for developers
            who ship AI-powered products.
          </p>
        </div>

        {/* Stats with company logos style */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden card-shadow transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {[
            { value: '10x', label: 'more precise prompts.', company: 'ENHANCER' },
            { value: '3', label: 'LLMs compared side-by-side.', company: 'COMPARATOR' },
            { value: '100%', label: 'open source & free.', company: 'COMMUNITY' },
            { value: '<2s', label: 'to enhance any prompt.', company: 'PERFORMANCE' },
          ].map((stat) => (
            <div
              key={stat.company}
              className="p-6 lg:p-8 flex justify-between min-h-[140px] bg-card shadow-none lg:py-8 flex-col"
            >
              <div>
                <span className="text-xl lg:text-2xl font-semibold">{stat.value}</span>
                <span className="text-muted-foreground text-sm lg:text-base"> {stat.label}</span>
              </div>
              <div className="font-mono text-xs text-muted-foreground/60 tracking-widest mt-4">
                {stat.company}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
