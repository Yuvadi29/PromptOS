'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, BookOpen, Clock, Activity } from 'lucide-react';
import Image from 'next/image';

export default function LibraryTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/library')
      .then((res) => res.json())
      .then((data) => {
        setItems(data || []);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="h-full min-h-[500px] w-full flex items-center justify-center animate-pulse">
        <div className="h-full w-full bg-emerald-950/10 rounded-xl border border-emerald-950/40"></div>
      </div>
    );

  return (
    <div className="flex flex-col h-full relative min-h-[500px]">
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-100 pointer-events-none rounded-xl" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <BookOpen className="h-4 w-4 text-emerald-400" />
          </div>
          <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-400 font-mono uppercase tracking-wide">
            Public Asset Library
          </h2>
        </div>
        <Badge
          variant="outline"
          className="border-emerald-500/30 text-emerald-300 bg-emerald-500/10 font-mono text-[9px] uppercase tracking-wider"
        >
          <Activity className="h-3 w-3 mr-1" />
          {items.length} INDEXED
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar p-6 relative z-10 flex-1 max-h-none bg-black/10">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col p-6 bg-[#050505] border border-emerald-500/10 hover:border-emerald-500/30 overflow-hidden transition-all duration-300 rounded-3xl shadow-xl hover:shadow-[0_0_40px_rgba(16,185,129,0.08)] justify-between min-h-[220px]"
          >
            <div className="absolute top-0 right-0 p-20 rounded-full bg-emerald-500/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Header: Niche & Votes */}
            <div className="flex items-start justify-between mb-4 relative z-10">
              <Badge
                variant="outline"
                className="border-emerald-500/20 text-emerald-300 bg-emerald-500/10 text-[9px] px-2.5 py-0.5 uppercase tracking-widest font-mono font-bold shadow-inner"
              >
                {item.niche}
              </Badge>
              <div className="flex items-center gap-3 text-[10px] text-gray-550 font-mono bg-black/40 px-2 py-1 rounded-lg border border-emerald-500/10">
                <span className="flex items-center gap-1 group-hover:text-emerald-400 transition-colors">
                  <ThumbsUp className="h-3 w-3" /> {item.likes || 0}
                </span>
                <span className="text-white/5">|</span>
                <span className="flex items-center gap-1 group-hover:text-rose-400 transition-colors">
                  <ThumbsDown className="h-3 w-3" /> {item.dislikes || 0}
                </span>
              </div>
            </div>

            {/* Middle: Title & Content */}
            <div className="relative z-10 flex-1 flex flex-col">
              <h3 className="font-bold text-md text-white mb-2 line-clamp-1 group-hover:text-emerald-400 transition-colors tracking-wide font-mono uppercase">
                {item.prompt_title}
              </h3>
              <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed flex-1">
                {item.prompt_description}
              </p>

              {/* Inner Code Preview Card */}
              <div className="mt-2 mb-4 p-3 rounded-xl bg-black border border-emerald-500/10 group-hover:border-emerald-500/20 transition-colors relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/20 group-hover:bg-emerald-500/80 transition-colors" />
                <p className="text-[10px] font-mono text-gray-500 line-clamp-2 leading-loose">
                  {item.promptText || item.prompt_value || 'No generic prompt code detected...'}
                </p>
              </div>
            </div>

            {/* Footer: User & Time */}
            <div className="flex items-center justify-between pt-4 border-t border-emerald-500/10 mt-auto relative z-10">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 overflow-hidden relative border border-emerald-500/10 shadow-inner group-hover:scale-110 transition-transform">
                  {item.users?.image ? (
                    <Image
                      src={item.users.image}
                      alt={item.users.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-white">
                      {item.users?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-gray-300 tracking-wide truncate max-w-[100px] group-hover:text-white transition-colors">
                  {item.users?.name || 'Unknown'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-gray-550 font-mono font-semibold">
                <Clock className="h-3 w-3 group-hover:text-emerald-400 transition-colors" />
                {item.created_at
                  ? new Date(item.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
