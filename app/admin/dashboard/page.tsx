"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, List, BarChart3 } from "lucide-react";
import MostUsedPromptsTab from "@/components/admin/MostUsedPromptsTab";
import UsersTab from "@/components/admin/UsersTab";
import PromptsTab from "@/components/admin/PromptsTab";

const tabs = [
  { id: "users", name: "Users", icon: Users },
  { id: "total-prompts", name: "Total Prompts", icon: List },
  // { id: "most-used-prompts", name: "Most Used Prompts", icon: BarChart3 },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("users");

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 bg-gray-900 flex flex-col">
        <div className="px-6 py-4 text-xl font-bold border-b border-gray-800">⚡ PromptOS Admin</div>
        <nav className="flex-1">
          {tabs.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex items-center w-full px-6 py-3 text-sm transition-all ${
                active === id ? "bg-gray-800 text-white font-semibold" : "hover:bg-gray-800"
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {active === "users" && <UsersTab />}
          {active === "total-prompts" && <PromptsTab />}
          {/* {active === "most-used-prompts" && <MostUsedPromptsTab />} */}
        </motion.div>
      </main>
    </div>
  );
}
