"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, List, BarChart3, TrendingUp, LayoutDashboard, LogOut, BookOpen, Activity, ArrowLeft } from "lucide-react";
import MostUsedPromptsTab from "@/components/admin/MostUsedPromptsTab";
import UsersTab from "@/components/admin/UsersTab";
import PromptsTab from "@/components/admin/PromptsTab";
import OverviewTab from "@/components/admin/OverviewTab";
import LibraryTab from "@/components/admin/LibraryTab";
import ScoresTab from "@/components/admin/ScoresTab";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const tabs = [
  { id: "overview", name: "Overview", icon: LayoutDashboard },
  { id: "users", name: "User Base", icon: Users },
  { id: "total-prompts", name: "Engagement", icon: BarChart3 },
  { id: "most-used-prompts", name: "Top Prompts", icon: TrendingUp },
  { id: "library", name: "Public Library", icon: BookOpen },
  { id: "scores", name: "Quality Scores", icon: Activity },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-100 overflow-hidden font-sans selection:bg-purple-500/30">
      {/* Premium Sidebar */}
      <aside className="w-72 bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col relative z-20">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-xl font-bold">⚡</span>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">PromptOS</h1>
              <span className="text-xs text-gray-500 text-medium uppercase tracking-wider">Admin Suite</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {tabs.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex items-center w-full px-4 py-3.5 rounded-xl text-sm transition-all duration-300 md:text-[15px] group relative overflow-hidden ${active === id
                  ? "bg-white/10 text-white font-medium shadow-md border border-white/5"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <div className={`mr-3 p-1.5 rounded-lg transition-colors ${active === id ? "bg-violet-500/20 text-violet-300" : "bg-transparent group-hover:bg-gray-800"}`}>
                <Icon className="h-5 w-5" />
              </div>
              {name}
              {active === id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-blue-600/10 rounded-xl -z-10"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link href="/" passHref>
            <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5">
              <ArrowLeft className="mr-3 h-4 w-4" />
              Back to App
            </Button>
          </Link>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 relative overflow-y-auto bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0f0f12]">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-violet-600/5 blur-[120px] pointer-events-none" />

        <div className="p-8 max-w-7xl mx-auto relative z-10">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {tabs.find(t => t.id === active)?.name}
              </h2>
              <p className="text-gray-500 text-sm mt-1">Real-time insights and management</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-emerald-400 font-medium">System Online</span>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
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
