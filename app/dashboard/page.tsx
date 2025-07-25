'use client';
export const dynamic = 'force-dynamic';

import { SidebarProvider } from "@/components/ui/sidebar";
import { ArrowRight, BookMarked } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { formatDistanceToNow, startOfWeek, endOfWeek, subWeeks, isWithinInterval } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";

export default function Dashboard() {
  const user = useUser();
  const [promptCount, setPromptCount] = useState<number>(0);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [promptScores, setPromptScores] = useState<any[]>([]);
  const [promptDetla, setPromptDelta] = useState<number>(0);

  useEffect(() => {
    const getPrompts = async () => {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', user?.email)
        .single();

      const { data, error: promptError, count } = await supabase
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

      const { data: promptScoreData, error: scoreError, count: promptScorecount } = await supabase
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

  function getColor(score: number) {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  }

  function getBarColor(score: number) {
    if (score >= 8) return 'bg-green-500';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  return (
    <SidebarProvider>
      <div className="flex w-screen">
        <main className="items-center justify-center p-4 w-full  ">
          <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Welcome Back {user?.name?.split(" ")[0]} 👋</h1>
              <p className="text-muted-foreground">Let&apos;s get started on Enhancing your Prompts.</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="recent">Recent Prompts</TabsTrigger>
                <TabsTrigger value="prompts">My Prompt Scores</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Prompt Quality Score</CardTitle>
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      {/* <div className="text-2xl font-bold">78/100</div>
                      <p className="text-xs text-muted-foreground">+12% from last week</p>
                      <Progress value={78} className="mt-3" /> */}
                  {/* <p className="text-md text-muted-foreground">Coming Soon..</p> */}
                  {/* </CardContent> */}
                  {/* </Card> */}

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Prompts Created</CardTitle>
                      <BookMarked className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{promptCount}</div>
                      <p className="text-xs text-muted-foreground">
                        {promptDetla > 0 ? `+${promptDetla} more than last week` : promptDetla < 0 ? `${promptDetla} fewer than last week` : `Same as last week`}
                      </p>
                    </CardContent>
                  </Card>

                  {/* <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Some Data</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3.5 hours</div>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                  </Card> */}
                </div>

                <div>
                  {/* <Card>
                    <CardHeader>
                      <CardTitle>Prompt Analytics</CardTitle>
                      <CardDescription>Detailed metrics about your prompt performance</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] flex items-center justify-center mb-4">
                      {promptScores?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={promptScores.map((score) => ({
                              ...score,
                              created_at: format(new Date(score?.created_at), "MMM d"),
                            }))}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray={"3 3"} />
                            <XAxis dataKey={"created_at"} />
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Legend />
                            <Line type={"natural"} dataKey={"clarity"} stroke="#f97316" />
                            <Line type={"natural"} dataKey={"conciseness"} stroke="#3b82f6" />
                            <Line type={"natural"} dataKey={"relevance"} stroke="#22c55e" />
                            <Line type={"natural"} dataKey={"specificity"} stroke="#facc15" />
                            <Line type={"natural"} dataKey={"structure"} stroke="#f87171" />
                            <Line type={"natural"} dataKey={"model_fit"} stroke="6b7280" />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                          No prompt score data yet
                        </div>
                      )}
                    </CardContent>
                  </Card> */}

                  {/* <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Recommended Templates</CardTitle>
                      <CardDescription>Pre-built templates to enhance your workflow</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between space-x-2 rounded-md border p-3">
                        <div className="flex items-center space-x-3">
                          <Lightbulb className="h-5 w-5 text-amber-500" />
                          <span className="font-medium">Creative Writing</span>
                        </div>
                        <Star className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="flex items-center justify-between space-x-2 rounded-md border p-3">
                        <div className="flex items-center space-x-3">
                          <Sparkles className="h-5 w-5 text-purple-500" />
                          <span className="font-medium">Code Explanation</span>
                        </div>
                        <Star className="h-4 w-4 text-purple-500" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All Templates
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card> */}
                </div>
              </TabsContent>

              <TabsContent value="recent" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Prompts</CardTitle>
                    <CardDescription>Your recently created and enhanced prompts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sortedPrompts?.slice(0, 5).map((prompt, index) => (
                      <div key={prompt?.id} className="flex flex-col space-y-2 rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Prompt #{sortedPrompts.length - index}</h3>
                          <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(prompt?.created_at), { addSuffix: true })}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {prompt?.prompt_value}
                        </p>
                        <div className="flex items-center space-x-2 pt-2">
                          <Link href={`/dashboard/prompt/${prompt?.id}`}>
                            <Button variant="outline" size="sm" className="cursor-pointer">
                              View
                            </Button>
                            {/* <Button variant="outline" size="sm" className="cursor-pointer">
                              Edit
                            </Button> */}
                          </Link>

                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Link href={'/dashboard/all-prompts'}>
                      <Button variant="outline" className="w-full cursor-pointer">
                        View All Prompts
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* <TabsContent value="prompts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Prompt Scores</CardTitle>
                    <CardDescription>Your recently created and scored prompts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[...promptScores].sort((a, b) => new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime()).map((p) => (
                      <div key={p?.id} className="flex flex-col space-y-2 rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Prompt #{p?.id}</h3>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(p?.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {p?.prompt}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {['clarity', 'conciseness', 'relevance', 'specificity', 'structure', 'model_fit'].map((metric) => (
                            <div key={metric} className="flex flex-col gap-1">
                              <span className="text-sm font-medium capitalize">
                                {metric.replace('_', ' ')}:
                                <span className={`ml-1 font-bold ${getColor(p[metric])}`}>
                                  {p[metric]}
                                </span>
                              </span>
                              <div className="w-full bg-gray-200 h-2 rounded-full">
                                <div
                                  className={`h-2 rounded-full ${getBarColor(p[metric])}`}
                                  style={{ width: `${(p[metric] || 0) * 10}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* <div className="flex items-center space-x-2 pt-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div> */}
              {/* </div> */}
              {/* ))} */}
              {/* </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Prompts
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter> */}
              {/* </Card> */}
              {/* </TabsContent> */}

              <TabsContent value="prompts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Prompt Scores</CardTitle>
                    <CardDescription>Latest evaluated prompt and your score timeline</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">

                    {/* 1. HIGHLIGHT – Most Recent Prompt */}
                    {promptScores.length > 0 && (
                      <div className="p-6 border rounded-xl shadow-sm bg-muted/40">
                        <h3 className="text-lg font-bold mb-2">✨ Latest Prompt Score</h3>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Prompt #{promptScores[0]?.id}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(promptScores[0]?.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{promptScores[0]?.prompt}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {['clarity', 'conciseness', 'relevance', 'specificity', 'structure', 'model_fit'].map((metric) => (
                            <div key={metric} className="flex flex-col gap-1">
                              <span className="text-sm font-medium capitalize">
                                {metric.replace('_', ' ')}:
                                <span className={`ml-1 font-bold ${getColor(promptScores[0][metric])}`}>
                                  {promptScores[0][metric]}
                                </span>
                              </span>
                              <div className="w-full bg-gray-200 h-2 rounded-full">
                                <div
                                  className={`h-2 rounded-full ${getBarColor(promptScores[0][metric])}`}
                                  style={{ width: `${(promptScores[0][metric] || 0) * 10}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. SCORE HISTORY AS "CHAT" */}
                    <div className="space-y-6">
                      <h4 className="text-md font-semibold text-muted-foreground">🗂 Previous Prompt Scores</h4>
                      {[...promptScores]
                        .slice(1) // exclude latest prompt
                        .sort((a, b) => new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime())
                        .map((p) => (
                          <div key={p?.id} className="flex flex-col space-y-2 rounded-md border p-4 bg-background hover:shadow-md transition">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">Prompt #{p?.id}</h3>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(p?.created_at), { addSuffix: true })}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground italic">{p?.prompt}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                              {['clarity', 'conciseness', 'relevance', 'specificity', 'structure', 'model_fit'].map((metric) => (
                                <div key={metric} className="flex flex-col gap-1">
                                  <span className="text-sm font-medium capitalize">
                                    {metric.replace('_', ' ')}:
                                    <span className={`ml-1 font-bold ${getColor(p[metric])}`}>
                                      {p[metric]}
                                    </span>
                                  </span>
                                  <div className="w-full bg-gray-200 h-2 rounded-full">
                                    <div
                                      className={`h-2 rounded-full ${getBarColor(p[metric])}`}
                                      style={{ width: `${(p[metric] || 0) * 10}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </div>

        </main>
      </div>
    </SidebarProvider>

  );
}

