// 'use client';

// import { motion, AnimatePresence } from 'framer-motion';
// import { useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';

// const HeroScene = dynamic(() => import('@/components/three/hero-scene'), {
//     ssr: false,
//     loading: () => <div className="absolute inset-0 bg-black" />,
// });

// const verbs = ['Execute.', 'Optimize.', 'Scale.', 'Automate.'];

// export default function HeroSection() {
//     const [index, setIndex] = useState(0);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setIndex((prev) => (prev + 1) % verbs.length);
//         }, 3000);
//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <section className="relative min-h-screen flex flex-col pt-32 pb-12 px-6 md:px-12 bg-black overflow-hidden">
//             <div className="flex-1 flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto w-full">
//                 {/* Left Side: Typography */}
//                 <div className="flex-1 z-10">
//                     <motion.h1
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
//                         className="text-hero text-white mb-8"
//                     >
//                         Intelligence. <br />
//                         <AnimatePresence mode="wait">
//                             <motion.span
//                                 key={index}
//                                 initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
//                                 animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
//                                 exit={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
//                                 transition={{ duration: 0.6 }}
//                                 className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500"
//                             >
//                                 {verbs[index]}
//                             </motion.span>
//                         </AnimatePresence>
//                     </motion.h1>

//                     <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.4, duration: 1 }}
//                         className="text-xl md:text-2xl text-white/50 font-light leading-tight max-w-xl mb-12 tracking-tight"
//                     >
//                         The autonomous operating system for prompt engineering.
//                         Bridge the gap between raw LLM capabilities and production-grade reliability.
//                     </motion.p>

//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.6 }}
//                         className="flex items-center gap-6"
//                     >
//                         <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all text-sm uppercase tracking-widest">
//                             Deploy Agent
//                         </button>
//                         <button className="px-8 py-4 bg-transparent text-white border border-white/20 font-bold rounded-full hover:bg-white/5 transition-all text-sm uppercase tracking-widest">
//                             View Docs
//                         </button>
//                     </motion.div>
//                 </div>

//                 {/* Right Side: Visual */}
//                 <div className="flex-1 relative w-full h-[50vh] md:h-full min-h-[400px]">
//                     <div className="absolute inset-0 z-0">
//                         <HeroScene />
//                     </div>
//                 </div>
//             </div>

//             {/* Bottom Stats Row */}
//             <div className="mt-auto border-t border-white/10 pt-12">
//                 <div className="max-w-7xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-8">
//                     {[
//                         { label: 'Prompts Enhanced', value: '1.2M+' },
//                         { label: 'Tokens Saved', value: '450M' },
//                         { label: 'Active Agents', value: '3,500+' },
//                         { label: 'System Uptime', value: '99.99%' },
//                     ].map((stat, i) => (
//                         <motion.div
//                             key={i}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: 0.8 + i * 0.1 }}
//                         >
//                             <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">{stat.label}</div>
//                             <div className="text-2xl font-bold text-white font-mono tracking-tighter">{stat.value}</div>
//                         </motion.div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }
'use client';

import { useEffect, useState, useRef } from 'react';

const words = ['analyze', 'optimize', 'deploy', 'scale'];

function BlurWord({ word, trigger }: { word: string; trigger: number }) {
  const letters = word.split('');
  const STAGGER = 45; // ms between each letter
  const DURATION = 500; // blur+opacity fade duration per letter
  const GRADIENT_HOLD = STAGGER * letters.length + DURATION + 200;

  const [letterStates, setLetterStates] = useState<{ opacity: number; blur: number }[]>(
    letters.map(() => ({ opacity: 0, blur: 20 }))
  );
  const [showGradient, setShowGradient] = useState(true);
  const framesRef = useRef<number[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // reset
    framesRef.current.forEach(cancelAnimationFrame);
    timersRef.current.forEach(clearTimeout);
    framesRef.current = [];
    timersRef.current = [];

    setLetterStates(letters.map(() => ({ opacity: 0, blur: 20 })));
    setShowGradient(true);

    // stagger each letter
    letters.forEach((_, i) => {
      const t = setTimeout(() => {
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setLetterStates((prev) => {
            const next = [...prev];
            next[i] = { opacity: eased, blur: 20 * (1 - eased) };
            return next;
          });
          if (progress < 1) {
            const id = requestAnimationFrame(tick);
            framesRef.current.push(id);
          }
        };
        const id = requestAnimationFrame(tick);
        framesRef.current.push(id);
      }, i * STAGGER);
      timersRef.current.push(t);
    });

    // remove gradient once all letters are settled
    const gt = setTimeout(() => setShowGradient(false), GRADIENT_HOLD);
    timersRef.current.push(gt);

    return () => {
      framesRef.current.forEach(cancelAnimationFrame);
      timersRef.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // gradient colours cycling across letter positions
  const gradientColors = ['#eca8d6', '#a78bfa', '#67e8f9', '#fbbf24', '#eca8d6'];

  return (
    <>
      {letters.map((char, i) => {
        const colorIndex = (i / Math.max(letters.length - 1, 1)) * (gradientColors.length - 1);
        const lower = Math.floor(colorIndex);
        const upper = Math.min(lower + 1, gradientColors.length - 1);
        const t = colorIndex - lower;

        // lerp hex colours
        const hex2rgb = (hex: string) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return [r, g, b];
        };
        const [r1, g1, b1] = hex2rgb(gradientColors[lower]);
        const [r2, g2, b2] = hex2rgb(gradientColors[upper]);
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: letterStates[i]?.opacity ?? 0,
              filter: `blur(${letterStates[i]?.blur ?? 20}px)`,
              color: showGradient ? `rgb(${r},${g},${b})` : 'white',
              transition: 'color 0.4s ease',
            }}
          >
            {char}
          </span>
        );
      })}
    </>
  );
}

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-start overflow-hidden bg-black">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="w-full h-full object-cover object-center opacity-80"
        >
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4"
            type="video/mp4"
          />
        </video>
        {/* Subtle overlay to ensure text readability on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      </div>

      {/* Subtle grid lines */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none opacity-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-white/10"
            style={{
              top: `${12.5 * (i + 1)}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-white/10"
            style={{
              left: `${8.33 * (i + 1)}%`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-32 lg:py-40">
        <div className="lg:max-w-[55%]">
          {/* Eyebrow */}
          <div
            className={`mb-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-white/60">
              <span className="w-8 h-px bg-white/30" />
              The Intelligent Prompt Operating System
            </span>
          </div>

          {/* Main headline */}
          <div className="mb-12">
            <h1
              className={`text-left text-[clamp(2rem,6vw,7rem)] font-display leading-[0.92] tracking-tight text-white transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <span className="block whitespace-nowrap">PromptOS</span>
              <span className="block whitespace-nowrap">
                prompts that{' '}
                <span className="relative inline-block">
                  <BlurWord word={words[wordIndex]} trigger={wordIndex} />
                </span>
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Stats — 3 metrics static, no auto-scroll */}
      <div
        className={`absolute bottom-12 left-0 right-0 px-6 lg:px-12 transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex items-start gap-10 lg:gap-20">
          {[
            { value: 'Enhance', label: 'autonomous agents active' },
            { value: 'Compare', label: 'distributed uptime' },
            { value: 'Evaluate', label: 'execution latency' },
            { value: 'Manage', label: 'execution latency' },
          ].map((stat) => (
            <div key={stat.value} className="flex flex-col gap-2">
              <span className="text-3xl lg:text-4xl font-display text-white">{stat.value}</span>
              {/* <span className="text-xs text-white/50 leading-tight">
                {stat.label}
              </span> */}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
    </section>
  );
}
