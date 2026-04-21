"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, BarChart3, TrendingUp, LayoutDashboard, LogOut, BookOpen, Activity, ArrowLeft, Bell, BellRing } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const OverviewTab = dynamic(() => import("@/components/admin/OverviewTab"), { ssr: false, loading: () => <WidgetSkeleton /> });
const UsersTab = dynamic(() => import("@/components/admin/UsersTab"), { ssr: false, loading: () => <WidgetSkeleton /> });
const PromptsTab = dynamic(() => import("@/components/admin/PromptsTab"), { ssr: false, loading: () => <WidgetSkeleton /> });
const MostUsedPromptsTab = dynamic(() => import("@/components/admin/MostUsedPromptsTab"), { ssr: false, loading: () => <WidgetSkeleton /> });
const LibraryTab = dynamic(() => import("@/components/admin/LibraryTab"), { ssr: false, loading: () => <WidgetSkeleton /> });
const ScoresTab = dynamic(() => import("@/components/admin/ScoresTab"), { ssr: false, loading: () => <WidgetSkeleton /> });

function WidgetSkeleton() {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center space-y-4 animate-pulse bg-white/5 border border-white/5 rounded-2xl`}>
      <div className="h-10 w-10 rounded-full bg-orange-500/10" />
    </div>
  );
}

const tabs = [
  { id: "overview", name: "System Core", icon: LayoutDashboard },
  { id: "users", name: "User Directory", icon: Users },
  { id: "total-prompts", name: "Top Contributors", icon: BarChart3 },
  { id: "most-used-prompts", name: "Trending", icon: TrendingUp },
  { id: "library", name: "Asset Library", icon: BookOpen },
  { id: "scores", name: "Quality Engine", icon: Activity },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Fetch notifications representing "new users"
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => {
        // Sort effectively to get the latest signups
        const recent = data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
        setNotifications(recent);
      }).catch(err => console.error("Could not fetch notifications", err));
  }, []);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-100 overflow-hidden font-sans selection:bg-orange-500/30">
      
      {/* Massive Glass Sidebar */}
      <aside className="w-72 bg-[#111111]/80 backdrop-blur-2xl border-r border-white/5 flex flex-col relative z-20 shadow-2xl">
        <div className="p-8 pb-6">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                <span className="text-xl font-bold text-white">OS</span>
             </div>
             <div>
               <h1 className="font-bold text-lg tracking-tight leading-none text-white">Central Ops</h1>
               <span className="text-[10px] text-orange-400 font-mono tracking-widest uppercase mt-1 block">Terminal</span>
             </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {tabs.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex items-center w-full px-4 py-3.5 rounded-xl text-[14px] transition-all duration-300 group relative overflow-hidden ${
                  active === id
                  ? "text-white font-medium shadow-md shadow-black/20"
                  : "text-gray-400 hover:text-white"
                }`}
            >
              <div className={`mr-3 p-1.5 rounded-lg transition-colors relative z-10 ${active === id ? "bg-orange-500/20 text-orange-400" : "bg-transparent group-hover:bg-white/5"}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="relative z-10">{name}</span>
              {active === id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-white/10 border border-white/5 rounded-xl -z-10"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2 bg-black/40">
          <Link href="/" passHref>
            <Button variant="ghost" className="w-full justify-start text-gray-500 hover:text-white hover:bg-white/5">
              <ArrowLeft className="mr-3 h-4 w-4" />
              Back to Client
            </Button>
          </Link>
          <Link href="/admin" passHref>
            <Button variant="ghost" className="w-full justify-start text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10">
              <LogOut className="mr-3 h-4 w-4" />
              Terminate Session
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 relative flex flex-col bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] overflow-hidden">
        {/* Top Header / Notification Bar */}
        <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-8 relative z-20 shrink-0">
           <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono tracking-wider text-emerald-400 uppercase">System Optimal</span>
           </div>

           <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`text-gray-400 hover:text-white hover:bg-white/5 transition-all ${showNotifications ? 'bg-white/5 text-white' : ''}`}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                {notifications.length > 0 ? <BellRing className="h-5 w-5 text-orange-400 animate-pulse" /> : <Bell className="h-5 w-5" />}
                {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />}
              </Button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-[#111] border border-white/10 shadow-2xl rounded-2xl overflow-hidden"
                  >
                    <div className="p-3 border-b border-white/5 bg-black/40">
                       <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">Recent Registrations</p>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {notifications.length > 0 ? notifications.map(n => (
                        <div key={n.id} className="p-3 border-b border-white/5 hover:bg-white/5 transition-colors flex items-start gap-3">
                           <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center shrink-0 border border-white/5">
                             <Users className="h-3 w-3 text-indigo-400" />
                           </div>
                           <div>
                             <p className="text-sm text-white font-medium">{n.name || 'Anonymous User'}</p>
                             <p className="text-[10px] text-gray-500 font-mono truncate max-w-[200px]">{n.email}</p>
                             <p className="text-[9px] text-emerald-400 font-mono mt-1">+ Account Created</p>
                           </div>
                        </div>
                      )) : (
                        <div className="p-4 text-center text-xs text-gray-500">No recent activity detected.</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </header>

        {/* Ambient Underglow */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-600/5 blur-[120px] pointer-events-none rounded-full" />
        
        {/* Massive Dynamic Component Render Container (Takes remaining space) */}
        <div className="flex-1 w-full h-full relative p-6 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full min-h-full"
            >
              {active === "overview" && <OverviewTab />}
              {active === "users" && <UsersTab />}
              {active === "total-prompts" && <PromptsTab />}
              {active === "most-used-prompts" && <MostUsedPromptsTab />}
              {active === "library" && <LibraryTab />}
              {active === "scores" && <ScoresTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
