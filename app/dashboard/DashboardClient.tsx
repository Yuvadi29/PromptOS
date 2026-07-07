'use client';

import { useUser } from '@/context/UserContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Activity, TrendingUp, Lightbulb, GitCommit, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardClientProps {
  promptCount: number;
  prompts: any[];
  promptScores: any[];
  promptDelta: number;
  streakCount: number;
  suggestions?: { observation: string; advice: string }[];
}

export function DashboardClient({
  prompts,
  promptScores,
  promptDelta,
  suggestions = [],
}: DashboardClientProps) {
  const user = useUser();
  const firstName = user?.name?.split(' ')[0] || 'Aditya';

  // Calculate a mock Prompt Health out of 10
  const avgScore =
    promptScores.length > 0
      ? (
          promptScores.reduce((acc, curr) => acc + (curr.overall_score || 8.5), 0) /
          promptScores.length
        ).toFixed(1)
      : '9.2';

  const sortedPrompts = prompts
    ? [...prompts].sort(
        (a, b) => new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime()
      )
    : [];

  // Calculate activity for the last 7 days
  const last7DaysActivity = Array(7).fill(0);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  sortedPrompts.forEach((p) => {
    const diffTime = today.getTime() - new Date(p.created_at).getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < 7) {
      // Index 6 is today, Index 0 is 6 days ago
      last7DaysActivity[6 - diffDays]++;
    }
  });

  const maxActivity = Math.max(...last7DaysActivity, 1); // Avoid division by zero
  const activityHeights = last7DaysActivity.map((count) =>
    Math.max((count / maxActivity) * 100, 5)
  ); // min 5% height

  return (
    <div className="flex w-full min-h-screen bg-background">
      <main className="relative z-10 flex-1 p-4 md:p-8 lg:p-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* ── HEADER ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Welcome Back, {firstName}
            </h1>
            <p className="text-muted-foreground text-sm">
              Here&apos;s your prompt intelligence overview for today.
            </p>
          </motion.div>

          {/* ── PROMPT HEALTH & PROGRESS ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="p-6 rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Prompt Health
                </h2>
                <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +8%
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold tracking-tighter text-foreground">
                  {avgScore}
                </span>
                <span className="text-lg text-muted-foreground mb-1">/10</span>
              </div>
              <div className="mt-6 h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[92%]" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-medium text-muted-foreground">Weekly Progress</h2>
                  <span className="text-sm font-mono text-foreground">
                    {promptDelta > 0 ? `+${promptDelta}` : promptDelta} Prompts
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  You are highly active this week. Keep iterating.
                </p>
              </div>

              <div className="mt-4 flex gap-2 h-16 items-end">
                {/* Actual Activity Bars */}
                {activityHeights.map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-secondary rounded-t-sm relative group cursor-pointer hover:bg-primary/20 transition-colors"
                    style={{ height: '100%' }}
                  >
                    <div
                      className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all group-hover:bg-primary/80"
                      style={{ height: `${height}%` }}
                    />
                    {/* Tooltip for count */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-sm whitespace-nowrap z-50 pointer-events-none transition-opacity">
                      {last7DaysActivity[i]} {last7DaysActivity[i] === 1 ? 'Prompt' : 'Prompts'}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── TODAY'S SUGGESTIONS (AI COACH) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="p-6 rounded-2xl border border-primary/20 bg-primary/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Lightbulb className="w-24 h-24 text-primary" />
            </div>
            <h2 className="text-sm font-semibold tracking-wide uppercase text-primary mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Today&apos;s Suggestions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm"
                  >
                    <p className="text-sm text-foreground">{suggestion.observation}</p>
                    <p className="text-xs text-muted-foreground mt-1">{suggestion.advice}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 p-4 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm">
                  <p className="text-sm text-foreground">
                    You haven&apos;t written any prompts yet.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start by creating your first prompt in the library to get personalized insights.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── PROMPT JOURNEY & EVOLUTION ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className="text-sm font-medium text-muted-foreground mb-6">Prompt Journey</h2>
              <div className="relative border-l-2 border-border ml-3 space-y-8 py-2">
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-border bg-background" />
                  <h3 className="text-sm font-semibold text-foreground">Day 1</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    First prompt created. Score: 6.2
                  </p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-border bg-background" />
                  <h3 className="text-sm font-semibold text-foreground">Day 30</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Discovered few-shot prompting. Avg Score: 7.8
                  </p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-primary animate-pulse-glow" />
                  <h3 className="text-sm font-semibold text-primary">Day 120 (Today)</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mastered context injection. Avg Score: 9.2
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Recent Prompt Evolution
                </h2>
                <Link href="/dashboard/all-prompts">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-primary/20 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold rounded-full px-4"
                  >
                    View All Prompts
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {[
                  {
                    v: 'v3.2',
                    score: '9.4',
                    winner: true,
                    desc: 'Added output format constraints',
                  },
                  { v: 'v3.1', score: '8.8', winner: false, desc: 'Included edge case examples' },
                  {
                    v: 'v3.0',
                    score: '8.2',
                    winner: false,
                    desc: 'Initial code generation prompt',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-border bg-card flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <GitCommit className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-foreground">
                            {item.v}
                          </span>
                          {item.winner && (
                            <span className="text-[10px] uppercase font-bold tracking-wider text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                              Winner
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-lg font-semibold text-foreground">
                        {item.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
