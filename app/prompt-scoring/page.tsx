'use client';

import ScoreCard from '@/components/ScoreCard';
import ScoringCriteria from '@/components/ScoringCriteria';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabaseAdmin } from '@/lib/supabase';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Cpu } from 'lucide-react';

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

      const { data: userData, error } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (error || !userData) {
        console.error('Failed to fetch user ID from Supabase: ', error);
        return;
      }

      const res = await fetch('/api/save-prompt-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.id,
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
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden">
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
              Intelligence Evaluator
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-[100px] font-display tracking-tight leading-[0.9] text-foreground mb-8">
            Prompt Scoring
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl font-display font-light leading-relaxed">
            Execute deep-layer analysis on your prompt architecture. Our system evaluates clarity,
            density, and model compatibility using advanced scoring matrices.
          </p>
        </motion.div>

        <div className="grid gap-16 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8 space-y-12">
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
                      Buffer Input
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                      Ready
                    </span>
                  </div>
                </div>

                <form onSubmit={handleScore} className="space-y-8">
                  <Textarea
                    placeholder="Insert prompt instruction set..."
                    className="min-h-[300px] resize-none bg-transparent border-none focus:ring-0 text-xl font-display font-light text-foreground p-0 placeholder:text-muted-foreground/30"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />

                  <div className="flex items-center justify-between pt-8 border-t border-foreground/5">
                    <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                      <span>Tokens: {prompt.split(' ').filter((x) => x).length}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                      <span>Charset: {prompt.length}</span>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading || !prompt.trim()}
                      className="rounded-full bg-white text-black hover:bg-white/90 px-12 py-6 font-mono text-[10px] uppercase tracking-widest transition-all duration-500"
                    >
                      {isLoading ? 'Analyzing Architecture...' : 'Execute Evaluation'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[400px] flex flex-col items-center justify-center space-y-12 bg-black border border-foreground/5 rounded-2xl relative overflow-hidden"
                >
                  {/* Scanning Animation */}
                  <motion.div
                    animate={{
                      top: ['0%', '100%', '0%'],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute left-0 right-0 h-[2px] bg-white/20 z-10 blur-[2px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center animate-ping" />
                    </div>
                    <Activity className="absolute inset-0 m-auto w-8 h-8 text-white animate-pulse" />
                  </div>

                  <div className="text-center space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white">
                      System Analyzing
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      Deconstructing linguistic patterns...
                    </p>
                  </div>
                </motion.div>
              ) : score ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ScoreCard score={score} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-40 space-y-8">
              <ScoringCriteria />

              <div className="p-8 rounded-2xl bg-white/[0.02] border border-foreground/5 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Standardized Logic
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All evaluations are performed against a 1-10 normalized scale using proprietary
                  linguistic models.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
