'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  gradient?: string;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  gradient = 'from-white/5 to-transparent',
  trend,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-2xl bg-black border border-foreground/10 overflow-hidden hover:border-foreground/20 transition-all duration-500"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
      />

      <div className="relative z-10 p-6 flex flex-col justify-between h-full min-h-[160px]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
            {title}
          </span>
          <div className="p-2 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-4xl lg:text-5xl font-display tracking-tight text-foreground">
            {value}
          </h3>
          <div className="flex items-center gap-3">
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            {trend && (
              <div className="flex items-center gap-1 text-[10px] font-mono">
                <span className={trend.value >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}
                </span>
                <span className="text-muted-foreground/60 uppercase">{trend.label}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
