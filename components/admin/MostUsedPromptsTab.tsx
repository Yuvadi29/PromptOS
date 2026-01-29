"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

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
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-white/5 rounded-lg"></div>
        <div className="h-[400px] bg-white/5 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-orange-500/10">
          <TrendingUp className="h-6 w-6 text-orange-500" />
        </div>
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400">
          Top Performing Prompts
        </h2>
      </div>

      <Card className="p-8 bg-[#0F0F12] border-white/5 shadow-2xl rounded-2xl relative overflow-hidden">
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
              <XAxis type="number" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                dataKey="domain" // Assuming 'domain' is a decent label, fix if needed based on API response
                type="category"
                stroke="#a1a1aa"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={150}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", color: "#F3F4F6", borderRadius: "8px" }}
                labelStyle={{ color: "#9CA3AF" }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={30}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index < 3 ? '#ec4899' : '#8b5cf6'} fillOpacity={0.8 + (0.2 / (index + 1))} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
