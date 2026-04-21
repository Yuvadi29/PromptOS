"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { Card } from "@/components/ui/card";
import { TrendingUp, Sparkles } from "lucide-react";

export default function MostUsedPromptsTab() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/most-used-prompts")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Card className="p-6 bg-[#0F0F12] border-white/5 h-full min-h-[500px] flex items-center justify-center animate-pulse rounded-2xl shadow-2xl">
        <div className="h-full w-full bg-white/5 rounded-xl border border-white/5"></div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#0F0F12] border-white/5 rounded-2xl shadow-2xl overflow-hidden h-full min-h-[500px] flex flex-col group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Widget Header */}
      <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between relative z-10 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)] glow-pulse">
            <TrendingUp className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400 leading-tight">
              Trending Categories
            </h2>
            <p className="text-sm text-gray-400 font-mono flex items-center tracking-widest uppercase mt-1">
               <Sparkles className="h-4 w-4 mr-2 text-orange-500" /> NLP Dynamic Generation
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full p-8 relative z-10 bg-black/10 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data} layout="vertical" margin={{ left: 50, right: 20, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} opacity={0.3} />
            <XAxis type="number" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              dataKey="domain"
              type="category"
              stroke="#e4e4e7"
              fontSize={14}
              fontWeight="bold"
              fontFamily="var(--font-geist-sans), sans-serif"
              tickLine={false}
              axisLine={false}
              width={160}
              tick={{fill: '#e4e4e7', textAnchor: 'end', dx: -10}}
            />
            <Tooltip
              cursor={{ fill: 'rgba(249, 115, 22, 0.05)' }}
              contentStyle={{ backgroundColor: "rgba(24, 24, 27, 0.95)", backdropFilter: "blur(12px)", border: "1px solid rgba(249, 115, 22, 0.3)", color: "#F3F4F6", borderRadius: "12px", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }}
              labelStyle={{ color: "#9CA3AF", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
              itemStyle={{ color: "#fb923c", fontWeight: "900", fontSize: '16px' }}
            />
            <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={32} isAnimationActive={true} animationDuration={1200}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index < 2 ? '#f97316' : '#ea580c'} fillOpacity={0.9} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
