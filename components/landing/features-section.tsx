'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { AsciiCube } from './ascii-cube';

// Animated ASCII generators
const asciiAnimations = {
  neural: (frame: number) => {
    const states = ['◉', '◎', '○', '◎'];
    const getChar = (offset: number) => states[(frame + offset) % states.length];
    return `  ┌───────┐
  │ ${getChar(0)} ${getChar(1)} ${getChar(2)} │
  │ ${getChar(3)} ${getChar(4)} ${getChar(5)} │
  │ ${getChar(6)} ${getChar(7)} ${getChar(8)} │
  └───────┘`;
  },
  workflow: (frame: number) => {
    const arrows = ['─', '═', '━', '═'];
    const pulse = ['►', '▸', '▹', '▸'];
    const a = arrows[frame % arrows.length];
    const p = pulse[frame % pulse.length];
    return `  ┌─┐   ┌─┐
  │A├${a}${a}${p}│B│
  └─┘   └┬┘
        ┌▼┐
        │C│
        └─┘`;
  },
  security: (frame: number) => {
    const lock = ['◈', '◇', '◆', '◇'];
    const bars = ['░', '▒', '▓', '▒'];
    const l = lock[frame % lock.length];
    const b = bars[frame % bars.length];
    return `   ╔═══╗
   ║ ${l} ║
  ┌╨───╨┐
  │${b}${b}${b}${b}${b}│
  └─────┘`;
  },
  analytics: (frame: number) => {
    const heights = [
      [1, 2, 3, 2],
      [2, 3, 2, 3],
      [3, 2, 3, 1],
      [2, 1, 2, 2],
    ];
    const h = heights[frame % heights.length];
    const bar = (height: number) => {
      if (height === 3) return '█';
      if (height === 2) return '▄';
      return '▁';
    };
    return `  │${h[0] === 3 ? '▄' : ' '}${h[1] === 3 ? '▄' : ' '}${h[2] === 3 ? '▄' : ' '}${h[3] === 3 ? '▄' : ' '}
  │${bar(h[0])} ${bar(h[1])} ${bar(h[2])} ${bar(h[3])}
  │█ █ █ █
  └────────`;
  },
  globe: (frame: number) => {
    const rotations = [
      `    .--.
   /    \\
  | (  ) |
   \\    /
    '--'`,
      `    .--.
   /    \\
  |  () |
   \\    /
    '--'`,
      `    .--.
   /    \\
  |  (  )|
   \\    /
    '--'`,
      `    .--.
   /    \\
  | ()  |
   \\    /
    '--'`,
    ];
    return rotations[frame % rotations.length];
  },
  api: (frame: number) => {
    const methods = ['GET', 'POST', 'PUT', 'GET'];
    const arrows = ['────────►', '═══════►', '━━━━━━━►', '────────►'];
    const m = methods[frame % methods.length];
    const a = arrows[frame % arrows.length];
    return `  ${m} /api
  ${a}
  ◄────────
  { data }`;
  },
};

const features = [
  {
    title: 'Prompt Enhancement',
    description:
      'AI-powered engine that transforms vague ideas into structured, production-grade prompts.',
    animationKey: 'neural' as const,
  },
  // {
  //   title: "Smart Workflows",
  //   description: "Chain enhancement, scoring, and comparison into automated pipelines for consistent results.",
  //   animationKey: "workflow" as const,
  // },
  {
    title: 'Quality Scoring',
    description:
      "Real-time quality metrics for clarity, specificity, and structure. Know your prompt's strength.",
    animationKey: 'security' as const,
  },
  {
    title: 'LLM Comparison',
    description:
      'Test prompts across GPT-4, Gemini, and Claude side-by-side. Pick the best response.',
    animationKey: 'analytics' as const,
  },
  {
    title: 'Prompt Library',
    description:
      'Organize, tag, and version-control all your prompts in a centralized searchable vault.',
    animationKey: 'globe' as const,
  },
  // {
  //   title: "API First",
  //   description: "RESTful APIs and SDK. Integrate PromptOS into any stack in minutes.",
  //   animationKey: "api" as const,
  // },
];

function AnimatedAscii({ animationKey }: { animationKey: keyof typeof asciiAnimations }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => f + 1);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const getAscii = useCallback(() => {
    return asciiAnimations[animationKey](frame);
  }, [animationKey, frame]);

  return (
    <pre className="font-mono text-xs text-primary leading-tight whitespace-pre">{getAscii()}</pre>
  );
}

function FeatureCard({ feature, index }: { feature: (typeof features)[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative rounded-xl p-8 card-shadow transition-all duration-700 hover:border-primary/50 bg-transparent border-0 border-none border-transparent ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Animated ASCII Icon */}
      <div className="mb-6 h-20 flex items-center">
        <AnimatedAscii animationKey={feature.animationKey} />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
    </div>
  );
}

export function FeaturesSection() {
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

  return (
    <section id="features" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header with ASCII cube */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <p className="text-sm font-mono text-primary mb-3">{'// PLATFORM'}</p>
            <h2
              className={`text-3xl lg:text-5xl font-semibold tracking-tight mb-6 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="text-balance">Everything you need</span>
              <br />
              <span className="text-balance">for perfect prompts.</span>
            </h2>
            <p
              className={`text-lg text-muted-foreground leading-relaxed max-w-lg transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              A complete toolkit for crafting, testing, and managing AI prompts. From first draft to
              production-ready in seconds, not hours.
            </p>
          </div>

          {/* ASCII Cube visualization */}
          <div className="flex justify-center lg:justify-end">
            <AsciiCube className="w-[480px] h-[640px]" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
