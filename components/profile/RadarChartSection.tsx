"use client";

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip as RechartsTooltip } from 'recharts';

interface RadarChartSectionProps {
    data: { subject: string; A: number; fullMark: number }[];
}

export default function RadarChartSection({ data }: RadarChartSectionProps) {
    return (
        <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#71717a', fontSize: 11, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Contributions"
                        dataKey="A"
                        stroke="#f97316"
                        fill="url(#radarGradient)"
                        fillOpacity={0.6}
                        strokeWidth={2}
                    />
                    <defs>
                        <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <RechartsTooltip
                        contentStyle={{
                            backgroundColor: '#18181b',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '12px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        }}
                        itemStyle={{ color: '#f97316', fontSize: 13 }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
