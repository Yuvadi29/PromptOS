"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Mail, Calendar, Activity, Star, Sparkles, Zap, TrendingUp, BarChart3, Bookmark, BookmarkX, Copy, Flame, Clock, Tag, Trophy, GitCompare } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Lazy-load heavy components to improve FCP/LCP
const ActivityGraph = dynamic(() => import("@/components/profile/ActivityGraph").then(mod => ({ default: mod.ActivityGraph })), { ssr: false });
const RechartsRadar = dynamic<{ data: { subject: string; A: number; fullMark: number }[] }>(() => import("@/components/profile/RadarChartSection"), { ssr: false });

// ─── Stat Card ───────────────────────────────────────────────,...
function StatBento({ label, value, icon: Icon, gradient, delay, description }: {
    label: string; value: number | string; icon: any; gradient: string; delay: number; description: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="group relative rounded-[1.5rem] bg-zinc-900/50 border border-white/[0.06] backdrop-blur-md overflow-hidden hover:border-white/[0.12] transition-all duration-500"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            {/* Hover tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/[0.08] text-[11px] text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none z-20 shadow-xl">
                {description}
            </div>
            <div className="relative z-10 p-6 flex flex-col justify-between h-full min-h-[140px]">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500 group-hover:text-zinc-300 transition-colors">{label}</span>
                    <Icon className="w-5 h-5 text-zinc-600 group-hover:text-orange-400 transition-colors" />
                </div>
                <div className="text-4xl font-black tracking-tight text-white mt-auto">{value}</div>
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
            { subject: 'Scoring', A: 0, fullMark: 100 }
        ],
        currentStreak: 0,
        mostUsedNiche: null,
        weeklySparkline: [0, 0, 0, 0, 0, 0, 0],
        topPrompt: null,
        recentActivity: [],
        memberSince: null,
        totalComparisons: 0,
    });
    const [loading, setLoading] = useState(true);
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
                            createdByName: item.prompt_library.users?.name || item.prompt_library.users?.username || 'Unknown',
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
            setBookmarks(prev => prev.filter(p => p.id !== promptId));
            setBookmarksTotal(prev => prev - 1);
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
        <div className="min-h-screen bg-black text-white selection:bg-orange-500/30">
            {/* Ambient light */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full bg-orange-600/[0.07] blur-[150px]" />
                <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/[0.04] blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

                {/* ── HERO IDENTITY ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center text-center mb-20"
                >
                    <div className="relative mb-8">
                        <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600">
                            <Avatar className="w-full h-full rounded-full border-[3px] border-black">
                                <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                                <AvatarFallback className="bg-zinc-900 text-orange-500 text-2xl font-bold">
                                    {user?.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-black border-2 border-zinc-800 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-orange-400" />
                        </div>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                            {user?.name}
                        </span>
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-500">
                        <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.02]">
                            <Mail className="w-3.5 h-3.5" /> {user?.email}
                        </span>
                        <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.02]">
                            <Calendar className="w-3.5 h-3.5" /> Joined {stats.memberSince ? new Date(stats.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
                        </span>
                        {stats.mostUsedNiche && (
                            <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-300">
                                <Tag className="w-3.5 h-3.5" /> {stats.mostUsedNiche}
                            </span>
                        )}
                    </div>
                </motion.div>

                {/* ── STATS BENTO GRID ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                    <StatBento label="Prompts" value={stats.totalPrompts} icon={Zap} gradient="from-orange-500/10 to-transparent" delay={0.1} description="Total prompts you've created" />
                    <StatBento label="Streak" value={stats.currentStreak > 0 ? `${stats.currentStreak} 🔥` : '0'} icon={Flame} gradient="from-red-500/10 to-transparent" delay={0.15} description="Consecutive days of activity" />
                    <StatBento label="Comparisons" value={stats.totalComparisons} icon={GitCompare} gradient="from-blue-500/10 to-transparent" delay={0.2} description="Total LLM comparisons performed" />
                    <StatBento label="Actions" value={stats.activityBreakdown.reduce((a: any, b: any) => a + b.A, 0)} icon={Activity} gradient="from-yellow-500/10 to-transparent" delay={0.25} description="Lifetime actions across the platform" />
                </div>

                {/* ── WEEKLY SPARKLINE ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mb-16"
                >
                    <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Weekly Activity
                    </h3>
                    <div className="rounded-[1.5rem] bg-zinc-900/50 border border-white/[0.06] backdrop-blur-md p-6">
                        <div className="flex items-end gap-2 h-20">
                            {stats.weeklySparkline.map((val: number, i: number) => {
                                const max = Math.max(...stats.weeklySparkline, 1);
                                const heightPct = (val / max) * 100;
                                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                                const dayIdx = (new Date().getDay() - 6 + i + 7) % 7;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <div className="w-full flex items-end justify-center" style={{ height: '60px' }}>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${Math.max(heightPct, 4)}%` }}
                                                transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                                                className={`w-full max-w-[32px] rounded-md ${val > 0 ? 'bg-gradient-to-t from-orange-600 to-amber-400' : 'bg-zinc-800'}`}
                                            />
                                        </div>
                                        <span className="text-[10px] text-zinc-600">{days[dayIdx]}</span>
                                        {val > 0 && <span className="text-[10px] text-zinc-400 font-medium">{val}</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* ── RADAR + ACTIVITY ROW ── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-16">
                    {/* Radar */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="lg:col-span-2 rounded-[1.5rem] bg-zinc-900/50 border border-white/[0.06] backdrop-blur-md p-6 relative overflow-hidden"
                    >
                        <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" /> Contribution Breakdown
                        </h3>
                        <Suspense fallback={<div className="h-[280px] flex items-center justify-center text-zinc-600 text-sm animate-pulse">Loading chart…</div>}>
                            <RechartsRadar data={stats.activityBreakdown} />
                        </Suspense>
                    </motion.div>

                    {/* Activity Graph */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="lg:col-span-3 rounded-[1.5rem] bg-zinc-900/50 border border-white/[0.06] backdrop-blur-md overflow-hidden"
                    >
                        <ActivityGraph />
                    </motion.div>
                </div>

                {/* ── TOP PROMPT + RECENT ACTIVITY ROW ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-16">
                    {/* Top Prompt */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.5 }}
                        className="rounded-[1.5rem] bg-zinc-900/50 border border-white/[0.06] backdrop-blur-md p-6"
                    >
                        <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500 mb-4 flex items-center gap-2">
                            <Trophy className="w-4 h-4" /> Top Prompt
                        </h3>
                        {stats.topPrompt ? (
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">{stats.topPrompt.title}</h4>
                                <p className="text-sm text-zinc-400 line-clamp-2 mb-3">{stats.topPrompt.description}</p>
                                <div className="flex items-center gap-4">
                                    <Badge variant="outline" className="border-zinc-700 text-zinc-300">{stats.topPrompt.niche}</Badge>
                                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                                        <Star className="w-3 h-3 text-amber-400" /> {stats.topPrompt.likes} likes
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <Trophy className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                                <p className="text-sm text-zinc-600">Add prompts to the library to see your top prompt here</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Recent Activity Feed */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="rounded-[1.5rem] bg-zinc-900/50 border border-white/[0.06] backdrop-blur-md p-6"
                    >
                        <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500 mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Recent Activity
                        </h3>
                        {stats.recentActivity.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recentActivity.map((act: any, i: number) => {
                                    const icons: Record<string, any> = {
                                        'prompt_enhanced': Sparkles,
                                        'llm_compared': GitCompare,
                                        'prompt_scored': BarChart3,
                                        'prompt_library_added': Zap,
                                    };
                                    const colors: Record<string, string> = {
                                        'prompt_enhanced': 'text-purple-400',
                                        'llm_compared': 'text-blue-400',
                                        'prompt_scored': 'text-green-400',
                                        'prompt_library_added': 'text-orange-400',
                                    };
                                    const ActIcon = icons[act.action] || Activity;
                                    const color = colors[act.action] || 'text-zinc-400';
                                    return (
                                        <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.03] last:border-0">
                                            <div className={`w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 ${color}`}>
                                                <ActIcon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-zinc-200">{act.label}</p>
                                                <p className="text-[11px] text-zinc-600">
                                                    {new Date(act.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <Clock className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                                <p className="text-sm text-zinc-600">No recent activity yet</p>
                            </div>
                        )}
                    </motion.div>
                </div>


                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="mb-16"
                >
                    <Link href="/dashboard/all-prompts">
                        <div className="group relative rounded-[1.5rem] bg-zinc-900/50 border border-white/[0.06] backdrop-blur-md p-8 cursor-pointer hover:border-white/[0.12] transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/20 flex items-center justify-center group-hover:from-orange-500/30 transition-all">
                                        <Zap className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-zinc-200 group-hover:text-white transition-colors">My Prompts</h3>
                                        <p className="text-sm text-zinc-600">{stats.totalPrompts} prompt{stats.totalPrompts !== 1 ? 's' : ''} created · View all →</p>
                                    </div>
                                </div>
                                <div className="text-zinc-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </div>
                        </div>
                    </Link>

                {/* ── BOOKMARKED PROMPTS (inline preview) ── */}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75, duration: 0.5 }}
                    className="mb-16"
                >
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500 flex items-center gap-2">
                            <Bookmark className="w-4 h-4" /> Bookmarked Prompts
                            {bookmarksTotal > 0 && (
                                <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">
                                    {bookmarksTotal}
                                </span>
                            )}
                        </h3>
                        {bookmarksTotal > 5 && (
                            <Link href="/dashboard/bookmarked-prompts" className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium">
                                View all →
                            </Link>
                        )}
                    </div>

                    {bookmarks.length === 0 ? (
                        <div className="rounded-[1.5rem] bg-zinc-900/50 border border-white/[0.06] backdrop-blur-md p-10 text-center">
                            <Bookmark className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                            <p className="text-zinc-500 text-sm mb-1">No bookmarks yet</p>
                            <p className="text-zinc-600 text-xs mb-4">Save prompts from the community library to see them here.</p>
                            <Link href="/prompt-library">
                                <Button size="sm" className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-xs cursor-pointer">
                                    Browse Prompt Library
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {bookmarks.map((prompt, i) => (
                                <motion.div
                                    key={prompt.bookmarkId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + i * 0.06, duration: 0.5 }}
                                    className="group relative"
                                >
                                    <div className="h-full p-5 rounded-2xl bg-zinc-900/70 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 flex flex-col min-h-[220px]">
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl" />

                                        <div className="relative flex-1 flex flex-col">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="text-base font-semibold text-zinc-200 group-hover:text-amber-400 transition-colors line-clamp-1 flex-1">
                                                    {prompt.title}
                                                </h4>
                                                <Badge variant="outline" className="ml-2 shrink-0 border-zinc-700/50 text-zinc-400 text-[11px] px-2 py-0.5">
                                                    {prompt.niche}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-zinc-500 line-clamp-2 mb-3">{prompt.description}</p>

                                            {/* Prompt text preview */}
                                            <div className="flex-1 rounded-lg bg-zinc-800/40 p-3 mb-4 border border-zinc-800/60 group-hover:border-amber-500/15 transition-colors">
                                                <p className="text-xs font-mono text-zinc-400 line-clamp-3">{prompt.promptText}</p>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                                                <button
                                                    onClick={() => handleRemoveBookmark(prompt.id)}
                                                    className="flex items-center gap-1.5 text-zinc-500 hover:text-red-400 transition-colors p-1 text-xs cursor-pointer"
                                                    title="Remove bookmark"
                                                >
                                                    <BookmarkX className="w-4 h-4" />
                                                    <span>Remove</span>
                                                </button>
                                                <button
                                                    onClick={() => handleCopy(prompt.promptText)}
                                                    className="flex items-center gap-1.5 text-zinc-500 hover:text-amber-400 transition-colors p-1 text-xs"
                                                    title="Copy prompt"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                    <span>Copy</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {bookmarksTotal > 5 && (
                        <div className="mt-4 text-center">
                            <Link href="/dashboard/bookmarked-prompts">
                                <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 text-xs">
                                    View all {bookmarksTotal} bookmarked prompts →
                                </Button>
                            </Link>
                        </div>
                    )}

                </motion.div>
            </div>
        </div>
    );
}
