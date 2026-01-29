"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { Activity, Target, Zap, Layout, AlignLeft, CheckCircle2 } from "lucide-react";

export default function ScoresTab() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/scores")
            .then((res) => res.json())
            .then((json) => {
                setData(json);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-gray-400 animate-pulse">Loading scores...</div>;
    if (!data) return <div className="text-red-400">Failed to load scores</div>;

    const chartData = [
        { name: "Clarity", uv: data.averages.clarity, fill: "#8884d8" },
        { name: "Specificity", uv: data.averages.specificity, fill: "#83a6ed" },
        { name: "Model Fit", uv: data.averages.model_fit, fill: "#8dd1e1" },
        { name: "Relevance", uv: data.averages.relevance, fill: "#82ca9d" },
        { name: "Structure", uv: data.averages.structure, fill: "#a4de6c" },
        { name: "Conciseness", uv: data.averages.conciseness, fill: "#d0ed57" },
    ];

    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Detailed Stats */}
                <div className="grid gap-4 grid-cols-2">
                    <ScoreCard title="Clarity" value={data.averages.clarity} icon={Zap} color="violet" />
                    <ScoreCard title="Specificity" value={data.averages.specificity} icon={Target} color="blue" />
                    <ScoreCard title="Model Fit" value={data.averages.model_fit} icon={CheckCircle2} color="green" />
                    <ScoreCard title="Structure" value={data.averages.structure} icon={Layout} color="orange" />
                </div>

                {/* Chart */}
                <Card className="p-6 bg-[#0F0F12] border-white/5 flex items-center justify-center">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={15} data={chartData}>
                                <RadialBar
                                    label={{ position: 'insideStart', fill: '#fff' }}
                                    background
                                    dataKey="uv"
                                />
                                <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none' }} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Recent Scores List */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-400" /> Recent Evaluations
                </h3>
                <div className="bg-[#0F0F12] border border-white/5 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-6 gap-4 p-4 text-xs font-medium text-gray-500 border-b border-white/5 uppercase tracking-wider">
                        <div className="col-span-3">Prompt</div>
                        <div>Clarity</div>
                        <div>Model Fit</div>
                        <div>Date</div>
                    </div>
                    {data.recentScores.map((score: any) => (
                        <div key={score.id} className="grid grid-cols-6 gap-4 p-4 text-sm hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                            <div className="col-span-3 text-white truncate pr-4" title={score.prompt}>{score.prompt}</div>
                            <div className="text-gray-300">{score.clarity}/100</div>
                            <div className="text-gray-300">{score.model_fit}/100</div>
                            <div className="text-gray-500 text-xs">{new Date(score.created_at).toLocaleDateString()}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ScoreCard({ title, value, icon: Icon, color }: any) {
    const colors: any = {
        violet: "text-violet-400 bg-violet-400/10",
        blue: "text-blue-400 bg-blue-400/10",
        green: "text-emerald-400 bg-emerald-400/10",
        orange: "text-orange-400 bg-orange-400/10"
    };

    return (
        <Card className="p-4 bg-[#0F0F12] border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-400 font-medium">{title}</span>
                <div className={`p-1.5 rounded-lg ${colors[color] || colors.blue}`}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div className="text-2xl font-bold text-white">
                {typeof value === 'number' ? value.toFixed(1) : value}
                <span className="text-xs text-gray-500 font-normal ml-1">/ 100</span>
            </div>
        </Card>
    );
}
