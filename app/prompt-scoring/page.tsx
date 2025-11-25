"use client";

import ScoreCard from '@/components/ScoreCard';
import ScoringCriteria from '@/components/ScoringCriteria';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {supabaseAdmin} from '@/lib/supabase';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

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
    <main className='container mx-auto px-4 py-12 max-w-4xl'>
      <h1 className="text-4xl font-bold text-center mb-8">Prompt Score</h1>
      <p className="text-center text-muted-foreground mb-8">
        Enter your prompt below to receive a quality score and feedback
      </p>

      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Prompt</CardTitle>
            </CardHeader>
            <form onSubmit={handleScore}>
              <CardContent>
                <Textarea
                  placeholder='Write your prompt here...'
                  className='min-h-[200px] resize-none'
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </CardContent>

              <CardFooter className='flex justify-end mt-4'>
                <Button type="submit" className='cursor-pointer'>
                  {isLoading ? "Scoring..." : "Score Prompt"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {score && <ScoreCard score={score} />}
        </div>
        <div>
          <ScoringCriteria />
        </div>
      </div>
    </main>
  );
};

export default Page;
