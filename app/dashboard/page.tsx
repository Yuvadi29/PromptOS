'use client';

import { SidebarProvider } from "@/components/ui/sidebar";
import { ArrowRight, BarChart3, BookMarked, Clock, Lightbulb, Sparkles, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import {format} from "date-fns";

export default function Dashboard() {
  const user = useUser();
  const [promptCount, setPromptCount] = useState<number>(0);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [promptScores, setPromptScores] = useState<any[]>([]);


  useEffect(() => {
    const getPrompts = async () => {
      const { data: userData, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', user?.email)
        .single();

      const { data, error: promptError, count } = await supabase
        .from("prompts")
        .select('*', { count: 'exact' })
        .eq('created_by', userData?.id);

      if (data) {
        setPrompts(data);
      } else {
        setPrompts([]);
      }

      if (promptError) {
        console.log('Error Fetching Prompts: ', promptError);
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
      console.log(promptScoreData);

    };
    getPrompts();
  }, [])

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
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="recent">Recent Prompts</TabsTrigger>
                <TabsTrigger value="prompts">My Prompt Scores</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Prompt Quality Score</CardTitle>
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      {/* <div className="text-2xl font-bold">78/100</div>
                      <p className="text-xs text-muted-foreground">+12% from last week</p>
                      <Progress value={78} className="mt-3" /> */}
                      <p className="text-md text-muted-foreground">Coming Soon..</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Prompts Created</CardTitle>
                      <BookMarked className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{promptCount}</div>
                      {/* <p className="text-xs text-muted-foreground">+4 new this week</p> */}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Some Data</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3.5 hours</div>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Prompt Enhancement Progress</CardTitle>
                      <CardDescription>Your journey to mastering prompt engineering</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                        <BarChart3 className="h-16 w-16 text-muted" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-3">
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
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <Card>
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
                            created_at: format(new Date(score.created_at), "MMM d"),
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
                </Card>
              </TabsContent>

              <TabsContent value="recent" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Prompts</CardTitle>
                    <CardDescription>Your recently created and enhanced prompts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {prompts?.map((prompt) => (
                      <div key={prompt?.id} className="flex flex-col space-y-2 rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Prompt #{prompt?.id}</h3>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {prompt?.prompt_value}
                        </p>
                        <div className="flex items-center space-x-2 pt-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Prompts
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="prompts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Prompt Scores</CardTitle>
                    <CardDescription>Your recently created and scored prompts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {promptScores?.map((p) => (
                      <div key={p?.id} className="flex flex-col space-y-2 rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Prompt #{p?.id}</h3>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {p?.prompt}
                        </p>
                        <div className="flex items-center justify-center gap-5">
                          <span className="text-md text-orange-600 font-medium">Clarity: {p?.clarity}</span>
                          <span className="text-md text-blue-600 font-medium">Conciseness: {p?.conciseness}</span>
                          <span className="text-md text-green-600 font-medium">Relevance: {p?.relevance}</span>
                          <span className="text-md text-amber-500 font-medium">Specificity: {p?.specificity}</span>
                          <span className="text-md text-red-400 font-medium">Structure: {p?.structure}</span>
                          <span className="text-md text-gray-600 font-medium">Model Fit: {p?.model_fit}</span>
                        </div>
                        {/* <div className="flex items-center space-x-2 pt-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div> */}
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Prompts
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

        </main>
      </div>
    </SidebarProvider>

  );
}

