'use client';

import { motion } from 'framer-motion';

export default function IntelligenceEngine() {
  const nodes = [
    'Prompt',
    'Classifier',
    'Template Engine',
    'Context Memory',
    'Gemini',
    'Evaluation',
    'Personalization',
    'Learning Loop',
  ];

  return (
    <section className="py-32 bg-transparent border-y border-border/50 overflow-hidden relative">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              The Intelligence Engine
            </h2>
            <p className="text-muted-foreground text-lg">
              A complex network of models and agents working together to perfect your prompts with
              zero latency overhead.
            </p>
          </motion.div>
        </div>

        <div className="relative py-20 flex justify-center items-center">
          {/* Animated Connecting SVG Path */}
          <div className="absolute top-1/2 left-0 w-full h-24 -translate-y-1/2 pointer-events-none hidden md:block">
            <svg width="100%" height="100%" preserveAspectRatio="none">
              <motion.path
                d="M 0,48 Q 200,96 400,48 T 800,48 T 1200,48 T 1600,48 T 2000,48"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                viewport={{ once: true }}
              />
              <motion.path
                d="M 0,48 Q 200,96 400,48 T 800,48 T 1200,48 T 1600,48 T 2000,48"
                fill="none"
                stroke="#F97316"
                strokeWidth="4"
                strokeDasharray="0 100"
                strokeLinecap="round"
                animate={{
                  strokeDashoffset: [-1000, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.8))' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FB923C" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#F97316" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FB923C" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Fallback line for mobile */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border -translate-y-1/2 md:hidden" />

          <div className="flex gap-6 md:gap-12 overflow-x-auto w-full pb-12 pt-12 horizontal-scroll relative z-10 px-4 snap-x">
            {nodes.map((node, i) => (
              <motion.div
                key={node}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  type: 'spring',
                  stiffness: 100,
                }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="flex-shrink-0 relative group snap-center"
              >
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl flex items-center justify-center p-6 text-center shadow-xl group-hover:border-primary/50 group-hover:bg-card/80 transition-all duration-300 relative overflow-hidden">
                  {/* Internal Glow on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <span className="font-mono text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors relative z-10">
                    {node}
                  </span>
                </div>

                {/* Floating Node Indicator */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
