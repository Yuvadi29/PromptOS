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
import { Users, FileText, MessageSquare, Database, ArrowUpRight, Activity as ActivityIcon, Fingerprint, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    hourlyActivity: {
        time: string;
        activity: number;
    }[];
    minuteActivity: {
        time: string;
        requests: number;
    }[];
}

export default function OverviewTab() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeCore, setActiveCore] = useState<"prompts" | "users" | "avgPrompts" | "library">("prompts");

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse p-2 h-full">
                <div className="md:col-span-4 h-[400px] bg-white/5 rounded-3xl border border-white/5"></div>
                <div className="md:col-span-4 h-64 bg-white/5 rounded-2xl border border-white/5 mt-4"></div>
            </div>
        );
    }

    if (!data) {
        return <div className="text-red-400 p-4 border border-red-900/50 bg-red-900/10 rounded-xl">Failed to load analytics data.</div>;
    }

    const coreDataConfig = {
        prompts: {
            title: "Total Output Prompts",
            value: data.counts.prompts,
            trend: `+${data.recentGrowth.prompts} today`,
            color: "from-indigo-500",
            glow: "bg-indigo-500/20",
            icon: MessageSquare,
        },
        users: {
            title: "Registered Users",
            value: data.counts.users,
            trend: `+${data.recentGrowth.users} this week`,
            color: "from-emerald-500",
            glow: "bg-emerald-500/20",
            icon: Users,
        },
        avgPrompts: {
            title: "Avg Prompts / User",
            value: data.counts.users > 0 ? Number((data.counts.prompts / data.counts.users).toFixed(1)) : 0,
            trend: "High Engagement",
            color: "from-rose-500",
            glow: "bg-rose-500/20",
            icon: ActivityIcon,
        },
        library: {
            title: "Global Asset Library",
            value: data.counts.library,
            trend: "Expanding Asset Pool",
            color: "from-cyan-500",
            glow: "bg-cyan-500/20",
            icon: Database,
        }
    };

    const currentCore = coreDataConfig[activeCore];
    const CoreIcon = currentCore.icon;

    return (
        <div className="flex flex-col space-y-6 w-full h-full pb-8">

            {/* ROW 1: Interactive Data Core (Unique Display for Total Data) */}
            <div className="w-full relative h-auto xl:h-[400px] rounded-[-2rem] shrink-0">
                <Card className="absolute inset-0 bg-[#0F0F12] border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col xl:flex-row">
                    {/* Background Ambient Glow locked to active core */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCore}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
                            className={`absolute inset-0 bg-gradient-to-br ${currentCore.color} to-transparent opacity-10 pointer-events-none mix-blend-screen`}
                        />
                    </AnimatePresence>

                    {/* Left/Main Value Hero Section */}
                    <div className="flex-1 p-12 relative flex flex-col justify-center border-b xl:border-b-0 xl:border-r border-white/5">
                        <div className="absolute top-8 left-12 flex items-center gap-3">
                            <Fingerprint className="h-4 w-4 text-gray-100" />
                            <span className="text-xs uppercase tracking-[0.3em] text-gray-100 font-bold">System Core Metrics</span>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCore}
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.05, y: -10 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="mt-8"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`p-3 rounded-2xl border border-white/10 backdrop-blur-md ${currentCore.glow}`}>
                                        <CoreIcon className="h-8 w-8 text-white" />
                                    </div>
                                    <h2 className="text-2xl xl:text-3xl font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-100">
                                        {currentCore.title}
                                    </h2>
                                </div>
                                <div className="flex items-end gap-6">
                                    <h1 className="text-[5rem] xl:text-[8rem] font-black tracking-tighter leading-none text-white drop-shadow-2xl">
                                        {currentCore.value.toLocaleString()}
                                    </h1>
                                    <div className="mb-4 xl:mb-10 px-4 py-2 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm text-sm font-bold text-gray-300">
                                        {currentCore.trend}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Side: Orbital Selectors */}
                    <div className="w-full xl:w-[400px] shrink-0 p-8 xl:p-12 bg-black/20 flex flex-col justify-center space-y-4">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-2">Toggle Core Array</span>
                        {(Object.keys(coreDataConfig) as Array<keyof typeof coreDataConfig>).map((key) => {
                            const isSelected = activeCore === key;
                            const config = coreDataConfig[key];
                            const BtnIcon = config.icon;

                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveCore(key)}
                                    // Make it also trigger on hover for extremely fast fluid exploration like VisionOS
                                    onMouseEnter={() => setActiveCore(key)}
                                    className={`relative flex items-center justify-between w-full p-4 rounded-2xl border transition-all duration-300 text-left overflow-hidden group ${isSelected ? "bg-white/10 border-white/20 shadow-xl" : "bg-black/40 border-white/5 hover:bg-white/5 hover:border-white/10"
                                        }`}
                                >
                                    {isSelected && (
                                        <motion.div layoutId="selectionGlow" className={`absolute inset-0 bg-gradient-to-r ${config.color} to-transparent opacity-20 -z-10`} />
                                    )}
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${isSelected ? config.glow : "bg-white/5"} transition-colors`}>
                                            <BtnIcon className={`h-4 w-4 ${isSelected ? "text-white" : "text-gray-400"}`} />
                                        </div>
                                        <span className={`font-semibold text-sm transition-colors ${isSelected ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>
                                            {config.title}
                                        </span>
                                    </div>
                                    <span className={`text-xl font-bold font-mono tracking-tighter ${isSelected ? "text-white" : "text-gray-600"}`}>
                                        {config.value > 999 ? (config.value / 1000).toFixed(1) + 'k' : config.value}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </Card>
            </div>

            {/* ROW 2 & 3 CONTAINER - Grid setup to make the rest stretch and fit beautifully */}
            <div className="flex flex-col xl:flex-row gap-6 w-full h-auto xl:flex-1 xl:min-h-[600px]">

                {/* Main Pulse Chart -> left side getting extra space */}
                <Card className="flex-1 p-8 bg-[#0F0F12] border-white/5 shadow-2xl rounded-[2rem] relative overflow-hidden group flex flex-col h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-duration-1000" />
                    <div className="flex items-center justify-between mb-8 relative z-10 shrink-0">
                        <div className="flex items-center">
                            <ActivityIcon className="h-6 w-6 mr-3 text-rose-500" />
                            <h3 className="text-xl font-bold text-white tracking-tight">Active Pulse</h3>
                            <span className="ml-4 text-xs font-semibold text-rose-400 bg-rose-400/10 px-3 py-1.5 rounded-full border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse">
                                Under 60 Minutes
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                            </span>
                            <span className="text-sm font-medium text-rose-500">Live Socket Tracking</span>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[300px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.minuteActivity}>
                                <defs>
                                    <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                                        <stop offset="50%" stopColor="#f43f5e" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.5} />
                                <XAxis dataKey="time" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} minTickGap={30} />
                                <YAxis stroke="#52525b" fontSize={11} allowDecimals={false} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: "rgba(24, 24, 27, 0.9)", backdropFilter: "blur(8px)", border: "1px solid rgba(244, 63, 94, 0.2)", color: "#F3F4F6", borderRadius: "12px", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }} itemStyle={{ color: "#f43f5e", fontWeight: "bold" }} labelStyle={{ color: "#9CA3AF", marginBottom: "4px" }} />
                                <Area type="monotone" dataKey="requests" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorPulse)" isAnimationActive={true} animationDuration={1000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Sub-Charts Stacked vertically on the right */}
                <div className="flex flex-col gap-6 w-full xl:w-[450px] shrink-0 h-full">
                    <Card className="flex-1 p-6 bg-[#0F0F12] border-white/5 shadow-2xl rounded-3xl relative overflow-hidden group flex flex-col">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <h3 className="text-md font-semibold text-gray-200 mb-4 flex items-center justify-between relative z-10 shrink-0">
                            24h Server Capacity Usage
                            <span className="text-[10px] text-violet-400/80 uppercase font-mono tracking-wider">Hourly View</span>
                        </h3>
                        <div className="flex-1 min-h-[150px] relative z-10 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.hourlyActivity}>
                                    <defs>
                                        <linearGradient id="colorHourly" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                                            <stop offset="100%" stopColor="#6D28D9" stopOpacity={0.8} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="time" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} minTickGap={20} />
                                    <Tooltip cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }} contentStyle={{ backgroundColor: "rgba(24, 24, 27, 0.9)", backdropFilter: "blur(8px)", border: "1px solid rgba(139, 92, 246, 0.2)", color: "#F3F4F6", borderRadius: "12px" }} labelStyle={{ color: "#9CA3AF" }} />
                                    <Bar dataKey="activity" fill="url(#colorHourly)" radius={[6, 6, 0, 0]} barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="flex-1 p-6 bg-[#0F0F12] border-white/5 shadow-2xl rounded-3xl relative overflow-hidden group flex flex-col">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <h3 className="text-md font-semibold text-gray-200 mb-4 flex items-center justify-between relative z-10 shrink-0">
                            Model Execution Count
                            <span className="text-[10px] text-emerald-400/80 uppercase font-mono tracking-wider">Monthly Aggregate</span>
                        </h3>
                        <div className="flex-1 min-h-[150px] relative z-10 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.dailyActivity}>
                                    <defs>
                                        <linearGradient id="colorPrompts" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => { const date = new Date(value); return `${date.getDate()}/${date.getMonth() + 1}`; }} minTickGap={30} />
                                    <Tooltip contentStyle={{ backgroundColor: "rgba(24, 24, 27, 0.9)", backdropFilter: "blur(8px)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#F3F4F6", borderRadius: "12px" }} labelStyle={{ color: "#9CA3AF" }} />
                                    <Area type="monotone" dataKey="prompts" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorPrompts)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
