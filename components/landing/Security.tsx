'use client';

import { useEffect, useState, useRef } from 'react';
import { ShoppingBag, GitBranch, Code, ShieldCheck } from 'lucide-react';

const securityFeatures = [
  {
    icon: ShoppingBag,
    title: 'Prompt Marketplace',
    description: 'Discover and share high-performance prompts. Verified by experts.',
    image: '/images/marketplace.jpg',
    details: 'One-click deployment to your workflow. Community rated and reviewed.',
    styling: 'border-orange-500/50 bg-orange-500/[0.02]',
    gradient: 'from-orange-500/20 via-orange-500/5 to-transparent',
  },
  {
    icon: GitBranch,
    title: 'Prompt Versioning',
    description: 'Track iterations, roll back changes, and maintain a source of truth.',
    image: '/images/versioning.jpg',
    details: 'Visual diffs between versions. Semantic tagging for production readiness.',
    styling: 'border-blue-500/50 bg-blue-500/[0.02]',
    gradient: 'from-blue-500/20 via-blue-500/5 to-transparent',
  },
  {
    icon: Code,
    title: 'Model Benchmarking',
    description: 'Compare GPT-4, Claude, and Llama side-by-side to find the best fit.',
    image: '/images/benchmarking.jpg',
    details: 'Real-time latency and quality scoring across multiple providers simultaneously.',
    styling: 'border-green-500/50 bg-green-500/[0.02]',
    gradient: 'from-green-500/20 via-green-500/5 to-transparent',
  },
  {
    icon: ShieldCheck,
    title: 'Context Engine',
    description: 'Automatically inject relevant metadata for more accurate results.',
    image: '/images/context.jpg',
    details: 'Our engine analyzes your intent and attaches the right context for every prompt.',
    styling: 'border-yellow-500/50 bg-yellow-500/[0.02]',
    gradient: 'from-yellow-500/20 via-yellow-500/5 to-transparent',
  },
];

export default function Security() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

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
      setActiveFeature((prev) => (prev + 1) % securityFeatures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="security" ref={sectionRef} className="relative py-32 lg:py-40 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20">
          <span
            className={`inline-flex items-center gap-4 text-sm font-mono text-muted-foreground mb-8 transition-all duration-700 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="w-12 h-px bg-foreground/20" />
            Management & Governance
          </span>

          <h2
            className={`text-6xl md:text-7xl lg:text-[128px] font-display tracking-tight leading-[0.9] mb-12 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Version
            <br />
            <span className="text-muted-foreground">Controlled.</span>
          </h2>

          <div
            className={`transition-all duration-1000 delay-100 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Version-controlled prompt library & API. Manage your prompts with the same rigor as
              your code.
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Large visual card */}
          <div
            className={`lg:col-span-7 relative p-8 lg:p-12 border border-foreground/10 min-h-[400px] overflow-hidden transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="absolute inset-0 pointer-events-none items-center justify-end hidden lg:flex">
              {securityFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`absolute inset-0 transition-opacity duration-700 flex items-center justify-center bg-gradient-to-br ${feature.gradient}`}
                  style={{ opacity: activeFeature === index ? 1 : 0 }}
                >
                  <div className="p-12 max-w-md text-center">
                    <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center rounded-full bg-foreground text-background">
                      <feature.icon className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-display mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground text-lg">{feature.details}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-10">
              <span className="font-mono text-sm text-muted-foreground">Prompt Governance</span>
              <div className="mt-8">
                <span className="text-7xl lg:text-8xl font-display">v2.4.1</span>
                <span className="block text-muted-foreground mt-2">Latest production version</span>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-2">
              {['GPT-4', 'Claude 3', 'Llama 3', 'Mistral'].map((cert, index) => (
                <span
                  key={cert}
                  className={`px-3 py-1 border border-foreground/10 text-xs font-mono text-muted-foreground transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 100 + 300}ms` }}
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Feature cards stack */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {securityFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`p-6 border transition-all duration-500 cursor-default ${
                  activeFeature === index ? feature.styling : 'border-foreground/10'
                } ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                style={{ transitionDelay: `${index * 80}ms` }}
                onClick={() => setActiveFeature(index)}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`shrink-0 w-10 h-10 flex items-center justify-center border transition-colors ${
                      activeFeature === index
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-foreground/20'
                    }`}
                  >
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
