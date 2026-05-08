'use client';

import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Mail,
  Calendar,
  Activity,
  Star,
  Sparkles,
  Zap,
  BarChart3,
  Bookmark,
  BookmarkX,
  Copy,
  Flame,
  Tag,
  Trophy,
  GitCompare,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Lazy-load heavy components to improve FCP/LCP
const ActivityGraph = dynamic(
  () =>
    import('@/components/profile/ActivityGraph').then((mod) => ({ default: mod.ActivityGraph })),
  { ssr: false }
);
const RechartsRadar = dynamic<{ data: { subject: string; A: number; fullMark: number }[] }>(
  () => import('@/components/profile/RadarChartSection'),
  { ssr: false }
);

// ─── Stat Card ───────────────────────────────────────────────
function StatBento({
  label,
  value,
  icon: Icon,
  gradient = 'from-white/5 to-transparent',
  delay,
  description,
}: {
  label: string;
  value: number | string;
  icon: any;
  gradient?: string;
  delay: number;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl bg-black border border-foreground/10 overflow-hidden hover:border-foreground/20 transition-all duration-500"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
      />

      <div className="relative z-10 p-6 flex flex-col justify-between h-full min-h-[160px]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
            {label}
          </span>
          <div className="p-2 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-4xl lg:text-5xl font-display tracking-tight text-foreground">
            {value}
          </h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [stats, setStats] = useState<any>({
    totalPrompts: 0,
    activityBreakdown: [
      { subject: 'Prompt Library', A: 0, fullMark: 100 },
      { subject: 'Enhancement', A: 0, fullMark: 100 },
      { subject: 'LLM Comparison', A: 0, fullMark: 100 },
      { subject: 'Scoring', A: 0, fullMark: 100 },
    ],
    currentStreak: 0,
    mostUsedNiche: null,
    weeklySparkline: [0, 0, 0, 0, 0, 0, 0],
    topPrompt: null,
    recentActivity: [],
    memberSince: null,
    totalComparisons: 0,
  });
  const [, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [bookmarksTotal, setBookmarksTotal] = useState(0);

  useEffect(() => {
    if (status === 'loading') return; // Wait for session to resolve
    if (status === 'unauthenticated' || !user?.email) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        const [statsRes, bookmarksRes] = await Promise.all([
          fetch('/api/user/profile-stats'),
          fetch('/api/prompt-library/bookmark?populated=true'),
        ]);

        const statsData = await statsRes.json();
        if (statsData && !statsData.error) setStats(statsData);

        if (bookmarksRes.ok) {
          const bData = await bookmarksRes.json();
          const formatted = (bData || [])
            .filter((item: any) => item.prompt_library)
            .map((item: any) => ({
              bookmarkId: item.id,
              id: item.prompt_library.id,
              title: item.prompt_library.prompt_title,
              description: item.prompt_library.prompt_description,
              promptText: item.prompt_library.promptText,
              niche: item.prompt_library.niche,
              createdByName:
                item.prompt_library.users?.name || item.prompt_library.users?.username || 'Unknown',
            }));
          setBookmarksTotal(formatted.length);
          setBookmarks(formatted.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [status, user?.email]);

  const handleRemoveBookmark = async (promptId: number) => {
    try {
      const res = await fetch('/api/prompt-library/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId }),
      });
      if (!res.ok) throw new Error();
      setBookmarks((prev) => prev.filter((p) => p.id !== promptId));
      setBookmarksTotal((prev) => prev - 1);
      toast.success('Bookmark removed');
    } catch {
      toast.error('Failed to remove bookmark');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to Clipboard!');
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

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-32 lg:py-40 space-y-32">
        {/* ── HERO IDENTITY ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start text-left"
        >
          <div className="flex flex-col lg:flex-row lg:items-end gap-12 w-full">
            <div className="relative shrink-0">
              <div className="w-40 h-40 rounded-full p-[2px] bg-gradient-to-br from-white/20 via-white/5 to-transparent">
                <Avatar className="w-full h-full rounded-full border-[6px] border-black">
                  <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                  <AvatarFallback className="bg-zinc-900 text-white text-4xl font-display">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-px bg-foreground/30" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
                    Certified Operator
                  </span>
                </div>
                <h1 className="text-6xl md:text-7xl lg:text-[100px] font-display tracking-tight leading-[0.9] text-foreground">
                  {user?.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono uppercase tracking-widest">
                <span className="flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/10 bg-white/5 text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" /> {user?.email}
                </span>
                <span className="flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/10 bg-white/5 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" /> Est.{' '}
                  {stats.memberSince
                    ? new Date(stats.memberSince).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—'}
                </span>
                {stats.mostUsedNiche && (
                  <span className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white text-black font-bold">
                    <Tag className="w-3.5 h-3.5" /> {stats.mostUsedNiche}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── STATS BENTO GRID ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBento
            label="Prompts"
            value={stats.totalPrompts}
            icon={Zap}
            delay={0.1}
            description="Total prompts created"
          />
          <StatBento
            label="Streak"
            value={stats.currentStreak}
            icon={Flame}
            delay={0.15}
            description="Consecutive active days"
          />
          <StatBento
            label="Comparisons"
            value={stats.totalComparisons}
            icon={GitCompare}
            delay={0.2}
            description="LLM benchmark runs"
          />
          <StatBento
            label="Actions"
            value={stats.activityBreakdown.reduce((a: any, b: any) => a + b.A, 0)}
            icon={Activity}
            delay={0.25}
            description="Lifetime platform usage"
          />
        </div>

        {/* ── WEEKLY SPARKLINE ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-foreground/30" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
              Activity Timeline
            </span>
          </div>

          <div className="rounded-2xl bg-black border border-foreground/10 p-8 lg:p-12">
            <div className="flex items-end gap-3 h-32">
              {stats.weeklySparkline.map((val: number, i: number) => {
                const max = Math.max(...stats.weeklySparkline, 1);
                const heightPct = (val / max) * 100;
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                const dayIdx = (new Date().getDay() - 6 + i + 7) % 7;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                    <div className="w-full flex items-end justify-center h-24">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(heightPct, 4)}%` }}
                        transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                        className={`w-full max-w-[40px] rounded-t-lg transition-all duration-300 ${val > 0 ? 'bg-white group-hover:bg-white/80' : 'bg-white/[0.03]'}`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                      {days[dayIdx]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── RADAR + ACTIVITY ROW ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Radar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="lg:col-span-2 rounded-2xl bg-black border border-foreground/10 p-8 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Contribution Matrix
              </span>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
            <Suspense
              fallback={
                <div className="h-[280px] flex items-center justify-center text-muted-foreground text-[10px] font-mono uppercase tracking-widest animate-pulse">
                  Initializing Matrix…
                </div>
              }
            >
              <RechartsRadar data={stats.activityBreakdown} />
            </Suspense>
          </motion.div>

          {/* Activity Graph */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="lg:col-span-3 rounded-2xl bg-black border border-foreground/10 overflow-hidden"
          >
            <ActivityGraph />
          </motion.div>
        </div>

        {/* ── TOP PROMPT + RECENT ACTIVITY ROW ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Top Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="lg:col-span-5 rounded-2xl bg-black border border-foreground/10 p-8 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-foreground/30" />
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
                  High Performer
                </span>
              </div>

              {stats.topPrompt ? (
                <div className="space-y-4">
                  <h4 className="text-3xl font-display tracking-tight text-white">
                    {stats.topPrompt.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-foreground/20 pl-4 py-1">
                    &quot;{stats.topPrompt.description}&quot;
                  </p>
                  <div className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest pt-4">
                    <span className="px-3 py-1 rounded-full border border-white/20 bg-white text-black font-bold">
                      {stats.topPrompt.niche}
                    </span>
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Star className="w-3.5 h-3.5 text-white" /> {stats.topPrompt.likes} points
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <Trophy className="w-8 h-8 text-muted-foreground/30 mx-auto" />
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    No awards yet
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display tracking-tight">Recent Execution</h2>
              <Activity className="w-5 h-5 text-muted-foreground" />
            </div>

            {stats.recentActivity.length > 0 ? (
              <div className="grid gap-4">
                {stats.recentActivity.map((act: any, i: number) => {
                  const icons: Record<string, any> = {
                    prompt_enhanced: Sparkles,
                    llm_compared: GitCompare,
                    prompt_scored: BarChart3,
                    prompt_library_added: Zap,
                  };
                  const ActIcon = icons[act.action] || Activity;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-xl border border-foreground/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <ActIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-display tracking-tight text-foreground truncate">
                          {act.label}
                        </p>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
                          {new Date(act.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center border border-foreground/5 rounded-2xl bg-white/[0.01]">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Idle state
                </p>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="space-y-12"
        >
          <Link href="/dashboard/all-prompts">
            <div className="group relative rounded-2xl bg-black border border-foreground/10 p-10 cursor-pointer hover:border-foreground/20 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display tracking-tight text-foreground">
                      Intelligence Library
                    </h3>
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mt-1">
                      {stats.totalPrompts} Active Prompts · Global Access Layer
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-white group-hover:translate-x-2 transition-all duration-500" />
              </div>
            </div>
          </Link>

          {/* ── BOOKMARKED PROMPTS ── */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-foreground/30" />
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
                  Bookmarked Archives
                </span>
              </div>
              {bookmarksTotal > 5 && (
                <Link href="/dashboard/bookmarked-prompts">
                  <Button
                    variant="link"
                    className="text-muted-foreground hover:text-foreground p-0 h-auto group text-[10px] font-mono uppercase tracking-widest"
                  >
                    Exploration Hub{' '}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </div>

            {bookmarks.length === 0 ? (
              <div className="rounded-2xl border border-foreground/5 bg-white/[0.01] p-16 text-center space-y-6">
                <Bookmark className="w-10 h-10 text-muted-foreground/20 mx-auto" />
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
                  No saved data detected
                </p>
                <Link href="/prompt-library">
                  <Button
                    variant="outline"
                    className="rounded-full border-foreground/10 hover:bg-white hover:text-black font-mono text-[10px] uppercase tracking-widest px-8"
                  >
                    Access Library
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map((prompt, i) => (
                  <motion.div
                    key={prompt.bookmarkId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.06, duration: 0.5 }}
                    className="group relative rounded-2xl bg-black border border-foreground/10 hover:border-foreground/20 transition-all duration-300 overflow-hidden flex flex-col min-h-[280px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10 p-6 flex flex-col h-full space-y-4">
                      <div className="flex items-start justify-between">
                        <h4 className="text-lg font-display tracking-tight text-foreground group-hover:text-white transition-colors line-clamp-1 flex-1">
                          {prompt.title}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-1 bg-foreground/5 border border-foreground/10 text-muted-foreground rounded uppercase tracking-widest ml-4">
                          {prompt.niche}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                        {prompt.description}
                      </p>

                      <div className="rounded-xl bg-foreground/5 p-4 border border-foreground/10 group-hover:border-foreground/20 transition-colors">
                        <p className="text-[11px] font-mono text-muted-foreground/70 line-clamp-2 leading-relaxed">
                          &quot;{prompt.promptText}&quot;
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-foreground/5">
                        <button
                          onClick={() => handleRemoveBookmark(prompt.id)}
                          className="flex-1 flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-red-400 transition-colors py-2 rounded-lg hover:bg-red-400/5"
                        >
                          <BookmarkX className="w-3.5 h-3.5" /> Remove
                        </button>
                        <button
                          onClick={() => handleCopy(prompt.promptText)}
                          className="flex-1 flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-white transition-colors py-2 rounded-lg hover:bg-white/5"
                        >
                          <Copy className="w-3.5 h-3.5" /> Duplicate
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
