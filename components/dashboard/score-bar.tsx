'use client';

import { cn } from '@/lib/utils';

interface ScoreBarProps {
    label: string;
    score: number;
    maxScore?: number;
}

export function ScoreBar({ label, score, maxScore = 10 }: ScoreBarProps) {
    const percentage = (score / maxScore) * 100;

    const getColor = (score: number) => {
        if (score >= 8) return 'from-emerald-500 to-green-400';
        if (score >= 5) return 'from-amber-500 to-orange-400';
        return 'from-red-500 to-rose-400';
    };

    const getTextColor = (score: number) => {
        if (score >= 8) return 'text-emerald-400';
        if (score >= 5) return 'text-amber-400';
        return 'text-red-400';
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-[0.1em] uppercase text-zinc-500 capitalize">
                    {label.replace('_', ' ')}
                </span>
                <span className={cn("text-xs font-bold tabular-nums", getTextColor(score))}>
                    {score}/{maxScore}
                </span>
            </div>
            <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full bg-gradient-to-r rounded-full transition-all duration-700 ease-out",
                        getColor(score)
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
