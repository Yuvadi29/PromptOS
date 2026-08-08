'use client';

import ScoreCard from '@/components/ScoreCard';
import ScoringCriteria from '@/components/ScoringCriteria';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Percent } from 'lucide-react';

const Page = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  type Score = {
    overallScore: number;
    criteriaScores: {
      clarity: number;
      specificity: number;
      model_fit: number;
      relevance: number;
      structure: number;
      conciseness: number;
    };
    feedback: string;
  };

  const [score, setScore] = useState<Score | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!session?.user?.email || !prompt || !score) return;

      const res = await fetch('/api/save-prompt-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          clarity: score?.criteriaScores?.clarity,
          specificity: score?.criteriaScores?.specificity,
          model_fit: score?.criteriaScores?.model_fit,
          relevance: score?.criteriaScores?.relevance,
          structure: score?.criteriaScores?.structure,
          conciseness: score?.criteriaScores?.conciseness,
        }),
      });

      if (res.ok) {
        toast.success('Prompt Saved!!');
      } else {
        toast.warning('Failed to Save Prompt');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [prompt, score, session?.user?.email]);

  const handleScore = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt?.trim()) {
      toast.warning('Empty Prompt. Please enter a prompt to score');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/score-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (res.ok) {
        const data = await res.json();

        setScore({
          overallScore: data.overallScore ?? 0,
          criteriaScores: data.criteriaScores,
          feedback: data.feedback,
        });
      } else {
        toast.error('Scoring failed.');
      }
    } catch (err) {
      console.error('Error scoring prompt: ', err);
      toast.error('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col pt-24 pb-12">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10 flex-1">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 shadow-xl backdrop-blur-md">
            <Percent className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-purple-300">
              Real-time Scoring
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
            <span className="text-white">Prompt&nbsp;</span>
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Analysis
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Get instant, detailed feedback on your prompts. Our AI analyzes clarity, specificity,
            and structure to help you craft the perfect instruction.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Input Area */}
          <div className="lg:col-span-8 flex flex-col gap-8 h-full">
            <div className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-[32px] p-2 shadow-2xl relative overflow-hidden flex flex-col transition-all">
              {/* Inner Header */}
              <div className="p-6 border-b border-white/10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 shadow-inner">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Input Prompt</h2>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    Enter your text below to generate a detailed qualitative score
                  </p>
                </div>
              </div>

              {/* Text Area Form */}
              <form onSubmit={handleScore} className="flex flex-col flex-1 p-2">
                <div className="p-4 flex-1">
                  <Textarea
                    placeholder="E.g. Write a marketing email for our new shoe launch..."
                    className="min-h-[200px] h-full resize-none bg-black/30 border-white/5 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-base text-zinc-200 rounded-2xl p-6 font-mono shadow-inner placeholder:text-muted-foreground/40 transition-all"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex justify-end p-4 pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-6 rounded-xl text-base shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all disabled:opacity-50 font-bold tracking-wide"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                        Analyzing Constraints...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Score
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Animated Score Card Appearance */}
            {score && !isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <ScoreCard score={score} />
              </motion.div>
            )}

            {isLoading && (
              <div className="flex-1 min-h-[300px] border border-white/5 bg-white/5 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin" />
                  <Sparkles className="w-6 h-6 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <p className="mt-6 text-muted-foreground font-mono text-sm uppercase tracking-widest animate-pulse">
                  Running Diagnostics...
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Scoring Criteria Legend */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24">
              <ScoringCriteria />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
