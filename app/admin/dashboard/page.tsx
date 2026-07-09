'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  BarChart3,
  TrendingUp,
  LayoutDashboard,
  LogOut,
  BookOpen,
  Activity,
  ArrowLeft,
  Bell,
  BellRing,
  Terminal as TerminalIcon,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const OverviewTab = dynamic(() => import('@/components/admin/OverviewTab'), {
  ssr: false,
  loading: () => <WidgetSkeleton />,
});
const UsersTab = dynamic(() => import('@/components/admin/UsersTab'), {
  ssr: false,
  loading: () => <WidgetSkeleton />,
});
const PromptsTab = dynamic(() => import('@/components/admin/PromptsTab'), {
  ssr: false,
  loading: () => <WidgetSkeleton />,
});
const MostUsedPromptsTab = dynamic(() => import('@/components/admin/MostUsedPromptsTab'), {
  ssr: false,
  loading: () => <WidgetSkeleton />,
});
const LibraryTab = dynamic(() => import('@/components/admin/LibraryTab'), {
  ssr: false,
  loading: () => <WidgetSkeleton />,
});
const ScoresTab = dynamic(() => import('@/components/admin/ScoresTab'), {
  ssr: false,
  loading: () => <WidgetSkeleton />,
});

function WidgetSkeleton() {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center space-y-4 animate-pulse bg-[#050505] border border-emerald-500/10 rounded-[2rem]">
      <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-spin" />
      <span className="text-xs font-mono text-emerald-500/40">CALCULATING STREAM MATRIX...</span>
    </div>
  );
}

const tabs = [
  { id: 'overview', name: 'Overview', icon: LayoutDashboard },
  { id: 'users', name: 'Users', icon: Users },
  { id: 'total-prompts', name: 'Contributors', icon: BarChart3 },
  { id: 'most-used-prompts', name: 'Trending', icon: TrendingUp },
  { id: 'library', name: 'Library', icon: BookOpen },
  { id: 'scores', name: 'Quality', icon: Activity },
];

export default function AdminDashboard() {
  const [active, setActive] = useState('overview');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [liveTime, setLiveTime] = useState('');

  useEffect(() => {
    // Fetch notifications (Optimized with query limit)
    fetch('/api/admin/users?limit=5')
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data || []);
      })
      .catch((err) => console.error('Could not fetch notifications', err));

    // Live counter clock for terminal aesthetic
    const timer = setInterval(() => {
      const d = new Date();
      setLiveTime(d.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen bg-black text-gray-100 overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Dynamic Futuristic Floating Dock (Left side, minimal, rounded glass) */}
      <div className="p-4 flex items-center justify-center shrink-0 z-30">
        <aside className="h-[96vh] w-20 xl:w-64 bg-[#050505]/70 border border-emerald-500/10 rounded-[2rem] flex flex-col justify-between items-center xl:items-stretch p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300">
          {/* Logo & Operational ID */}
          <div className="flex flex-col items-center xl:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-black border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)] group hover:border-emerald-400 transition-colors">
                <TerminalIcon className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="hidden xl:block">
                <h1 className="font-black text-sm tracking-tight text-white leading-none">
                  PROMPT.OPS
                </h1>
                <span className="text-[9px] text-emerald-500 font-mono tracking-widest uppercase mt-1 block">
                  CORE_BRIDGE
                </span>
              </div>
            </div>
            <div className="hidden xl:block w-full border-b border-emerald-950/60 my-2" />
          </div>

          {/* Navigation Hub */}
          <nav className="flex-1 w-full space-y-2 mt-8">
            {tabs.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex items-center justify-center xl:justify-start w-full p-3.5 rounded-2xl text-xs transition-all duration-300 group relative overflow-hidden ${
                  active === id ? 'text-emerald-400 font-bold' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <div
                  className={`p-2 rounded-xl transition-all duration-300 relative z-10 ${active === id ? 'bg-emerald-950/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-transparent group-hover:bg-emerald-950/10 group-hover:text-emerald-400'}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="hidden xl:block ml-3 relative z-10 tracking-wide font-mono uppercase text-[10px]">
                  {name}
                </span>
                {active === id && (
                  <motion.div
                    layoutId="dockTabIndicator"
                    className="absolute inset-0 bg-[#0a0f0a] border border-emerald-500/10 rounded-2xl -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Dock Footer / System Actions */}
          <div className="w-full flex flex-col gap-2">
            <div className="hidden xl:block w-full border-b border-emerald-950/60 my-2" />
            <Link href="/" passHref className="w-full">
              <Button
                variant="ghost"
                className="w-full justify-center xl:justify-start text-gray-500 hover:text-emerald-400 hover:bg-emerald-950/10 p-2.5 rounded-2xl"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <span className="hidden xl:block ml-2 text-[10px] uppercase font-mono tracking-wider">
                  Client View
                </span>
              </Button>
            </Link>
            <button
              onClick={async () => {
                await fetch('/api/admin/logout', { method: 'POST' });
                window.location.href = '/admin';
              }}
              className="w-full flex items-center justify-center xl:justify-start text-rose-500/70 hover:text-rose-400 hover:bg-rose-950/20 p-3 rounded-2xl transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="hidden xl:block ml-2 text-[10px] uppercase font-mono tracking-wider">
                Terminate
              </span>
            </button>
          </div>
        </aside>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative p-4 pl-0">
        {/* Glow backdrop overlay */}
        <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-emerald-950/[0.03] blur-[150px] pointer-events-none rounded-full" />

        {/* Header HUD panel */}
        <header className="h-16 bg-[#050505]/40 border border-emerald-500/10 rounded-[1.5rem] flex items-center justify-between px-6 backdrop-blur-md z-20 shrink-0 mb-4 shadow-xl">
          <div className="flex items-center gap-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-emerald-400 uppercase">
              <span>SYSTEM ONLINE</span>
              <span className="text-gray-700">|</span>
              <span className="text-gray-400">{liveTime}</span>
            </div>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className={`text-gray-400 hover:text-emerald-400 hover:bg-emerald-950/10 transition-all rounded-xl ${showNotifications ? 'bg-emerald-950/20 text-emerald-400' : ''}`}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              {notifications.length > 0 ? (
                <BellRing className="h-4 w-4 text-emerald-400 animate-pulse" />
              ) : (
                <Bell className="h-4 w-4" />
              )}
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              )}
            </Button>

            {/* Notification Overlay Panel */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-3 w-80 bg-black border border-emerald-500/15 shadow-2xl rounded-2xl overflow-hidden z-50 backdrop-blur-3xl"
                >
                  <div className="p-3 border-b border-emerald-950/40 bg-emerald-950/10 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
                      Recent Signups
                    </p>
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                      NEW
                    </span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-3.5 border-b border-emerald-950/10 hover:bg-emerald-950/5 transition-colors flex items-start gap-3"
                        >
                          <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                            <Users className="h-3.5 w-3.5 text-emerald-400" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs text-white font-bold truncate">
                              {n.name || 'Anonymous User'}
                            </p>
                            <p className="text-[9px] text-gray-500 font-mono truncate max-w-[210px]">
                              {n.email}
                            </p>
                            <p className="text-[8px] text-emerald-500/60 font-mono mt-1">
                              + Registered Successfully
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-gray-600 font-mono">
                        No telemetry events.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Dynamic Inner Tab View */}
        <div className="flex-1 w-full relative overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full min-h-full"
            >
              {active === 'overview' && <OverviewTab />}
              {active === 'users' && <UsersTab />}
              {active === 'total-prompts' && <PromptsTab />}
              {active === 'most-used-prompts' && <MostUsedPromptsTab />}
              {active === 'library' && <LibraryTab />}
              {active === 'scores' && <ScoresTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
