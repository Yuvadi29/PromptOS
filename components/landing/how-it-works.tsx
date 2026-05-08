'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    number: '01',
    title: 'Draft & Enhance',
    subtitle: 'your idea',
    description:
      'Input your raw idea. Our context engine analyzes intent and AI rewrites your prompt for maximum clarity.',
    code: `const researcher = new Agent({
  role: 'Research Analyst',
  capabilities: ['web', 'docs', 'api'],
  memory: true,
  autonomy: 'full'
})`,
  },
  {
    number: '02',
    title: 'Test',
    subtitle: 'the prompt',
    description: 'Run against multiple models with real-time scoring.',
    code: `await researcher.execute({
  task: 'Analyze competitor pricing',
  sources: ['public-data', 'news'],
  output: 'structured-report',
  deadline: '2h'
})`,
  },
  {
    number: '03',
    title: 'Deploy',
    subtitle: '',
    description: 'Push to production usage with version control.',
    code: `optimus.dashboard({
  agents: [researcher],
  metrics: ['tasks', 'latency', 'cost'],
  alerts: true
})`,
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-[oklch(0.09_0.01_260)] text-white overflow-hidden"
    >
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header — titre + image cerisier */}
        <div className="relative mb-0 lg:mb-0 grid lg:grid-cols-2 gap-4 lg:gap-12 items-end">
          {/* Titre colonne gauche */}
          <div className="overflow-hidden pb-0 lg:pb-32">
            <div
              className={`transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}
            >
              <span className="inline-flex items-center gap-3 text-sm font-mono text-white/40 mb-8">
                <span className="w-12 h-px bg-white/20" />
                Process
              </span>
            </div>

            <h2
              className={`text-6xl md:text-7xl lg:text-[128px] font-display tracking-tight leading-[0.85] transition-all duration-1000 delay-100 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
              }`}
            >
              <span className="block">Draft.</span>
              <span className="block text-white/30">Enhance.</span>
              <span className="block text-white/10">Deploy.</span>
            </h2>
          </div>

          {/* Image cerisier — se colle en bas sur les blocs */}
          <div
            className={`relative h-[320px] lg:h-[640px] overflow-hidden transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src="/images/tree.png"
              alt=""
              aria-hidden="true"
              className="absolute bottom-0 left-0 w-full h-full object-contain object-bottom"
              width={1000}
              height={1000}
            />
            {/* Fade sur le bord gauche */}
            <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.09_0.01_260)] via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Horizontal Steps Layout */}
        <div className="grid lg:grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <button
              key={step.number}
              type="button"
              onClick={() => setActiveStep(index)}
              className={`relative text-left p-8 lg:p-12 border transition-all duration-500 ${
                activeStep === index
                  ? 'bg-[#000000] border-white/60'
                  : 'bg-[#000000] border-white/25 hover:border-white/50'
              }`}
            >
              {/* Step number with animated line */}
              <div className="flex items-center gap-4 mb-8">
                <span
                  className={`text-4xl font-display transition-colors duration-300 ${
                    activeStep === index ? 'text-[#eca8d6]' : 'text-white/20'
                  }`}
                >
                  {step.number}
                </span>
                <div className="flex-1 h-px bg-white/10 overflow-hidden">
                  {activeStep === index && (
                    <div className="h-full bg-[#eca8d6]/50 animate-progress" />
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl lg:text-4xl font-display mb-2">{step.title}</h3>
              <span className="text-xl text-white/40 font-display block mb-6">{step.subtitle}</span>

              {/* Description */}
              <p
                className={`text-white/60 leading-relaxed transition-opacity duration-300 ${
                  activeStep === index ? 'opacity-100' : 'opacity-60'
                }`}
              >
                {step.description}
              </p>

              {/* Active indicator */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-[#eca8d6] transition-transform duration-500 origin-left ${
                  activeStep === index ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Code Preview - Large terminal */}
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 6s linear forwards;
        }
      `}</style>
    </section>
  );
}
