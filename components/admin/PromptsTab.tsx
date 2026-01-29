"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { User, MessageSquare } from "lucide-react";

export default function PromptsTab() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/admin/prompts-by-user")
      .then((res) => res.json())
      .then(setPrompts);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 bg-white/5 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
        Top Contributors <span className="text-white/40 text-sm font-medium ml-2">By Prompt Volume</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {prompts?.map((row) => (
          <Card
            key={row.user_id}
            className="group relative p-6 bg-[#0F0F12] border-white/5 hover:border-emerald-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex flex-col items-center gap-4 relative z-10">
              <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                <div className="w-full h-full rounded-full overflow-hidden relative bg-black">
                  {row?.user_image ? (
                    <Image
                      src={row.user_image}
                      alt={row?.user_name || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
                      <User className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-black border border-white/10 p-1.5 rounded-full">
                  <MessageSquare className="h-3 w-3 text-emerald-400" />
                </div>
              </div>

              <div className="text-center">
                <p className="font-semibold text-white group-hover:text-emerald-300 transition-colors truncate max-w-[200px]">
                  {row.user_name || "Unknown User"}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[200px]">
                  {row.user_email}
                </p>
              </div>

              <div className="w-full pt-4 border-t border-white/5 mt-2">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {row.prompt_count}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium mt-1">
                    Prompts Created
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
