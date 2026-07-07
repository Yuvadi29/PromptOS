'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Props {
  data: { subject: string; A: number; fullMark: number }[];
}

export default function ProfilePieChart({ data }: Props) {
  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#a855f7', '#ec4899'];

  // Map radar data to pie chart data
  const pieData = data.map((d, index) => ({
    name: d.subject,
    value: d.A,
    fill: COLORS[index % COLORS.length],
  }));

  if (pieData.every((d) => d.value === 0)) {
    return (
      <div className="flex flex-col items-center justify-center text-zinc-500 h-full w-full">
        <PieChart width={150} height={150}>
          <Pie
            data={[{ name: 'No Data', value: 1 }]}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            fill="#27272a"
            dataKey="value"
            stroke="none"
          />
        </PieChart>
        <span className="text-xs mt-2">No activity data yet</span>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={85}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
          cornerRadius={4}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#18181b',
            border: '1px solid #3f3f46',
            borderRadius: '8px',
          }}
          itemStyle={{ color: '#e4e4e7' }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          formatter={(value) => <span className="text-zinc-400 text-xs">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
