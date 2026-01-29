"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { Users, FileText, MessageSquare, Database, ArrowUpRight } from "lucide-react";

interface AnalyticsData {
    counts: {
        users: number;
        prompts: number;
        sessions: number;
        library: number;
    };
    recentGrowth: {
        users: number;
        prompts: number;
    };
    dailyActivity: {
        date: string;
        users: number;
        prompts: number;
    }[];
}

export default function OverviewTab() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const res = await fetch("/api/admin/analytics");
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
                ))}
            </div>
        );
    }

    if (!data) {
        return <div className="text-red-400 p-4 border border-red-900/50 bg-red-900/10 rounded-xl">Failed to load analytics data.</div>;
    }

    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                    title="Total Users"
                    value={data.counts.users}
                    icon={Users}
                    trend={`+${data.recentGrowth.users}`}
                    color="violet"
                />
                <SummaryCard
                    title="Total Prompts"
                    value={data.counts.prompts}
                    icon={MessageSquare}
                    trend={`+${data.recentGrowth.prompts}`}
                    color="indigo"
                />
                <SummaryCard
                    title="Active Sessions"
                    value={data.counts.sessions}
                    icon={FileText}
                    subtext="Total chat sessions"
                    color="blue"
                />
                <SummaryCard
                    title="Library Items"
                    value={data.counts.library}
                    icon={Database}
                    subtext="Public templates"
                    color="emerald"
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-8 bg-[#0F0F12] border-white/5 shadow-2xl rounded-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center">
                        User Growth
                        <span className="ml-2 text-xs text-violet-400 bg-violet-400/10 px-2 py-1 rounded-full">30 Days</span>
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.dailyActivity}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#52525b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => {
                                        const date = new Date(value);
                                        return `${date.getDate()}/${date.getMonth() + 1}`;
                                    }}
                                    minTickGap={30}
                                />
                                <YAxis stroke="#52525b" fontSize={12} allowDecimals={false} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", color: "#F3F4F6", borderRadius: "8px" }}
                                    labelStyle={{ color: "#9CA3AF" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#8B5CF6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorUsers)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-8 bg-[#0F0F12] border-white/5 shadow-2xl rounded-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center">
                        Prompt Activity
                        <span className="ml-2 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">30 Days</span>
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.dailyActivity}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#52525b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => {
                                        const date = new Date(value);
                                        return `${date.getDate()}/${date.getMonth() + 1}`;
                                    }}
                                    minTickGap={30}
                                />
                                <YAxis stroke="#52525b" fontSize={12} allowDecimals={false} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                    contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", color: "#F3F4F6", borderRadius: "8px" }}
                                    labelStyle={{ color: "#9CA3AF" }}
                                />
                                <Bar dataKey="prompts" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, icon: Icon, trend, subtext, color }: any) {
    const colorClasses: any = {
        violet: "bg-violet-500/10 text-violet-400",
        indigo: "bg-indigo-500/10 text-indigo-400",
        blue: "bg-blue-500/10 text-blue-400",
        emerald: "bg-emerald-500/10 text-emerald-400"
    };

    return (
        <Card className="p-6 bg-[#0F0F12] border-white/5 hover:border-white/10 transition-all duration-300 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${colorClasses[color]?.replace('text', 'bg').replace('/10', '/30')}`} />

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <h3 className="text-3xl font-bold text-white mt-3 tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>

            <div className="mt-4 flex items-center text-xs relative z-10">
                {trend ? (
                    <span className="text-emerald-400 flex items-center font-medium bg-emerald-400/10 px-2 py-0.5 rounded-full">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        {trend}
                    </span>
                ) : (
                    <span className="text-gray-500 font-medium px-2 py-0.5">{subtext}</span>
                )}
                {trend && <span className="text-gray-500 ml-2">vs last 30 days</span>}
            </div>
        </Card>
    );
}
