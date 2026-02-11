'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
    badge?: string;
    title: string;
    highlight?: string;
    subtitle?: string;
    align?: 'center' | 'left';
    className?: string;
}

export default function SectionHeading({
    badge,
    title,
    highlight,
    subtitle,
    align = 'center',
    className,
}: SectionHeadingProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={cn(
                'mb-20',
                align === 'center' ? 'text-center' : 'text-left',
                className
            )}
        >
            {badge && (
                <div className={cn(
                    'inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6',
                    align === 'center' ? 'mx-auto' : ''
                )}>
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-xs font-semibold tracking-widest uppercase text-orange-400">
                        {badge}
                    </span>
                </div>
            )}

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
                <span className="text-white">{title}</span>
                {highlight && (
                    <>
                        <br className="hidden sm:block" />{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600">
                            {highlight}
                        </span>
                    </>
                )}
            </h2>

            {subtitle && (
                <p className={cn(
                    'mt-6 text-lg text-zinc-400 leading-relaxed',
                    align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-xl'
                )}>
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
}
