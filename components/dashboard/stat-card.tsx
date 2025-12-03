'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export function StatCard({ title, value, description, icon: Icon, gradient = 'from-purple-500 to-pink-500', trend }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden"
        >
            <div className="relative h-full p-6 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
                {/* Hover gradient effect */}
                <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br",
                    gradient
                )} />

                {/* Icon */}
                <div className={cn(
                    "inline-flex p-3 rounded-xl bg-gradient-to-br mb-4",
                    gradient
                )}>
                    <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Content */}
                <div className="relative">
                    <p className="text-sm font-medium text-zinc-400 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
                    {description && (
                        <p className="text-xs text-zinc-500">{description}</p>
                    )}
                    {trend && (
                        <p className="text-xs text-zinc-500 mt-2">
                            <span className={trend.value >= 0 ? 'text-green-400' : 'text-red-400'}>
                                {trend.value >= 0 ? '+' : ''}{trend.value}
                            </span>
                            {' '}{trend.label}
                        </p>
                    )}
                </div>

                {/* Bottom accent line */}
                <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    gradient
                )} />
            </div>
        </motion.div>
    );
}
