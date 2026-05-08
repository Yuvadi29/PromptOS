'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { diffLines } from 'diff';
import { X, ArrowRight, GitBranch, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CompareModal({
  promptId,
  currentVersionContent,
}: {
  promptId: string | number;
  currentVersionContent: string;
}) {
  const [open, setOpen] = useState(false);
  const [diff, setDiff] = useState<any[]>([]);
  const [compareContent, setCompareContent] = useState('');
  const [, setVersionId] = useState<string | null>(null);
  const [addedLines, setAddedLines] = useState(0);
  const [removedLines, setRemovedLines] = useState(0);

  // Re-compute diff whenever current content or compare content changes
  useEffect(() => {
    if (open && compareContent) {
      const computed = diffLines(compareContent, currentVersionContent);
      setDiff(computed);

      let added = 0;
      let removed = 0;
      computed.forEach((part) => {
        if (part.added) added += part.count || 0;
        if (part.removed) removed += part.count || 0;
      });
      setAddedLines(added);
      setRemovedLines(removed);
    }
  }, [currentVersionContent, compareContent, open]);

  const openCompare = useCallback(
    async (id: string) => {
      setOpen(true);

      try {
        const versionContentRes = await fetch(`/api/prompt/${promptId}/versions/${id}`);
        const contentData = await versionContentRes.json();

        if (contentData.error) {
          console.error('Fetch error:', contentData.error);
          // Fallback: try to find in list if detail fails
          const allVersionsRes = await fetch(`/api/prompt/${promptId}/versions`);
          const allVersions = await allVersionsRes.json();
          const match = allVersions.find((v: any) => v.prompt_version_id === id || v.id === id);
          setCompareContent(match?.content || 'Linguistic data unavailable');
        } else {
          setCompareContent(contentData.content || 'No content found in snapshot');
        }
      } catch (err) {
        console.error('Comparison sync error:', err);
        setCompareContent('Synthesis failed: Connection error');
      }
    },
    [promptId]
  );

  useEffect(() => {
    function handler(e: any) {
      const versionId = e.detail;
      setVersionId(versionId);
      openCompare(versionId);
    }
    window.addEventListener('openCompare', handler);

    return () => window.removeEventListener('openCompare', handler);
  }, [promptId, openCompare]);

  function close() {
    setOpen(false);
    setVersionId(null);
    setDiff([]);
    setAddedLines(0);
    setRemovedLines(0);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          <motion.div
            className="fixed top-1/2 left-1/2 z-[9999] w-[95vw] max-w-7xl h-[85vh]
              bg-[#050505] border border-white/10 rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)]
              flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-8 border-b border-white/5 bg-black/40 backdrop-blur-xl">
              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <GitBranch className="w-4 h-4 text-white/60" />
                    </div>
                    <h2 className="text-xl font-display tracking-tight text-white">
                      Differential Synthesis
                    </h2>
                  </div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">
                    Analysis: Version Comparison
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 px-4 py-2 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                    <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
                      +{addedLines} Added
                    </span>
                  </div>
                  <div className="w-px h-3 bg-white/10" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
                      -{removedLines} Removed
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={close}
                className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex divide-x divide-white/5">
              {/* LEFT: Target Version */}
              <div className="flex-1 flex flex-col min-w-0 bg-black/20">
                <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
                    Historical Snapshot
                  </span>
                </div>
                <div className="flex-1 p-8 overflow-auto custom-scrollbar">
                  <pre className="whitespace-pre-wrap text-sm font-mono text-white/40 leading-relaxed">
                    {compareContent}
                  </pre>
                </div>
              </div>

              {/* RIGHT: Active Synthesis (Diff) */}
              <div className="flex-1 flex flex-col min-w-0 bg-[#080808]">
                <div className="p-6 border-b border-white/5 bg-white/[0.03] flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60">
                    Active Editor State
                  </span>
                  <ArrowRight className="w-3 h-3 text-white/20" />
                </div>
                <div className="flex-1 p-8 overflow-auto custom-scrollbar relative">
                  {addedLines === 0 && removedLines === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 space-y-4">
                      <CheckCircle className="w-8 h-8 text-white/20" />
                      <p className="font-mono text-sm tracking-widest uppercase">No Divergence</p>
                      <p className="text-xs text-white/30 text-center max-w-xs leading-relaxed">
                        This historical snapshot is perfectly identical to your current active
                        editor.
                      </p>
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                      {diff.map((part, index) => (
                        <span
                          key={index}
                          className={cn(
                            'rounded-sm px-0.5 transition-colors',
                            part.added
                              ? 'bg-green-500/10 text-green-400'
                              : part.removed
                                ? 'bg-red-500/10 text-red-400 line-through'
                                : 'text-white/80'
                          )}
                        >
                          {part.value}
                        </span>
                      ))}
                    </pre>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="p-6 border-t border-white/5 bg-black/40 flex items-center justify-center gap-8">
              <div className="flex items-center gap-4 text-[9px] font-mono uppercase tracking-[0.4em] text-white/10">
                <span>Protocol: Delta-Check</span>
                <span className="w-1 h-1 rounded-full bg-white/5" />
                <span>Integrity: Verified</span>
                <span className="w-1 h-1 rounded-full bg-white/5" />
                <span>
                  Linguistic Variance:{' '}
                  {(((addedLines + removedLines) / (compareContent.length || 1)) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
