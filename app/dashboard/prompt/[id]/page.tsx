'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { supabaseAdmin } from '@/lib/supabase';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Save, History, ArrowLeft, Clock, Terminal, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import CompareModal from '@/components/CompareModal';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface PromptVersion {
  id?: string;
  prompt_version_id?: string;
  version_number: number;
  source: string;
  content: string;
  prompt_id: string;
  created_at: string;
  reason: string | null;
  runs?: number;
  avg_score?: number;
  thumbs_up?: number;
  thumbs_down?: number;
}

export default function PromptSessionPage() {
  const { id } = useParams();
  const [currentVersion, setCurrentVersion] = useState<PromptVersion | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [fetchingVersions, setFetchingVersions] = useState(false);
  const [reverting, setReverting] = useState<string | null>(null);
  const [revertConfirmModal, setRevertConfirmModal] = useState<string | null>(null);
  const [neverAskRevert, setNeverAskRevert] = useState(false);

  const fetchVersions = useCallback(async () => {
    setFetchingVersions(true);
    try {
      const res = await fetch(`/api/prompt/${id}/versions`);
      const data = await res.json();
      setVersions(data || []);
    } catch (err) {
      console.error('Error fetching versions:', err);
    } finally {
      setFetchingVersions(false);
    }
  }, [id]);

  useEffect(() => {
    const fetchLatestVersion = async () => {
      const { data: versionsData } = await supabaseAdmin
        .from('prompt_versions')
        .select('*')
        .eq('prompt_id', id)
        .order('version_number', { ascending: false })
        .limit(1);

      if (versionsData && versionsData.length > 0) {
        const latest = versionsData[0];
        setCurrentVersion(latest);
        setEnhancedPrompt(latest.content);
      } else {
        const { data: originalPrompt } = await supabaseAdmin
          .from('prompts')
          .select('prompt_value')
          .eq('id', id)
          .single();

        if (originalPrompt) {
          const mockVersion: PromptVersion = {
            prompt_version_id: 'original',
            version_number: 1,
            source: 'Original Generation',
            content: originalPrompt.prompt_value,
            prompt_id: (Array.isArray(id) ? id[0] : id) as string,
            created_at: new Date().toISOString(),
            reason: 'Initial capture',
          };
          setCurrentVersion(mockVersion);
          setEnhancedPrompt(originalPrompt.prompt_value);
        }
      }
      setLoading(false);
      await fetchVersions();
    };

    fetchLatestVersion();
  }, [id, fetchVersions]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data, error } = await supabaseAdmin
        .from('prompt_versions')
        .insert([
          {
            prompt_id: id,
            content: enhancedPrompt,
            source: 'user',
            reason: 'Manual iteration via Editor',
          },
        ])
        .select()
        .single();

      if (!error) {
        setCurrentVersion(data);
        await fetchVersions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleRevert = async (versionId: string) => {
    setReverting(versionId);
    try {
      const res = await fetch(`/api/prompt/${id}/versions/${versionId}/revert`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentVersion(data.new_version);
        setEnhancedPrompt(data.new_version.content);
        await fetchVersions();
        toast.success(`Successfully reverted to older version`);
      } else {
        toast.error(data.error || 'Failed to revert version');
        console.error('Revert error:', data);
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred');
      console.error(err);
    } finally {
      setReverting(null);
    }
  };

  const onRevertClick = (vid: string) => {
    if (typeof window !== 'undefined' && localStorage.getItem('neverAskRevert') === 'true') {
      handleRevert(vid);
    } else {
      setRevertConfirmModal(vid);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="space-y-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white/20 mx-auto" />
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30">
            Initializing Matrix...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col md:flex-row noise-overlay">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-[0.07]"
        >
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
      </div>

      {/* Editor Side (Main) */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0 border-r border-white/5">
        {/* Header */}
        <header className="p-8 border-b border-white/5 flex items-center justify-between backdrop-blur-md bg-black/40">
          <div className="flex items-center gap-6">
            <Link href="/dashboard/all-prompts">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center hover:bg-white/[0.05] hover:border-white/20 transition-all group cursor-pointer">
                <ArrowLeft className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
              </div>
            </Link>
            <div>
              <h1 className="text-3xl font-display tracking-tight text-white mb-1">
                Intelligence Module
              </h1>
              <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-white/30">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3 h-3" /> ID: {id?.toString().slice(0, 8)}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="flex items-center gap-1.5 text-white/60">
                  <History className="w-3 h-3" /> Version v{currentVersion?.version_number}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              {/* Modal moved to root for stacking context integrity */}
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-white text-black hover:bg-white/90 rounded-xl px-6 py-6 font-mono text-[10px] uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-pointer"
            >
              {saving ? (
                <Loader2 className="w-3 h-3 animate-spin mr-2" />
              ) : (
                <Save className="w-3 h-3 mr-2" />
              )}
              Commit Changes
            </Button>
          </div>
        </header>

        {/* Editor Area */}
        <div className="flex-1 relative group">
          <div className="absolute inset-0 p-8">
            <div className="h-full w-full relative">
              {/* Technical frame decoration */}
              <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
              <div className="absolute -top-4 left-0 right-0 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

              <Textarea
                value={enhancedPrompt}
                onChange={(e) => setEnhancedPrompt(e.target.value)}
                className="w-full h-full bg-transparent border-none focus:ring-0 text-xl font-mono text-white/80 leading-relaxed resize-none p-0 selection:bg-white/20 placeholder:text-white/5 custom-scrollbar"
                placeholder="Initialize linguistic synthesis..."
              />
            </div>
          </div>

          {/* Ambient status indicator */}
          <div className="absolute bottom-8 right-8 flex items-center gap-4 pointer-events-none opacity-40">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/20 italic">
              Awaiting parameter updates...
            </span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full bg-white/20 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Version Log Side (Sidebar) */}
      <aside className="relative z-10 w-full md:w-[450px] flex flex-col bg-[#050505] backdrop-blur-xl border-l border-white/5">
        <header className="p-8 border-b border-white/5 bg-black/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <History className="w-4 h-4 text-white/60" />
            </div>
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-white/90">
              Linguistic Log
            </h2>
          </div>
          {fetchingVersions && <Loader2 className="w-3 h-3 animate-spin text-white/20" />}
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {versions.map((v, index) => {
              const vid = v.prompt_version_id || v.id || '';
              return (
                <motion.div
                  key={vid}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'group p-6 rounded-2xl border transition-all duration-500 relative overflow-hidden',
                    currentVersion?.id === vid || currentVersion?.prompt_version_id === vid
                      ? 'bg-white/[0.04] border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)]'
                      : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                  )}
                >
                  {/* Entry Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-white/90">
                          VERSION V{v.version_number}
                        </span>
                        {(currentVersion?.id === vid ||
                          currentVersion?.prompt_version_id === vid) && (
                          <span className="px-1.5 py-0.5 rounded bg-white text-black text-[8px] font-mono uppercase font-bold tracking-tighter">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                        {new Date(v.created_at).toLocaleDateString()} —{' '}
                        {new Date(v.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() =>
                              window.dispatchEvent(new CustomEvent('openCompare', { detail: vid }))
                            }
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                          >
                            <Maximize2 className="w-3 h-3" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="bg-black border border-white/10 text-white text-xs font-mono"
                        >
                          Compare
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => onRevertClick(vid)}
                            disabled={
                              reverting === vid ||
                              currentVersion?.id === vid ||
                              currentVersion?.prompt_version_id === vid
                            }
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-0 cursor-pointer"
                          >
                            {reverting === vid ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="bg-black border border-white/10 text-white text-xs font-mono"
                        >
                          Revert
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Reason / Commit Message */}
                  {v.reason && (
                    <p className="text-[11px] font-mono text-white/60 mb-6 italic leading-relaxed border-l border-white/10 pl-3">
                      {v.reason}
                    </p>
                  )}

                  {/* Node Metrics */}
                  {/* <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-[8px] font-mono uppercase tracking-widest text-white/20 mb-1">Impact</p>
                      <div className="flex items-center justify-center gap-1.5 text-white/80 font-mono text-[10px]">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        <span>{v.runs || 0}</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-[8px] font-mono uppercase tracking-widest text-white/20 mb-1">Logic</p>
                      <div className="flex items-center justify-center gap-1.5 text-white/80 font-mono text-[10px]">
                        <Activity className="w-3 h-3 text-blue-400" />
                        <span>{v.avg_score || 0}%</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-[8px] font-mono uppercase tracking-widest text-white/20 mb-1">Fit</p>
                      <div className="flex items-center justify-center gap-2 text-white/80 font-mono text-[10px]">
                        <span className="flex items-center gap-1"><ThumbsUp className="w-2.5 h-2.5 text-green-400" /> {v.thumbs_up || 0}</span>
                        <span className="flex items-center gap-1"><ThumbsDown className="w-2.5 h-2.5 text-red-400" /> {v.thumbs_down || 0}</span>
                      </div>
                    </div>
                  </div> */}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <footer className="p-8 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Syncing Node
            </span>
            <span className="w-px h-3 bg-white/5" />
            <span>Total Snapshots: {versions.length}</span>
          </div>
        </footer>
      </aside>

      {/* Global Modals */}
      {id && (
        <CompareModal
          promptId={Array.isArray(id) ? id[0] : id}
          currentVersionContent={enhancedPrompt}
        />
      )}

      {/* Revert Confirmation Modal */}
      <AnimatePresence>
        {revertConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#050505] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <h3 className="text-xl font-display text-white mb-4">Confirm Revert</h3>
              <p className="text-white/60 mb-6 leading-relaxed">
                Are you sure you want to revert to this older version? Your current workspace will
                be overwritten, but this action will be logged as a new version.
              </p>

              <div className="flex items-center gap-3 mb-8">
                <input
                  type="checkbox"
                  id="neverAsk"
                  className="w-4 h-4 rounded border-white/20 bg-white/5 accent-white cursor-pointer"
                  checked={neverAskRevert}
                  onChange={(e) => setNeverAskRevert(e.target.checked)}
                />
                <label
                  htmlFor="neverAsk"
                  className="text-sm text-white/40 cursor-pointer hover:text-white/60 transition-colors"
                >
                  Don&apos;t show this warning again
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setRevertConfirmModal(null)}
                  className="bg-transparent border border-white/10 text-white/60 hover:text-white hover:bg-white/5 rounded-xl px-6 font-mono text-[10px] uppercase tracking-widest cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (neverAskRevert && typeof window !== 'undefined') {
                      localStorage.setItem('neverAskRevert', 'true');
                    }
                    if (revertConfirmModal) {
                      handleRevert(revertConfirmModal);
                    }
                    setRevertConfirmModal(null);
                  }}
                  className="bg-white text-black hover:bg-white/90 rounded-xl px-6 font-mono text-[10px] uppercase tracking-widest cursor-pointer"
                >
                  Confirm Revert
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
