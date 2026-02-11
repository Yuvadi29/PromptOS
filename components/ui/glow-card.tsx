'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface GlowCardProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    index?: number;
    className?: string;
}

export default function GlowCard({ icon: Icon, title, description, index = 0, className }: GlowCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                'relative group rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-8 overflow-hidden transition-colors duration-300 hover:border-orange-500/30',
                className
            )}
        >
            {/* Mouse Spotlight */}
            {isHovered && (
                <div
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(249,115,22,0.12), transparent 60%)`,
                    }}
                />
            )}

            {/* Top Glow Line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative z-10">
                {Icon && (
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 group-hover:border-orange-500/40 transition-all duration-300">
                        <Icon className="w-6 h-6 text-orange-500" />
                    </div>
                )}

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-50 transition-colors">
                    {title}
                </h3>

                <p className="text-zinc-400 leading-relaxed text-sm group-hover:text-zinc-300 transition-colors">
                    {description}
                </p>
            </div>
        </motion.div>
    );
}
