'use client';
export const dynamic = 'force-dynamic';

import { SidebarProvider } from "@/components/ui/sidebar";
import { BookMarked, Sparkles, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import { startOfWeek, endOfWeek, subWeeks, isWithinInterval } from "date-fns";
import { toast } from "sonner";
import { StatCard } from "@/components/dashboard/stat-card";
import { PromptCard } from "@/components/dashboard/prompt-card";
import { ScoreBar } from "@/components/dashboard/score-bar";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const user = useUser();
  const [promptCount, setPromptCount] = useState<number>(0);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [promptScores, setPromptScores] = useState<any[]>([]);
  const [promptDelta, setPromptDelta] = useState<number>(0);

  useEffect(() => {
    const getPrompts = async () => {
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', user?.email)
        .single();

      const { data, error: promptError, count } = await supabaseAdmin
        .from("prompts")
        .select('*', { count: 'exact' })
        .eq('created_by', userData?.id);

      const now = new Date();
      const thisWeek = {
        start: startOfWeek(now),
        end: endOfWeek(now),
      };

      const lastWeek = {
        start: startOfWeek(subWeeks(now, 1)),
        end: endOfWeek(subWeeks(now, 1))
      };

      const promptsThisWeek = data?.filter((p) => {
        isWithinInterval(new Date(p?.created_at), thisWeek)
      })

      const promptsLastWeek = data?.filter((p) => {
        isWithinInterval(new Date(p?.created_at), lastWeek)
      })

      const delta = (promptsThisWeek?.length || 0) - (promptsLastWeek?.length || 0);

      if (data) {
        setPrompts(data || []);
      } else {
        setPrompts([]);
      }

      if (promptError) {
        toast.error('Error Fetching Prompts: ');
      } else {
        setPromptCount(count || 0);
      }

      const { data: promptScoreData } = await supabaseAdmin
        .from("prompt_scores")
        .select('*', { count: 'exact' })
        .eq('created_by', userData?.id)

      if (promptScoreData) {
        setPromptScores(promptScoreData);
      } else {
        setPromptScores([]);
      }
      setPromptDelta(delta);
    };
    getPrompts();
  }, [user?.email])

  const sortedPrompts = prompts ? [...prompts].sort((a, b) => new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime()) : [];
  const latestScore = promptScores.length > 0 ? promptScores[0] : null;

  return (
    <SidebarProvider>
      <div className="flex w-screen min-h-screen bg-zinc-950">
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h1 className="text-4xl font-bold">
                <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  Welcome Back,{' '}
                </span>
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  {user?.name?.split(" ")[0]} 👋
                </span>
              </h1>
              <p className="text-zinc-400">Let&apos;s get started on enhancing your prompts.</p>
            </motion.div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-zinc-900 border border-zinc-800">
                <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-amber-600">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="recent" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-amber-600">
                  Recent Prompts
                </TabsTrigger>
                <TabsTrigger value="scores" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-amber-600">
                  Prompt Scores
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <StatCard
                    title="Prompts Created"
                    value={promptCount}
                    icon={BookMarked}
                    gradient="from-orange-500 to-amber-500"
                    trend={{
                      value: promptDelta,
                      label: promptDelta === 0 ? 'same as last week' : 'from last week'
                    }}
                  />
                  <StatCard
                    title="Total Scores"
                    value={promptScores.length}
                    icon={Sparkles}
                    gradient="from-amber-500 to-yellow-500"
                    description="Prompts evaluated"
                  />
                  <StatCard
                    title="Avg Quality"
                    value={promptScores.length > 0 ? '8.2/10' : 'N/A'}
                    icon={TrendingUp}
                    gradient="from-yellow-500 to-orange-400"
                    description="Overall prompt quality"
                  />
                </div>
              </TabsContent>

              {/* Recent Prompts Tab */}
              <TabsContent value="recent" className="space-y-4">
                <div className="grid gap-4">
                  {sortedPrompts?.slice(0, 5).map((prompt, index) => (
                    <PromptCard
                      key={prompt?.id}
                      id={prompt?.id}
                      title={`Prompt #${sortedPrompts.length - index}`}
                      content={prompt?.prompt_value}
                      createdAt={prompt?.created_at}
                    />
                  ))}
                  <Link href={"/dashboard/all-prompts"}>
                    <Button
                      variant="outline"
                      className="w-full"
                    >
                      View All Prompts
                    </Button>
                  </Link>
                  {sortedPrompts.length === 0 && (
                    <div className="text-center py-12 text-zinc-500">
                      No prompts yet. Start by enhancing your first prompt!
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Prompt Scores Tab */}
              <TabsContent value="scores" className="space-y-6">
                {latestScore && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-900/50 border border-zinc-800"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">
                      ✨ Latest Prompt Score
                    </h3>
                    <p className="text-sm text-zinc-400 mb-6 line-clamp-2">
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
                  </motion.div>
                )}

                {/* Previous Scores */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-zinc-400">Previous Scores</h4>
                  {promptScores.slice(1).map((score) => (
                    <motion.div
                      key={score?.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all"
                    >
                      <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
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
                    </motion.div>
                  ))}
                  {promptScores.length === 0 && (
                    <div className="text-center py-12 text-zinc-500">
                      No scores yet. Try the prompt scoring feature!
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
