'use client';

import { useEffect, useState } from 'react';
import { DashboardClient } from './DashboardClient';
import { Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({
    prompts: [],
    promptScores: [],
    promptDelta: 0,
    streakCount: 0,
    suggestions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session storage first
    const cachedData = sessionStorage.getItem('dashboard_stats');
    if (cachedData) {
      try {
        setStats(JSON.parse(cachedData));
        setLoading(false);
      } catch (e) {
        console.error('Failed to parse cached dashboard stats', e);
      }
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard-stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
          sessionStorage.setItem('dashboard_stats', JSON.stringify(data));
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full animate-spin" />
            <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-muted-foreground animate-pulse font-mono text-sm tracking-widest uppercase">
            Syncing Intelligence...
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardClient
      promptCount={stats.promptCount || 0}
      prompts={stats.prompts}
      promptScores={stats.promptScores}
      promptDelta={stats.promptDelta}
      streakCount={stats.streakCount}
      suggestions={stats.suggestions}
    />
  );
}
