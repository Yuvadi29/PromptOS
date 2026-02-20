"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Mail, Calendar, Activity, Star, Sparkles, Zap, TrendingUp, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";

// Lazy-load heavy components to improve FCP/LCP
const ActivityGraph = dynamic(() => import("@/components/profile/ActivityGraph").then(mod => ({ default: mod.ActivityGraph })), { ssr: false });
const RechartsRadar = dynamic<{ data: { subject: string; A: number; fullMark: number }[] }>(() => import("@/components/profile/RadarChartSection"), { ssr: false });

// ─── Stat Card ───────────────────────────────────────────────
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
    const [stats, setStats] = useState({
        totalPrompts: 0,
        totalLikes: 0,
        reputation: 0,
        activityBreakdown: [
            { subject: 'Prompt Library', A: 0, fullMark: 100 },
            { subject: 'Enhancement', A: 0, fullMark: 100 },
            { subject: 'LLM Comparison', A: 0, fullMark: 100 },
            { subject: 'Scoring', A: 0, fullMark: 100 }
        ]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'loading') return; // Wait for session to resolve
        if (status === 'unauthenticated' || !user?.email) {
            setLoading(false);
            return;
        }
        fetch('/api/user/profile-stats')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setStats(data);
                }
            })
            .catch(err => console.error('Failed to load profile stats:', err))
            .finally(() => setLoading(false));
    }, [status, user?.email]);

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
                            <Calendar className="w-3.5 h-3.5" /> Joined Nov 2025
                        </span>
                    </div>
                </motion.div>

                {/* ── STATS BENTO GRID ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                    <StatBento label="Prompts" value={stats.totalPrompts} icon={Zap} gradient="from-orange-500/10 to-transparent" delay={0.1} description="Total prompts you've created and added to the community library" />
                    {/* <StatBento label="Upvotes" value={stats.totalLikes} icon={Star} gradient="from-amber-500/10 to-transparent" delay={0.2} description="Total upvotes received from the community on your prompts" /> */}
                    {/* <StatBento label="Reputation" value={stats.reputation} icon={TrendingUp} gradient="from-orange-600/10 to-transparent" delay={0.3} description="Score based on upvotes, downvotes, and prompts created" /> */}
                    <StatBento label="Actions" value={stats.activityBreakdown.reduce((a, b) => a + b.A, 0)} icon={Activity} gradient="from-yellow-500/10 to-transparent" delay={0.4} description="Lifetime actions: enhancements, comparisons, scores, and library adds" />
                </div>

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

                {/* ── MY PROMPTS LINK ── */}
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
                </motion.div>

                {/* ── ACTIVITY LOG (always visible) ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500 mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Activity Log
                    </h3>
                    <div className="rounded-[1.5rem] bg-zinc-900/50 border border-white/[0.06] backdrop-blur-md overflow-hidden">
                        <ActivityGraph />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
