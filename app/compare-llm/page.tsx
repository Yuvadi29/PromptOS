'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Cpu, ArrowRight, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ComparisonResults } from '@/components/comparison-results';
import { getModelList } from '@/lib/getModelList';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';

export default function LLMComparison() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    model1: string | null;
    model2: string | null;
    model3: string | null;
  }>({
    model1: null,
    model2: null,
    model3: null,
  });
  const [selectedModels, setSelectedModels] = useState<string[]>(['', '', '']);
  const [modelList, setModelList] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    async function fetchModels() {
      const data = await getModelList();
      setModelList(data?.data || []);
    }
    fetchModels();
  }, []);

  useEffect(() => {
    const el = document.getElementById('comparison-output');
    if (el) el.scrollTop = el.scrollHeight;
  }, [results]);

  const handleModelChange = (index: number, value: string) => {
    const updated = [...selectedModels];
    updated[index] = value;
    setSelectedModels(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResults({ model1: null, model2: null, model3: null });

    const fetchModelStream = async (
      modelId: string,
      modelKey: 'model1' | 'model2' | 'model3',
      isFirstModel: boolean
    ) => {
      if (!modelId) return;
      try {
        const res = await fetch('/api/compare-llm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, model: modelId, isFirstModel }),
        });

        if (!res.body) throw new Error('No response stream');

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;

          setResults((prev) => ({ ...prev, [modelKey]: accumulatedText }));
        }
      } catch (err) {
        console.error(`Streaming API failed for ${modelKey}:`, err);
        setResults((prev) => ({
          ...prev,
          [modelKey]: (prev[modelKey] || '') + '\n\n[Error: Failed to fetch response]',
        }));
      }
    };

    try {
      await Promise.allSettled([
        fetchModelStream(selectedModels[0], 'model1', true),
        fetchModelStream(selectedModels[1], 'model2', false),
        fetchModelStream(selectedModels[2], 'model3', false),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden noise-overlay">
      {/* Background elements */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-20 transition-opacity duration-1000"
        >
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black" />
      </div>

      {/* Subtle grid lines */}
      <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none opacity-[0.03]">
        {[...Array(12)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-white"
            style={{ top: `${(100 / 12) * (i + 1)}%`, left: 0, right: 0 }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-white"
            style={{ left: `${(100 / 12) * (i + 1)}%`, top: 0, bottom: 0 }}
          />
        ))}
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start text-left mb-24"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
              Multi-Model Analysis
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-[100px] font-display tracking-tight leading-[0.9] text-foreground mb-8">
            Output Comparison
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl font-display font-light leading-relaxed">
            Parallelize your evaluations. benchmark architectural variations across the spectrum of
            Large Language Models in real-time.
          </p>
        </motion.div>

        <div className="space-y-16">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="group relative"
          >
            <div className="absolute -inset-[1px] bg-gradient-to-r from-white/10 to-transparent rounded-2xl" />
            <div className="relative bg-black border border-foreground/10 rounded-2xl overflow-hidden p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Cpu className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Prompt Matrix
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {['Model 1', 'Model 2', 'Model 3'].map((label, i) => (
                    <Select
                      key={label}
                      value={selectedModels[i]}
                      onValueChange={(val) => handleModelChange(i, val)}
                    >
                      <SelectTrigger className="w-[180px] bg-transparent border-foreground/10 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-white transition-colors h-8">
                        <SelectValue placeholder={label} />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-foreground/10">
                        {modelList
                          .filter(
                            (m) =>
                              m.id.includes('free') &&
                              (!selectedModels.includes(m.id) || selectedModels[i] === m.id)
                          )
                          .map((model) => (
                            <SelectItem
                              key={model.id}
                              value={model.id}
                              className="text-white font-mono text-[10px] uppercase tracking-widest"
                            >
                              {model.id}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <Textarea
                  placeholder="Insert prompt parameters here..."
                  className="min-h-[200px] resize-none bg-transparent border-none focus:ring-0 text-xl font-display font-light text-foreground p-0 placeholder:text-muted-foreground/30"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />

                <div className="flex items-center justify-between pt-8 border-t border-foreground/5">
                  <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    <Layers className="w-3 h-3" />
                    <span>Concurrent Streams: {selectedModels.filter((m) => m).length}</span>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || !prompt.trim() || !selectedModels.some((m) => m)}
                    className="rounded-full bg-white text-black hover:bg-white/90 px-12 py-6 font-mono text-[10px] uppercase tracking-widest transition-all duration-500 flex items-center gap-4"
                  >
                    <span>{isLoading ? 'Executing Streams...' : 'Execute Comparison'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Results Area */}
          <div id="comparison-output" className="min-h-[400px]">
            <ComparisonResults
              results={results}
              isLoading={isLoading}
              selectedModels={selectedModels}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
