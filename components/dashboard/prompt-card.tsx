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
            className="group relative overflow-hidden"
        >
            <div className="relative p-6 rounded-xl bg-gradient-to-b from-zinc-900 to-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br from-purple-500 to-cyan-500" />

                <div className="relative space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">{title}</h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                        </div>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-zinc-400 line-clamp-3">
                        {content}
                    </p>

                    {/* Actions */}
                    {showActions && (
                        <div className="flex items-center gap-2 pt-2">
                            <Link href={`/dashboard/prompt/${id}`}>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-white"
                                >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                </Button>
                            </Link>
                            {onDelete && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={onDelete}
                                    className="bg-zinc-800/50 border-zinc-700 hover:bg-red-900/50 hover:border-red-700 text-white hover:text-red-400"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Delete
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
