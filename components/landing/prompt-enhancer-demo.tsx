'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { AuthButton } from '../AuthButton';

export default function PromptEnhancerDemo() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{
    enhancedPrompt: string;
    metrics: any;
    platformAnalysis?: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUsed, setHasUsed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const used = localStorage.getItem('prompt_demo_used') === 'true';
    setHasUsed(used);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleEnhance = async () => {
    if (!input.trim() || isLoading || hasUsed) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/enhance/public', {
        method: 'POST',
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      setResult(data);
      localStorage.setItem('prompt_demo_used', 'true');
      setHasUsed(true);
    } catch (error) {
      toast.error(`Error enhancing prompt: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-48 overflow-hidden bg-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Side: Info & Input */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span
              className={`inline-flex items-center gap-4 text-sm font-mono text-muted-foreground mb-8 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              <span className="w-12 h-px bg-foreground/20" />
              Live Demonstration
            </span>

            <h2
              className={`text-5xl md:text-6xl lg:text-7xl font-display tracking-tight leading-[0.95] mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Experience the
              <br />
              <span className="text-muted-foreground">Intelligence.</span>
            </h2>

            <p
              className={`text-xl text-muted-foreground mb-12 max-w-lg transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              Transform raw intent into production-grade prompts. One free execution. Signup for
              unlimited scale.
            </p>

            <div
              className={`relative transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={hasUsed && !result}
                placeholder="Type a simple prompt (e.g. 'write a blog post about AI')..."
                className="w-full h-48 bg-foreground/[0.03] border border-foreground/10 rounded-none p-6 text-lg focus:outline-none focus:border-[#eca8d6]/50 transition-colors resize-none placeholder:text-white/20"
              />

              <div className="absolute bottom-4 right-4">
                <button
                  onClick={handleEnhance}
                  disabled={isLoading || (hasUsed && !result) || !input.trim()}
                  className="px-8 py-3 bg-[#eca8d6] text-black font-display text-sm tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Optimizing
                    </>
                  ) : hasUsed && !result ? (
                    'Limit Reached'
                  ) : (
                    'Enhance Prompt'
                  )}
                </button>
              </div>
            </div>

            {hasUsed && !result && (
              <p className="mt-4 text-sm font-mono text-[#eca8d6]">
                Demo limit reached. <AuthButton /> for 10,000+ free tokens.
              </p>
            )}
          </div>

          {/* Right Side: Output & Metrics */}
          <div className="lg:col-span-7 relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col h-full gap-6"
                >
                  {/* Results Container */}
                  <div className="flex-1 bg-foreground/[0.02] border border-foreground/10 p-8 font-mono text-sm overflow-auto max-h-[400px] custom-scrollbar">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/5">
                      <div className="w-2 h-2 rounded-full bg-[#eca8d6]" />
                      <span className="text-muted-foreground uppercase tracking-widest text-[10px]">
                        Optimized Payload
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap text-white/80 leading-relaxed">
                      {result.enhancedPrompt}
                    </pre>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Clarity Score', value: result.metrics.clarityScore, sub: '/10.0' },
                      {
                        label: 'Tokens Saved',
                        value: result.metrics.tokensSaved,
                        sub: 'Compression',
                      },
                      {
                        label: 'Cost Offset',
                        value: result.metrics.costOptimization,
                        sub: 'Estimated ROI',
                      },
                    ].map((m, i) => (
                      <div key={i} className="bg-foreground/[0.02] border border-foreground/10 p-4">
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                          {m.label}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-display text-white">{m.value}</span>
                          <span className="text-[10px] font-mono text-white/30">{m.sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Platform Analysis Table */}
                  {result.platformAnalysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-foreground/[0.02] border border-foreground/10 p-6"
                    >
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4 font-mono">
                        Real-time Platform ROI
                      </div>
                      <div className="space-y-3">
                        {result.platformAnalysis.map((platform) => (
                          <div
                            key={platform.id}
                            className="flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-medium text-white/80 group-hover:text-[#eca8d6] transition-colors">
                                {platform.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-6 font-mono text-[10px]">
                              <div className="flex flex-col items-end">
                                <span className="text-white/40 uppercase">Optimized Cost</span>
                                <span className="text-white">{platform.optimizedCost}</span>
                              </div>
                              <div className="flex flex-col items-end min-w-[80px]">
                                <span className="text-[#eca8d6] uppercase">Savings</span>
                                <span className="text-[#eca8d6] font-bold">{platform.savings}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center border border-dashed border-foreground/10 bg-foreground/[0.01]"
                >
                  <div className="flex flex-col items-center text-center px-12">
                    <div className="w-12 h-12 border border-foreground/10 rounded-full flex items-center justify-center mb-6">
                      <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" />
                    </div>
                    <p className="text-muted-foreground font-mono text-sm tracking-wide">
                      Awaiting input stream...
                      <br />
                      Real-time optimization matrix will appear here.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Background Decorative Lines */}
            <div className="absolute -z-10 inset-0 pointer-events-none overflow-hidden opacity-30">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#eca8d6]/5 blur-[120px] rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
