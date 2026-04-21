"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User, MessageSquare, Trophy } from "lucide-react";

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
      <div className="h-full min-h-[500px] w-full flex items-center justify-center animate-pulse">
        <div className="h-full w-full bg-white/5 rounded-xl border border-white/5"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-100 pointer-events-none rounded-xl" />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 relative z-10 gap-2">
        <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                 <Trophy className="h-4 w-4 text-emerald-400" />
             </div>
             <div>
                <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 leading-none">
                    Top Contributors
                </h2>
                <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Leaderboard</span>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 overflow-y-auto custom-scrollbar p-6 relative z-10 w-full bg-black/10 flex-1">
        {prompts?.map((row, index) => (
          <div
            key={row.user_id}
            className="group relative flex flex-col p-6 bg-black/40 border border-white/5 hover:border-emerald-500/30 overflow-hidden transition-all duration-300 rounded-2xl shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] justify-between h-[180px]"
          >
            <div className="absolute top-0 right-0 p-12 rounded-full bg-emerald-500/5 blur-[25px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute right-0 -bottom-4 text-[100px] font-black font-mono text-white/[0.02] tracking-tighter leading-none z-0 pointer-events-none group-hover:text-emerald-500/[0.04] group-hover:scale-105 transition-all duration-700 select-none">#{index+1}</div>

            <div className="flex items-start justify-between relative z-10">
               <div className="relative w-14 h-14 rounded-2xl p-0.5 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] z-10 shrink-0 group-hover:scale-105 transition-transform duration-300">
                 <div className="w-full h-full rounded-2xl overflow-hidden relative bg-black border border-white/10">
                   {row?.user_image ? (
                     <Image
                       src={row.user_image}
                       alt={row?.user_name || "User"}
                       fill
                       className="object-cover"
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-[#0F0F12] text-gray-400">
                       <User className="h-6 w-6" />
                     </div>
                   )}
                 </div>
               </div>
               {index === 0 && (
                 <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                   <Trophy className="h-3 w-3 text-yellow-500" />
                   <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">Top</span>
                 </div>
               )}
            </div>

            <div className="z-10 mt-auto">
              <h3 className="font-bold text-lg text-white/90 group-hover:text-emerald-300 transition-colors truncate">
                {row.user_name || "Anonymous Developer"}
              </h3>
              
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                 <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3 text-emerald-500" />
                    <span className="text-gray-500 text-xs font-medium tracking-wide">Prompts Authored</span>
                 </div>
                 <div className="flex items-baseline gap-1">
                    <span className="text-emerald-400 font-black font-mono text-xl">{row.prompt_count}</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
