'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
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
} from 'recharts';
import {
  Users,
  MessageSquare,
  Database,
  Activity as ActivityIcon,
  Fingerprint,
  ThumbsUp,
  Compass,
  Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalyticsData {
  counts: {
    users: number;
    prompts: number;
    sessions: number;
    library: number;
    likes: number;
    dislikes: number;
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
  nicheStats: {
    niche: string;
    count: number;
  }[];
}

export default function OverviewTab() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCore, setActiveCore] = useState<'prompts' | 'users' | 'avgPrompts' | 'library'>(
    'prompts'
  );

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/admin/analytics');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse p-2 h-full">
        <div className="md:col-span-4 h-[380px] bg-[#050505] rounded-3xl border border-emerald-500/10"></div>
        <div className="md:col-span-4 h-64 bg-[#050505] rounded-2xl border border-emerald-500/10 mt-4"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-red-400 p-4 border border-red-950/50 bg-red-950/10 rounded-xl font-mono">
        Failed to load telemetry stats.
      </div>
    );
  }

  const coreDataConfig = {
    prompts: {
      title: 'Total Output Prompts',
      value: data.counts.prompts,
      trend: `+${data.recentGrowth.prompts} today`,
      color: 'from-emerald-500',
      glow: 'bg-emerald-500/20',
      icon: MessageSquare,
    },
    users: {
      title: 'Registered Users',
      value: data.counts.users,
      trend: `+${data.recentGrowth.users} this week`,
      color: 'from-green-500',
      glow: 'bg-green-500/20',
      icon: Users,
    },
    avgPrompts: {
      title: 'Avg Prompts / User',
      value:
        data.counts.users > 0 ? Number((data.counts.prompts / data.counts.users).toFixed(1)) : 0,
      trend: 'High Engagement',
      color: 'from-teal-500',
      glow: 'bg-teal-500/20',
      icon: ActivityIcon,
    },
    library: {
      title: 'Global Asset Library',
      value: data.counts.library,
      trend: 'Expanding Asset Pool',
      color: 'from-lime-500',
      glow: 'bg-lime-500/20',
      icon: Database,
    },
  };

  const currentCore = coreDataConfig[activeCore];
  const CoreIcon = currentCore.icon;

  // Calculate upvote sentiment metrics
  const totalFeedback = data.counts.likes + data.counts.dislikes;
  const likePercent = totalFeedback > 0 ? Math.round((data.counts.likes / totalFeedback) * 100) : 0;
  const dislikePercent =
    totalFeedback > 0 ? Math.round((data.counts.dislikes / totalFeedback) * 100) : 0;

  return (
    <div className="flex flex-col space-y-6 w-full h-full pb-8">
      {/* ROW 1: System Core Dynamic Node */}
      <div className="w-full relative h-auto xl:h-[380px] rounded-[-2rem] shrink-0">
        <Card className="absolute inset-0 bg-[#050505] border border-emerald-500/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col xl:flex-row">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCore}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className={`absolute inset-0 bg-gradient-to-br ${currentCore.color} to-transparent opacity-5 pointer-events-none mix-blend-screen`}
            />
          </AnimatePresence>

          {/* Main Stats Node */}
          <div className="flex-1 p-12 relative flex flex-col justify-center border-b xl:border-b-0 xl:border-r border-emerald-500/10">
            <div className="absolute top-8 left-12 flex items-center gap-3">
              <Fingerprint className="h-4 w-4 text-emerald-400" />
              <span className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-mono font-bold">
                System Telemetry Matrix
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCore}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="mt-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`p-3 rounded-2xl border border-emerald-500/20 backdrop-blur-md ${currentCore.glow}`}
                  >
                    <CoreIcon className="h-7 w-7 text-emerald-400" />
                  </div>
                  <h2 className="text-xl xl:text-2xl font-bold tracking-tight text-white font-mono">
                    {currentCore.title}
                  </h2>
                </div>
                <div className="flex items-end gap-6">
                  <h1 className="text-[5.5rem] xl:text-[7.5rem] font-black tracking-tighter leading-none text-emerald-400 drop-shadow-2xl font-mono">
                    {currentCore.value.toLocaleString()}
                  </h1>
                  <div className="mb-4 xl:mb-8 px-4.5 py-2.5 rounded-xl bg-black/80 border border-emerald-500/10 text-xs font-bold text-emerald-400/80 font-mono">
                    {currentCore.trend}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Selectors Panel */}
          <div className="w-full xl:w-[380px] shrink-0 p-8 xl:p-10 bg-black/40 flex flex-col justify-center space-y-3.5">
            <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono font-bold mb-1">
              Toggle System Core Array
            </span>
            {(Object.keys(coreDataConfig) as Array<keyof typeof coreDataConfig>).map((key) => {
              const isSelected = activeCore === key;
              const config = coreDataConfig[key];
              const BtnIcon = config.icon;

              return (
                <button
                  key={key}
                  onClick={() => setActiveCore(key)}
                  onMouseEnter={() => setActiveCore(key)}
                  className={`relative flex items-center justify-between w-full p-3.5 rounded-2xl border transition-all duration-300 text-left overflow-hidden group ${
                    isSelected
                      ? 'bg-emerald-950/20 border-emerald-500/30 shadow-xl'
                      : 'bg-[#050505] border-emerald-500/5 hover:bg-emerald-950/5 hover:border-emerald-500/20'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="selectionGlow"
                      className={`absolute inset-0 bg-gradient-to-r ${config.color} to-transparent opacity-20 -z-10`}
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl ${isSelected ? config.glow : 'bg-emerald-950/10'} transition-colors`}
                    >
                      <BtnIcon
                        className={`h-4 w-4 ${isSelected ? 'text-emerald-400' : 'text-gray-500'}`}
                      />
                    </div>
                    <span
                      className={`font-semibold font-mono text-xs uppercase tracking-wider transition-colors ${isSelected ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'}`}
                    >
                      {key === 'avgPrompts' ? 'Avg Eng' : key}
                    </span>
                  </div>
                  <span
                    className={`text-lg font-black font-mono tracking-tighter ${isSelected ? 'text-emerald-400' : 'text-gray-700'}`}
                  >
                    {config.value > 999 ? (config.value / 1000).toFixed(1) + 'k' : config.value}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ROW 2 & 3: Live Pulse Graphic & System Analytics */}
      <div className="flex flex-col xl:flex-row gap-6 w-full h-auto xl:min-h-[480px]">
        {/* Left pane: Active Socket Pulse */}
        <Card className="flex-1 p-8 bg-black border border-emerald-500/10 shadow-2xl rounded-[2rem] relative overflow-hidden group flex flex-col h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-duration-1000" />
          <div className="flex items-center justify-between mb-8 relative z-10 shrink-0">
            <div className="flex items-center">
              <ActivityIcon className="h-5 w-5 mr-3 text-emerald-400" />
              <h3 className="text-lg font-bold text-white tracking-tight font-mono uppercase">
                Live Active Socket Pulse
              </h3>
              <span className="ml-4 text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-pulse font-mono">
                60-MIN TIME
              </span>
            </div>
          </div>
          <div className="flex-1 min-h-[280px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.minuteActivity}>
                <defs>
                  <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#14532d"
                  vertical={false}
                  opacity={0.15}
                />
                <XAxis
                  dataKey="time"
                  stroke="#52525b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={40}
                />
                <YAxis
                  stroke="#52525b"
                  fontSize={10}
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(9, 9, 11, 0.95)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    color: '#F3F4F6',
                    borderRadius: '12px',
                    fontFamily: 'monospace',
                  }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPulse)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right stack: Capacity & Frequency charts */}
        <div className="flex flex-col gap-6 w-full xl:w-[420px] shrink-0 h-full">
          <Card className="flex-1 p-6 bg-black border border-emerald-500/10 shadow-2xl rounded-[1.5rem] relative overflow-hidden group flex flex-col">
            <h3 className="text-xs font-semibold text-gray-400 mb-4 flex items-center justify-between relative z-10 shrink-0 font-mono uppercase tracking-wider">
              Hourly Server Capacity
              <span className="text-[9px] text-emerald-500">Last 24h</span>
            </h3>
            <div className="flex-1 min-h-[140px] relative z-10 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.hourlyActivity}>
                  <defs>
                    <linearGradient id="colorHourly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#047857" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    stroke="#52525b"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={30}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(16, 185, 129, 0.03)' }}
                    contentStyle={{
                      backgroundColor: 'rgba(9, 9, 11, 0.95)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      color: '#F3F4F6',
                      borderRadius: '12px',
                      fontFamily: 'monospace',
                    }}
                  />
                  <Bar
                    dataKey="activity"
                    fill="url(#colorHourly)"
                    radius={[4, 4, 0, 0]}
                    barSize={10}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="flex-1 p-6 bg-black border border-emerald-500/10 shadow-2xl rounded-[1.5rem] relative overflow-hidden group flex flex-col">
            <h3 className="text-xs font-semibold text-gray-400 mb-4 flex items-center justify-between relative z-10 shrink-0 font-mono uppercase tracking-wider">
              Aggregate Prompt Creation
              <span className="text-[9px] text-emerald-500">Last 30 Days</span>
            </h3>
            <div className="flex-1 min-h-[140px] relative z-10 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.dailyActivity}>
                  <defs>
                    <linearGradient id="colorPrompts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="#52525b"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                    minTickGap={30}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(9, 9, 11, 0.95)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      color: '#F3F4F6',
                      borderRadius: '12px',
                      fontFamily: 'monospace',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="prompts"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPrompts)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* ROW 4: Asset Niches & Library Sentiment (No Country Data) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full h-auto">
        {/* Niches Breakdown */}
        <Card className="p-8 bg-black border border-emerald-500/10 shadow-2xl rounded-[2rem] flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="flex items-center justify-between mb-6 relative z-10 border-b border-emerald-950/40 pb-4">
            <div className="flex items-center gap-3">
              <Compass className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white tracking-tight font-mono uppercase">
                Asset Niches
              </h3>
            </div>
            <span className="text-[10px] text-emerald-500 font-mono uppercase tracking-wider">
              Categorization Index
            </span>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center">
            {data.nicheStats && data.nicheStats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.nicheStats.slice(0, 6).map((item) => (
                  <div
                    key={item.niche}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/5 border border-emerald-950/40 text-xs"
                  >
                    <span className="text-gray-300 font-medium truncate max-w-[140px]">
                      {item.niche}
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">{item.count} items</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600 italic text-center py-8 font-mono">
                No categories indexed.
              </p>
            )}
          </div>
        </Card>

        {/* Library Sentiment Ratio */}
        <Card className="p-8 bg-black border border-emerald-500/10 shadow-2xl rounded-[2rem] flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="flex items-center justify-between mb-6 relative z-10 border-b border-emerald-950/40 pb-4">
            <div className="flex items-center gap-3">
              <ThumbsUp className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white tracking-tight font-mono uppercase">
                Library Sentiment
              </h3>
            </div>
            <span className="text-[10px] text-emerald-500 font-mono uppercase tracking-wider">
              Community Signal
            </span>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Heart className="h-5 w-5 text-emerald-400 fill-emerald-400/10" />
                <span className="text-sm font-mono text-gray-300">Approval Ratio</span>
              </div>
              <span className="text-3xl font-black font-mono text-emerald-400">{likePercent}%</span>
            </div>

            <div className="space-y-2">
              <div className="h-3 w-full bg-zinc-950 border border-emerald-950/60 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500" style={{ width: `${likePercent}%` }}></div>
                <div
                  className="h-full bg-rose-950/60"
                  style={{ width: `${dislikePercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>Upvotes: {data.counts.likes}</span>
                <span>Downvotes: {data.counts.dislikes}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/5 border border-emerald-950/40 text-center">
              <p className="text-[11px] font-mono text-emerald-400/80">
                Signal Strength: Stable Engagement
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
