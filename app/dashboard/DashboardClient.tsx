'use client';

import { TrendingUp, Flame, ArrowRight, Activity, Zap, Sparkles } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { StatCard } from '@/components/dashboard/stat-card';
import { PromptCard } from '@/components/dashboard/prompt-card';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ScoreBar } from '@/components/dashboard/score-bar';

interface DashboardClientProps {
  promptCount: number;
  prompts: any[];
  promptScores: any[];
  promptDelta: number;
  streakCount: number;
}

export function DashboardClient({
  promptCount,
  prompts,
  promptScores,
  promptDelta,
  streakCount,
}: DashboardClientProps) {
  const user = useUser();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sortedPrompts = prompts
    ? [...prompts].sort(
        (a, b) => new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime()
      )
    : [];
  const latestScore = promptScores.length > 0 ? promptScores[0] : null;

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

      <main className="relative z-10 flex-1 p-6 md:p-12 lg:p-16">
        <div className="max-w-[1400px] mx-auto space-y-20">
          {/* ── HEADER ── */}
          <div className="space-y-6">
            <div
              className={`flex items-center gap-3 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <span className="w-12 h-px bg-foreground/30" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
                Command Center
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-7xl lg:text-[100px] font-display tracking-tight leading-[0.9] text-foreground"
            >
              Welcome Back, <br />
              <span className="text-muted-foreground">
                {user?.name?.split(' ')[0] || 'Operator'}
              </span>
            </motion.h1>
          </div>

          {/* ── STATS GRID ── */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Daily Streak"
              value={streakCount}
              icon={Flame}
              description="Consecutive days active"
              trend={{ value: 1, label: 'today' }}
            />
            <StatCard
              title="Prompt Volume"
              value={promptCount}
              icon={Activity}
              description="Total prompts in library"
              trend={{ value: promptDelta, label: 'vs last week' }}
            />
            <StatCard
              title="Evaluations"
              value={promptScores.length}
              icon={Zap}
              description="Scores generated"
            />
            <StatCard
              title="Efficiency"
              value="8.4"
              icon={TrendingUp}
              description="Average quality score"
            />
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* ── LEFT COLUMN: RECENT ACTIVITY ── */}
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display tracking-tight">Recent Intelligence</h2>
                <Link href="/dashboard/all-prompts">
                  <Button
                    variant="link"
                    className="text-muted-foreground hover:text-foreground p-0 h-auto group"
                  >
                    View Library{' '}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              <div className="grid gap-4">
                {sortedPrompts?.slice(0, 4).map((prompt, index) => (
                  <PromptCard
                    key={prompt?.id}
                    id={prompt?.id}
                    title={`Prompt #${promptCount - index}`}
                    content={prompt?.prompt_value}
                    createdAt={prompt?.created_at}
                  />
                ))}
                {sortedPrompts.length === 0 && (
                  <div className="h-40 flex items-center justify-center border border-foreground/5 rounded-2xl bg-white/[0.01]">
                    <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest">
                      No activity detected
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT COLUMN: LATEST ANALYTICS ── */}
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-2xl font-display tracking-tight">Latest Evaluation</h2>

              {latestScore ? (
                <div className="p-8 rounded-2xl bg-black border border-foreground/10 space-y-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles className="w-24 h-24" />
                  </div>

                  <div className="space-y-4 relative z-10">
                    <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-foreground/20 pl-4 py-1">
                      &quot;{latestScore?.prompt?.slice(0, 150)}...&quot;
                    </p>
                    <div className="grid gap-6 pt-4">
                      {[
                        'clarity',
                        'conciseness',
                        'relevance',
                        'specificity',
                        'structure',
                        'model_fit',
                      ].map((metric) => (
                        <ScoreBar key={metric} label={metric} score={latestScore[metric] || 0} />
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-xl h-12 font-display text-lg tracking-tight">
                    View Full Report
                  </Button>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center border border-foreground/5 rounded-2xl bg-white/[0.01] p-8 text-center space-y-4">
                  <Activity className="w-8 h-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest leading-relaxed">
                    Ready for evaluation. <br />
                    Deploy a prompt to begin.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
