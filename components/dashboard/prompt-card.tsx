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

export function PromptCard({
  id,
  title,
  content,
  createdAt,
  onDelete,
  showActions = true,
}: PromptCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-2xl bg-black border border-foreground/10 hover:border-foreground/20 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-display tracking-tight text-foreground group-hover:translate-x-1 transition-transform duration-300">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest shrink-0 ml-4">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </div>
        </div>

        {/* Content */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-light">
          {content}
        </p>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2 pt-2 border-t border-foreground/5">
            <Link href={`/dashboard/prompt/${id}`} className="flex-1">
              <Button
                size="sm"
                variant="ghost"
                className="w-full justify-start bg-transparent border-none hover:bg-foreground/5 text-muted-foreground hover:text-foreground text-xs h-8 rounded-lg transition-all px-2"
              >
                <Eye className="w-3.5 h-3.5 mr-2" />
                View Details
              </Button>
            </Link>
            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                className="bg-transparent border-none hover:bg-red-500/10 text-muted-foreground hover:text-red-400 text-xs h-8 rounded-lg transition-all px-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
