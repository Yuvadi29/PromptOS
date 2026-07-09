'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { TrendingUp, Sparkles } from 'lucide-react';

export default function MostUsedPromptsTab() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/most-used-prompts')
      .then((res) => res.json())
      .then((data) => {
        setData(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Card className="p-6 bg-[#050505] border border-emerald-500/10 h-full min-h-[500px] flex items-center justify-center animate-pulse rounded-2xl shadow-2xl">
        <div className="h-full w-full bg-emerald-950/10 rounded-xl border border-emerald-950/40"></div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#050505] border border-emerald-500/10 rounded-2xl shadow-2xl overflow-hidden h-full min-h-[500px] flex flex-col group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Widget Header */}
      <div className="px-8 py-6 border-b border-emerald-500/10 flex items-center justify-between relative z-10 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] glow-pulse">
            <TrendingUp className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-400 leading-tight font-mono uppercase tracking-wide">
              Trending Categories
            </h2>
            <p className="text-[10px] text-gray-500 font-mono flex items-center tracking-widest uppercase mt-1">
              <Sparkles className="h-3.5 w-3.5 mr-2 text-emerald-500" /> NLP Dynamic Generation
              Index
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full p-8 relative z-10 bg-black/10 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 50, right: 20, top: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#14532d"
              horizontal={true}
              vertical={false}
              opacity={0.15}
            />
            <XAxis type="number" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              dataKey="domain"
              type="category"
              stroke="#e4e4e7"
              fontSize={12}
              fontWeight="bold"
              fontFamily="var(--font-geist-mono), monospace"
              tickLine={false}
              axisLine={false}
              width={160}
              tick={{ fill: '#e4e4e7', textAnchor: 'end', dx: -10 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(16, 185, 129, 0.03)' }}
              contentStyle={{
                backgroundColor: 'rgba(9, 9, 11, 0.95)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                color: '#F3F4F6',
                borderRadius: '12px',
                fontFamily: 'monospace',
              }}
              labelStyle={{
                color: '#9CA3AF',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
              itemStyle={{ color: '#10b981', fontWeight: '900', fontSize: '14px' }}
            />
            <Bar
              dataKey="count"
              radius={[0, 8, 8, 0]}
              barSize={24}
              isAnimationActive={true}
              animationDuration={1200}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index < 2 ? '#10b981' : '#059669'}
                  fillOpacity={0.9}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
