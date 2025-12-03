"use client";

import ScoreCard from '@/components/ScoreCard';
import ScoringCriteria from '@/components/ScoringCriteria';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { supabaseAdmin } from '@/lib/supabase';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';

const Page = () => {
  const [prompt, setPrompt] = useState("");
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userData.id,
          prompt: prompt,
          clarity: score?.criteriaScores?.clarity,
          specificity: score?.criteriaScores?.specificity,
          model_fit: score?.criteriaScores?.model_fit,
          relevance: score?.criteriaScores?.relevance,
          structure: score?.criteriaScores?.structure,
          conciseness: score?.criteriaScores?.conciseness
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
      toast.warning("Empty Prompt. Please enter a prompt to score");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/score-prompt', {
        method: "POST",
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
        toast.error("Scoring failed.");
      }
    } catch (err) {
      console.error("Error scoring prompt: ", err);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>

    );
  }
  return (
    <main className='container mx-auto px-4 py-12 max-w-6xl'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-medium text-orange-300">AI-Powered Analysis</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Prompt&nbsp;
          </span>
          <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            Scoring
          </span>
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Get instant, detailed feedback on your prompts. Our AI analyzes clarity, specificity, and structure to help you craft the perfect instruction.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] items-start">
        <div className="space-y-8">
          <Card className="bg-zinc-900/30 border-zinc-800/50 shadow-xl overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-zinc-200 flex items-center gap-2 text-base">
                <Zap className="w-4 h-4 text-orange-500" />
                Input Prompt
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleScore}>
              <CardContent className="pt-0 px-6 pb-6">
                <Textarea
                  placeholder='Enter your prompt here for analysis...'
                  className='min-h-[220px] resize-none bg-zinc-950/30 border-zinc-800/50 focus:ring-orange-500 focus:border-orange-500/50 text-base text-zinc-200'
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </CardContent>

              <CardFooter className='flex justify-end px-6 pb-6 pt-0'>
                <Button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className='bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-6 py-5 text-base shadow-lg shadow-orange-500/20'
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Score Prompt
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {score && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ScoreCard score={score} />
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <div className="sticky top-24">
            <ScoringCriteria />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
