'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function InteractivePlayground() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleEnhance = () => {
    setIsProcessing(true);
    setShowOutput(false);
    setTimeout(() => {
      setIsProcessing(false);
      setShowOutput(true);
    }, 2000); // simulate processing
  };

  return (
    <section className="py-32 bg-card relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            See Intelligence in Action
          </h2>
          <p className="text-muted-foreground text-lg">
            A massive interactive playground to demonstrate PromptOS.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Left: Input */}
          <div className="border border-border rounded-xl bg-background p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-sm text-muted-foreground uppercase tracking-wider">
                Input Prompt
              </span>
              <div className="w-2 h-2 rounded-full bg-border" />
            </div>
            <textarea
              className="flex-1 w-full bg-transparent resize-none outline-none text-foreground text-lg leading-relaxed font-mono placeholder:text-muted-foreground/50"
              defaultValue="Write a python script to scrape a website."
              readOnly
            />
            <button
              onClick={handleEnhance}
              disabled={isProcessing}
              className="mt-4 w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Enhancing...' : 'Enhance Prompt'}
            </button>
          </div>

          {/* Middle: Pipeline Animation */}
          <div className="border border-border rounded-xl bg-background/50 p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {isProcessing && (
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'linear' }}
                className="absolute top-0 left-0 h-1 bg-primary"
              />
            )}
            <div className="space-y-8 w-full max-w-xs">
              {['Classification', 'Template Routing', 'Evaluation'].map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: isProcessing ? [0.3, 1, 0.3] : showOutput ? 1 : 0.3 }}
                  transition={{
                    delay: isProcessing ? i * 0.5 : 0,
                    duration: 1,
                    repeat: isProcessing ? Infinity : 0,
                  }}
                  className="p-4 border border-border rounded-lg bg-card text-center font-mono text-sm"
                >
                  {step}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Output */}
          <div className="border border-border rounded-xl bg-background p-6 flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-sm text-muted-foreground uppercase tracking-wider">
                Enhanced Prompt
              </span>
              {showOutput && (
                <span className="text-primary text-xs font-bold px-2 py-1 bg-primary/10 rounded">
                  Score: 9.4
                </span>
              )}
            </div>

            <div className="flex-1 w-full overflow-y-auto">
              {showOutput ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <p className="font-mono text-sm text-foreground/80 leading-relaxed bg-secondary/50 p-4 rounded-lg border border-border/50">
                    Act as an expert Python developer specialized in web scraping.
                    <br />
                    <br />
                    Write a robust Python script using `BeautifulSoup` and `requests` to scrape
                    [TARGET_URL]. Include error handling, proper user-agent headers, and respect
                    `robots.txt`.
                    <br />
                    <br />
                    Output Format: Markdown block with comments explaining the code logic.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border mt-4">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-mono mb-1 block">
                        Output Format
                      </span>
                      <span className="text-sm font-semibold">Markdown</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-mono mb-1 block">
                        Improvement
                      </span>
                      <span className="text-sm font-semibold text-green-500">+43%</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <span className="text-muted-foreground/50 font-mono text-sm">
                    Awaiting input...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
