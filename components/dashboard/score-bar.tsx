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
        if (score >= 8) return 'from-green-500 to-emerald-500';
        if (score >= 5) return 'from-yellow-500 to-orange-500';
        return 'from-red-500 to-pink-500';
    };

    const getTextColor = (score: number) => {
        if (score >= 8) return 'text-green-400';
        if (score >= 5) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-300 capitalize">
                    {label.replace('_', ' ')}
                </span>
                <span className={cn("text-sm font-bold", getTextColor(score))}>
                    {score}/{maxScore}
                </span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full bg-gradient-to-r transition-all duration-500",
                        getColor(score)
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
