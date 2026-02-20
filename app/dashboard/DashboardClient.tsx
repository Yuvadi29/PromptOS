'use client';

import { BookMarked, Sparkles, TrendingUp, Flame } from "lucide-react"
import { useUser } from "@/context/UserContext";
import { StatCard } from "@/components/dashboard/stat-card";
import { PromptCard } from "@/components/dashboard/prompt-card";
import { ScoreBar } from "@/components/dashboard/score-bar";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

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
    const { toggleSidebar } = useSidebar();

    const sortedPrompts = prompts ? [...prompts].sort((a, b) => new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime()) : [];
    const latestScore = promptScores.length > 0 ? promptScores[0] : null;

    return (
        <div className="flex w-full min-h-screen bg-black">
            {/* Ambient glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 left-1/4 w-[600px] h-[400px] rounded-full bg-orange-600/[0.05] blur-[150px]" />
                <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] rounded-full bg-amber-500/[0.03] blur-[120px]" />
            </div>

            <main className="relative z-10 flex-1 p-4 md:p-8">
                <div className="max-w-7xl mx-auto space-y-10">

                    {/* ── HEADER ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-2"
                    >
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                                Welcome Back,{' '}
                            </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                                {user?.name?.split(" ")[0] || "User"} 👋
                            </span>
                        </h1>
                        <p className="text-zinc-600 text-sm tracking-wide">Let&apos;s enhance your prompts today.</p>
                    </motion.div>

                    {/* ── STATS BENTO GRID ── */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Current Streak"
                            value={`${streakCount} Day${streakCount !== 1 ? 's' : ''}`}
                            icon={Flame}
                            gradient="from-red-500/10 to-orange-500/5"
                            description="Keep going!"
                        />
                        <StatCard
                            title="Prompts Created"
                            value={promptCount}
                            icon={BookMarked}
                            gradient="from-orange-500/10 to-amber-500/5"
                            trend={{
                                value: promptDelta,
                                label: promptDelta === 0 ? 'same as last week' : 'from last week'
                            }}
                        />
                        <StatCard
                            title="Total Scores"
                            value={promptScores.length}
                            icon={Sparkles}
                            gradient="from-amber-500/10 to-yellow-500/5"
                            description="Prompts evaluated"
                        />
                        <StatCard
                            title="Avg Quality"
                            value={promptScores.length > 0 ? '8.2/10' : 'N/A'}
                            icon={TrendingUp}
                            gradient="from-yellow-500/10 to-orange-500/5"
                            description="Overall prompt quality"
                        />
                    </div>

                    {/* ── RECENT PROMPTS ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500">
                                Recent Prompts
                            </h2>
                            <Link href="/dashboard/all-prompts">
                                <span className="text-xs text-zinc-600 hover:text-orange-400 transition-colors cursor-pointer">
                                    View all →
                                </span>
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {sortedPrompts?.slice(0, 5).map((prompt, index) => (
                                <PromptCard
                                    key={prompt?.id}
                                    id={prompt?.id}
                                    title={`Prompt #${sortedPrompts.length - index}`}
                                    content={prompt?.prompt_value}
                                    createdAt={prompt?.created_at}
                                />
                            ))}
                            {sortedPrompts.length === 0 && (
                                <div className="text-center py-16 text-zinc-600 text-sm">
                                    No prompts yet. Start by enhancing your first prompt!
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* ── LATEST SCORE ── */}
                    {latestScore && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500 mb-4">
                                ✨ Latest Prompt Score
                            </h2>
                            <div className="rounded-[1.5rem] bg-zinc-900/50 border border-white/[0.06] backdrop-blur-md p-6 space-y-6">
                                <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                                    {latestScore?.prompt}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['clarity', 'conciseness', 'relevance', 'specificity', 'structure', 'model_fit'].map((metric) => (
                                        <ScoreBar
                                            key={metric}
                                            label={metric}
                                            score={latestScore[metric] || 0}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── PREVIOUS SCORES ── */}
                    {promptScores.length > 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="space-y-4"
                        >
                            <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500">
                                Previous Scores
                            </h2>
                            {promptScores.slice(1).map((score) => (
                                <div
                                    key={score?.id}
                                    className="rounded-[1.5rem] bg-zinc-900/40 border border-white/[0.04] backdrop-blur-sm p-6 hover:border-white/[0.08] transition-all duration-300 space-y-4"
                                >
                                    <p className="text-sm text-zinc-500 line-clamp-2">
                                        {score?.prompt}
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {['clarity', 'conciseness', 'relevance', 'specificity', 'structure', 'model_fit'].map((metric) => (
                                            <ScoreBar
                                                key={metric}
                                                label={metric}
                                                score={score[metric] || 0}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {promptScores.length === 0 && (
                                <div className="text-center py-16 text-zinc-600 text-sm">
                                    No scores yet. Try the prompt scoring feature!
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}
