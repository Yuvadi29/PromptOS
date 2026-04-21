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

    if (loading) return (
      <Card className="p-6 bg-[#0F0F12] border-white/5 h-full min-h-[500px] flex items-center justify-center animate-pulse rounded-2xl shadow-2xl">
         <div className="h-full w-full bg-white/5 rounded-xl border border-white/5"></div>
      </Card>
    );

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
        <Card className="bg-[#0F0F12] border-white/5 rounded-2xl shadow-2xl overflow-hidden flex flex-col xl:flex-row group relative h-full min-h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Left Side: Radar/Radial & Stats */}
            <div className="w-full xl:w-2/5 p-6 border-b xl:border-b-0 xl:border-r border-white/5 flex flex-col relative z-10 bg-black/20">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                        <Target className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 leading-tight">
                            Quality Engine
                        </h2>
                        <p className="text-xs text-gray-400 font-mono">Global Aggregate Scoring</p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row xl:flex-col items-center justify-center gap-6">
                    <div className="h-[200px] w-[200px] shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={8} data={chartData}>
                                <RadialBar
                                    background
                                    dataKey="uv"
                                    cornerRadius={10}
                                />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(17,17,17,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{color: '#fff'}} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full">
                        <ScoreCard title="Clarity" value={data.averages.clarity} icon={Zap} color="violet" />
                        <ScoreCard title="Model Fit" value={data.averages.model_fit} icon={CheckCircle2} color="emerald" />
                        <ScoreCard title="Specificity" value={data.averages.specificity} icon={Target} color="cyan" />
                        <ScoreCard title="Structure" value={data.averages.structure} icon={Layout} color="orange" />
                    </div>
                </div>
            </div>

            {/* Right Side: Recent Scores List */}
            <div className="w-full xl:w-3/5 p-0 flex flex-col relative z-10 bg-black/10">
                <div className="p-4 border-b border-white/5 bg-black/40 backdrop-blur-md">
                    <h3 className="text-[13px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                        <Activity className="h-4 w-4 text-cyan-400" /> Evaluation Stream
                    </h3>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 mb-1">
                        <div className="col-span-6">Raw Prompt Input</div>
                        <div className="col-span-2 text-center">Clarity</div>
                        <div className="col-span-2 text-center">Fit</div>
                        <div className="col-span-2 text-right">Timestamp</div>
                    </div>
                    {data.recentScores.map((score: any) => (
                        <div key={score.id} className="grid grid-cols-12 gap-2 px-4 py-3 text-xs hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 rounded-xl group/row">
                            <div className="col-span-6 text-gray-300 truncate pr-4 group-hover/row:text-white transition-colors" title={score.prompt}>{score.prompt}</div>
                            <div className="col-span-2 text-center font-mono">
                                <span className={score.clarity > 80 ? "text-emerald-400" : "text-orange-400"}>{score.clarity}</span><span className="text-gray-600">/100</span>
                            </div>
                            <div className="col-span-2 text-center font-mono">
                                <span className={score.model_fit > 80 ? "text-emerald-400" : "text-orange-400"}>{score.model_fit}</span><span className="text-gray-600">/100</span>
                            </div>
                            <div className="col-span-2 text-right text-gray-500 font-mono text-[10px] mt-0.5">{new Date(score.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}

function ScoreCard({ title, value, icon: Icon, color }: any) {
    const colors: any = {
        violet: "text-violet-400 bg-violet-400/10 border-violet-500/20",
        emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-500/20",
        cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-500/20",
        orange: "text-orange-400 bg-orange-400/10 border-orange-500/20"
    };

    return (
        <Card className={`p-3 bg-black/40 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors shadow-inner rounded-xl`}>
            <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{title}</span>
                <div className={`p-1 rounded-md border ${colors[color] || colors.cyan}`}>
                    <Icon className="h-3 w-3" />
                </div>
            </div>
            <div className="text-lg font-black tracking-tight text-white mt-1">
                {typeof value === 'number' ? value.toFixed(0) : value}
                <span className="text-[9px] text-gray-500 font-normal ml-0.5 tracking-normal">/100</span>
            </div>
        </Card>
    );
}
