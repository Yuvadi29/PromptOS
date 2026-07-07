'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Send, Scale } from 'lucide-react';
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
  const [modelLoading, setModelLoading] = useState({ model1: false, model2: false, model3: false });
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
      setModelLoading((prev) => ({ ...prev, [modelKey]: true }));
      try {
        const res = await fetch('/api/compare-llm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, model: modelId, isFirstModel }),
        });

        if (!res.ok) throw new Error('API returned an error');
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
          [modelKey]:
            '[Error: Failed to fetch response. The model might be unavailable or rate-limited.]',
        }));
      } finally {
        setModelLoading((prev) => ({ ...prev, [modelKey]: false }));
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

  const handleRetry = async (index: number) => {
    const modelKeys: ('model1' | 'model2' | 'model3')[] = ['model1', 'model2', 'model3'];
    const modelKey = modelKeys[index];
    const modelId = selectedModels[index];

    setResults((prev) => ({ ...prev, [modelKey]: null }));

    // We recreate fetchModelStream here or pull it out.
    // For simplicity, we just inline the fetch again
    if (!modelId || !prompt.trim()) return;

    setModelLoading((prev) => ({ ...prev, [modelKey]: true }));
    try {
      const res = await fetch('/api/compare-llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: modelId, isFirstModel: index === 0 }),
      });

      if (!res.ok) throw new Error('API returned an error');
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
        [modelKey]:
          '[Error: Failed to fetch response. The model might be unavailable or rate-limited.]',
      }));
    } finally {
      setModelLoading((prev) => ({ ...prev, [modelKey]: false }));
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background pt-24 px-6 pb-6 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Scale className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">Intelligence Arena</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Compare AI Models
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Test your prompt across multiple models simultaneously to find the best response.
          </p>
        </motion.div>

        {/* Workspace */}
        <div className="flex flex-col flex-1 min-h-0 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
          {/* Top Control Bar */}
          <div className="p-4 border-b border-border bg-secondary/30 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full flex gap-4">
              {['Model 1', 'Model 2', 'Model 3'].map((label, i) => (
                <div key={label} className="flex-1">
                  <Select
                    value={selectedModels[i]}
                    onValueChange={(val) => handleModelChange(i, val)}
                  >
                    <SelectTrigger className="w-full bg-background border-border text-xs focus:ring-primary h-9">
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
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
                            className="text-xs focus:bg-primary/20 focus:text-foreground"
                          >
                            {model.id}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="p-4 border-b border-border bg-background">
            <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
              <div className="relative flex-1 group">
                <Textarea
                  placeholder="Enter your prompt here to see how different models respond..."
                  className="min-h-[80px] w-full resize-none bg-secondary/20 border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-4 pr-14 text-sm font-mono placeholder:text-muted-foreground/50 transition-all"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-2 bottom-2 h-8 w-8 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_10px_rgba(249,115,22,0.3)] transition-all disabled:opacity-50 disabled:shadow-none"
                  disabled={
                    isLoading ||
                    !prompt.trim() ||
                    selectedModels.filter((m) => m !== '').length === 0
                  }
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Results Area */}
          <div id="comparison-output" className="flex-1 overflow-y-auto p-4 bg-background/50">
            <ComparisonResults
              results={results}
              isLoading={isLoading}
              modelLoading={modelLoading}
              selectedModels={selectedModels}
              onRetry={handleRetry}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
