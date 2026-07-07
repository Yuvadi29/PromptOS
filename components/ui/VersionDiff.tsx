import React, { useMemo } from 'react';
import { diffWordsWithSpace, Change } from 'diff';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface VersionDiffProps {
  oldText: string;
  newText: string;
  className?: string;
}

export function VersionDiff({ oldText, newText, className }: VersionDiffProps) {
  const diff = useMemo(() => diffWordsWithSpace(oldText, newText), [oldText, newText]);

  // Calculate some simple metrics
  const added = diff
    .filter((part) => part.added)
    .reduce((acc, part) => acc + part.value.split(/\s+/).length, 0);
  const removed = diff
    .filter((part) => part.removed)
    .reduce((acc, part) => acc + part.value.split(/\s+/).length, 0);

  return (
    <div
      className={cn(
        'flex flex-col border border-border rounded-lg overflow-hidden bg-card',
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30 text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500/80 inline-block"></span>
            Original
          </span>
          <span className="text-muted-foreground flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500/80 inline-block"></span>
            Enhanced
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-green-400">+{added} words</span>
          <span className="text-red-400">-{removed} words</span>
        </div>
      </div>
      <div className="p-4 overflow-auto max-h-[500px] text-sm font-mono whitespace-pre-wrap leading-relaxed text-foreground">
        {diff.map((part: Change, index: number) => {
          if (part.added) {
            return (
              <motion.span
                key={index}
                initial={{ opacity: 0, backgroundColor: 'rgba(34, 197, 94, 0)' }}
                animate={{ opacity: 1, backgroundColor: 'rgba(34, 197, 94, 0.2)' }}
                className="text-green-300 rounded-sm px-0.5"
              >
                {part.value}
              </motion.span>
            );
          }
          if (part.removed) {
            return (
              <span
                key={index}
                className="bg-red-500/20 text-red-300 line-through decoration-red-500/50 rounded-sm px-0.5"
              >
                {part.value}
              </span>
            );
          }
          return <span key={index}>{part.value}</span>;
        })}
      </div>
    </div>
  );
}
