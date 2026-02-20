'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Clock } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface PromptCardProps {
    id: string | number;
    title: string;
    content: string;
    createdAt: Date | string;
    onDelete?: () => void;
    showActions?: boolean;
}

export function PromptCard({ id, title, content, createdAt, onDelete, showActions = true }: PromptCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative rounded-2xl bg-zinc-900/40 border border-white/[0.04] hover:border-white/[0.1] backdrop-blur-sm transition-all duration-300 hover:bg-zinc-900/60 overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-orange-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 p-5 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">{title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-600 shrink-0 ml-4">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                    </div>
                </div>

                {/* Content */}
                <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                    {content}
                </p>

                {/* Actions */}
                {showActions && (
                    <div className="flex items-center gap-2 pt-1">
                        <Link href={`/dashboard/prompt/${id}`}>
                            <Button
                                size="sm"
                                variant="outline"
                                className="bg-zinc-950/50 border-white/[0.06] hover:border-white/[0.12] hover:bg-zinc-800/50 text-zinc-400 hover:text-white text-xs h-8 rounded-lg transition-all"
                            >
                                <Eye className="w-3.5 h-3.5 mr-1.5" />
                                View
                            </Button>
                        </Link>
                        {onDelete && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onDelete}
                                className="bg-zinc-950/50 border-white/[0.06] hover:border-red-500/30 hover:bg-red-950/30 text-zinc-400 hover:text-red-400 text-xs h-8 rounded-lg transition-all"
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                Delete
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
