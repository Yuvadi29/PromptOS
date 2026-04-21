"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, BookOpen, Clock, Activity } from "lucide-react";
import Image from "next/image";

export default function LibraryTab() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/library")
            .then((res) => res.json())
            .then((data) => {
                setItems(data);
                setLoading(false);
            });
    }, []);

    if (loading) return (
      <div className="h-full min-h-[500px] w-full flex items-center justify-center animate-pulse">
        <div className="h-full w-full bg-white/5 rounded-xl border border-white/5"></div>
      </div>
    );

    return (
        <div className="flex flex-col h-full relative min-h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 to-transparent opacity-100 pointer-events-none rounded-xl" />

            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                     <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                         <BookOpen className="h-4 w-4 text-pink-400" />
                     </div>
                     <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">
                         Public Asset Library
                     </h2>
                </div>
                <Badge variant="outline" className="border-pink-500/30 text-pink-300 bg-pink-500/10">
                    <Activity className="h-3 w-3 mr-1" />
                    {items.length} Published
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar p-6 relative z-10 flex-1 max-h-none bg-black/10">
                {items.map((item) => (
                    <div key={item.id} className="group relative flex flex-col p-6 bg-black/40 border border-white/5 hover:border-pink-500/30 overflow-hidden transition-all duration-300 rounded-3xl shadow-xl hover:shadow-[0_0_40px_rgba(236,72,153,0.15)] justify-between min-h-[220px]">
                        <div className="absolute top-0 right-0 p-20 rounded-full bg-pink-500/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        
                        {/* Header: Niche & Votes */}
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <Badge variant="outline" className="border-pink-500/20 text-pink-300 bg-pink-500/10 text-[10px] px-3 py-1 uppercase tracking-widest font-bold shadow-inner">
                                {item.niche}
                            </Badge>
                            <div className="flex items-center gap-3 text-xs text-gray-400 font-mono bg-black/20 px-2 py-1 rounded-lg border border-white/5">
                                <span className="flex items-center gap-1 group-hover:text-emerald-400 transition-colors"><ThumbsUp className="h-3 w-3" /> {item.likes || 0}</span>
                                <span className="text-white/10">|</span>
                                <span className="flex items-center gap-1 group-hover:text-rose-400 transition-colors"><ThumbsDown className="h-3 w-3" /> {item.dislikes || 0}</span>
                            </div>
                        </div>

                        {/* Middle: Title & Content */}
                        <div className="relative z-10 flex-1 flex flex-col">
                            <h3 className="font-black text-lg text-white mb-2 line-clamp-1 group-hover:text-pink-400 transition-colors tracking-tight">{item.prompt_title}</h3>
                            <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed flex-1">{item.prompt_description}</p>
                            
                            {/* Inner Code Preview Card */}
                            <div className="mt-2 mb-4 p-3 rounded-xl bg-black/60 border border-white/5 group-hover:border-white/10 transition-colors relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500/20 group-hover:bg-pink-500/80 transition-colors" />
                                <p className="text-[10px] font-mono text-gray-500 line-clamp-2 leading-loose">
                                    {item.prompt_value || "No generic prompt code detected..."}
                                </p>
                            </div>
                        </div>

                        {/* Footer: User & Time */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto relative z-10">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 overflow-hidden relative border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                                    {item.users?.image ? (
                                        <Image src={item.users.image} alt={item.users.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-white">
                                            {item.users?.name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs font-bold text-gray-300 tracking-wide truncate max-w-[100px] group-hover:text-white transition-colors">{item.users?.name || "Unknown"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-mono font-semibold">
                                <Clock className="h-3 w-3 group-hover:text-pink-400 transition-colors" />
                                {new Date(item.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
