'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ScoreBarProps {
  label: string;
  score: number;
  maxScore?: number;
}

export function ScoreBar({ label, score, maxScore = 10 }: ScoreBarProps) {
  const percentage = (score / maxScore) * 100;

  const getColor = (score: number) => {
    if (score >= 8) return 'bg-white';
    if (score >= 5) return 'bg-white/60';
    return 'bg-white/30';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
          {label.replace('_', ' ')}
        </span>
        <span className="text-[10px] font-mono font-bold tabular-nums text-foreground">
          {score.toFixed(1)} <span className="text-muted-foreground">/ {maxScore}</span>
        </span>
      </div>
      <div className="w-full h-[3px] bg-foreground/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            getColor(score)
          )}
        />
      </div>
    </div>
  );
}
