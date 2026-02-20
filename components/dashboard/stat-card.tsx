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

export function StatCard({ title, value, description, icon: Icon, gradient = 'from-orange-500/10 to-transparent', trend }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative rounded-[1.5rem] bg-zinc-900/50 border border-white/[0.06] backdrop-blur-md overflow-hidden hover:border-white/[0.12] transition-all duration-500"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

            <div className="relative z-10 p-6 flex flex-col justify-between h-full min-h-[140px]">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-500 group-hover:text-zinc-300 transition-colors">{title}</span>
                    <Icon className="w-5 h-5 text-zinc-600 group-hover:text-orange-400 transition-colors" />
                </div>

                <div>
                    <h3 className="text-4xl font-black tracking-tight text-white mt-auto">{value}</h3>
                    {description && (
                        <p className="text-xs text-zinc-600 mt-1">{description}</p>
                    )}
                    {trend && (
                        <p className="text-xs text-zinc-600 mt-1">
                            <span className={trend.value >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                {trend.value >= 0 ? '+' : ''}{trend.value}
                            </span>
                            {' '}{trend.label}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
