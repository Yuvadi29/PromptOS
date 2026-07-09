'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, Target, Zap, Layout, CheckCircle2 } from 'lucide-react';

export default function ScoresTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/scores')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <Card className="p-6 bg-[#050505] border border-emerald-500/10 h-full min-h-[500px] flex items-center justify-center animate-pulse rounded-2xl shadow-2xl">
        <div className="h-full w-full bg-emerald-950/10 rounded-xl border border-emerald-950/40"></div>
      </Card>
    );

  if (!data) return <div className="text-red-400 font-mono">Failed to load scores.</div>;

  const chartData = [
    { name: 'Clarity', uv: data.averages.clarity, fill: '#10b981' },
    { name: 'Specificity', uv: data.averages.specificity, fill: '#059669' },
    { name: 'Model Fit', uv: data.averages.model_fit, fill: '#34d399' },
    { name: 'Relevance', uv: data.averages.relevance, fill: '#047857' },
    { name: 'Structure', uv: data.averages.structure, fill: '#a7f3d0' },
    { name: 'Conciseness', uv: data.averages.conciseness, fill: '#064e3b' },
  ];

  return (
    <Card className="bg-[#050505] border border-emerald-500/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col xl:flex-row group relative h-full min-h-[500px]">
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Left Side: Radar/Radial & Stats */}
      <div className="w-full xl:w-2/5 p-6 border-b xl:border-b-0 xl:border-r border-emerald-500/10 flex flex-col relative z-10 bg-black/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Target className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-400 leading-tight font-mono uppercase tracking-wide">
              Quality Engine
            </h2>
            <p className="text-[10px] text-gray-500 font-mono">Global Aggregate Scoring</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row xl:flex-col items-center justify-center gap-6">
          <div className="h-[200px] w-[200px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="100%"
                barSize={8}
                data={chartData}
              >
                <RadialBar background dataKey="uv" cornerRadius={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(9,9,11,0.95)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <ScoreCard title="Clarity" value={data.averages.clarity} icon={Zap} color="green" />
            <ScoreCard
              title="Model Fit"
              value={data.averages.model_fit}
              icon={CheckCircle2}
              color="green"
            />
            <ScoreCard
              title="Specificity"
              value={data.averages.specificity}
              icon={Target}
              color="green"
            />
            <ScoreCard
              title="Structure"
              value={data.averages.structure}
              icon={Layout}
              color="green"
            />
          </div>
        </div>
      </div>

      {/* Right Side: Recent Scores List */}
      <div className="w-full xl:w-3/5 p-0 flex flex-col relative z-10 bg-black/10">
        <div className="p-4 border-b border-emerald-500/10 bg-black/40 backdrop-blur-md">
          <h3 className="text-[11px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2 font-mono">
            <Activity className="h-4 w-4 text-emerald-400" /> Evaluation Stream
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest border-b border-emerald-500/10 mb-1 font-mono">
            <div className="col-span-6">Raw Prompt Input</div>
            <div className="col-span-2 text-center">Clarity</div>
            <div className="col-span-2 text-center">Fit</div>
            <div className="col-span-2 text-right">Timestamp</div>
          </div>
          {data.recentScores &&
            data.recentScores.map((score: any) => (
              <div
                key={score.id}
                className="grid grid-cols-12 gap-2 px-4 py-3 text-xs hover:bg-emerald-950/10 transition-colors border border-transparent hover:border-emerald-500/10 rounded-xl group/row"
              >
                <div
                  className="col-span-6 text-gray-300 truncate pr-4 group-hover/row:text-white transition-colors font-mono"
                  title={score.prompt}
                >
                  {score.prompt}
                </div>
                <div className="col-span-2 text-center font-mono">
                  <span
                    className={
                      score.clarity > 80 ? 'text-emerald-400 font-bold' : 'text-yellow-550'
                    }
                  >
                    {score.clarity}
                  </span>
                  <span className="text-gray-600">/100</span>
                </div>
                <div className="col-span-2 text-center font-mono">
                  <span
                    className={
                      score.model_fit > 80 ? 'text-emerald-400 font-bold' : 'text-yellow-550'
                    }
                  >
                    {score.model_fit}
                  </span>
                  <span className="text-gray-600">/100</span>
                </div>
                <div className="col-span-2 text-right text-gray-500 font-mono text-[9px] mt-0.5">
                  {new Date(score.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
}

function ScoreCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    green: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20',
  };

  return (
    <Card
      className={`p-3 bg-black border border-emerald-500/10 flex flex-col justify-between hover:border-emerald-500/20 transition-colors shadow-inner rounded-xl`}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-[9px] text-gray-550 font-bold uppercase tracking-wider font-mono">
          {title}
        </span>
        <div className={`p-1 rounded-md border ${colors[color] || colors.green}`}>
          <Icon className="h-3 w-3" />
        </div>
      </div>
      <div className="text-md font-bold tracking-tight text-white mt-1 font-mono">
        {typeof value === 'number' ? value.toFixed(0) : value}
        <span className="text-[8px] text-gray-500 font-normal ml-0.5 tracking-normal">/100</span>
      </div>
    </Card>
  );
}
