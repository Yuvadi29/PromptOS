'use client';

import { useUser } from '@/context/UserContext';
import { supabaseAdmin } from '@/lib/supabase';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import gsap from 'gsap';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trash2, ArrowRight, Sparkles, ChevronRight, Code, Loader2 } from 'lucide-react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

const Page = () => {
  const user = useUser();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [deletePromptId, setDeletePromptId] = useState<string | null>(null);

  useEffect(() => {
    const getPrompts = async () => {
      setLoading(true);
      try {
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', user?.email)
          .single();

        if (!userData) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabaseAdmin
          .from('prompts')
          .select('id, prompt_value, created_at')
          .eq('created_by', userData?.id)
          .order('created_at', { ascending: false });

        if (error) {
          toast.error('Error fetching prompts');
          return;
        }

        setPrompts(data || []);
      } catch (err) {
        console.error('Failed to load prompts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) getPrompts();
  }, [user?.email]);

  useEffect(() => {
    if (prompts.length && containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.prompt-card');
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.08,
        }
      );
    }
    setShowDeleteModel(false);
  }, [prompts]);

  const handleDelete = async () => {
    if (!deletePromptId) return;

    const { error } = await supabaseAdmin.from('prompts').delete().eq('id', deletePromptId);

    if (error) {
      toast.error('Error Deleting Prompt');
      return;
    }

    toast.success('Prompt Deleted Successfully');

    // Remove Deleted Prompt from state
    setPrompts((prev) => prev.filter((p) => p.id !== deletePromptId));
    setDeletePromptId(null);
    setShowDeleteModel(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 bg-gradient-to-br from-emerald-950/20 via-zinc-950 to-zinc-950 p-6 md:p-10 relative overflow-hidden flex flex-col">
      {/* Ambient Background Glowing Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-emerald-500/3 blur-[90px] pointer-events-none" />

      {/* Breadcrumbs and Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 font-mono">
            <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-zinc-400">All Prompts</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-white">All Saved Prompts</h1>
            {prompts.length > 0 && (
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono px-2 py-0.5 rounded-full">
                {prompts.length} Prompts
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            View, organize, test, and manage the history of your optimized prompt templates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/enhance" passHref>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold cursor-pointer shadow-lg shadow-emerald-500/10">
              Enhance New Prompt
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Area */}
      <div className="relative z-10 flex-grow flex flex-col">
        {loading ? (
          <div className="flex-grow flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              <span className="text-xs text-muted-foreground font-mono">
                Retrieving prompt catalog...
              </span>
            </div>
          </div>
        ) : prompts.length === 0 ? (
          <div className="flex-grow flex items-center justify-center py-16">
            <div className="flex flex-col items-center justify-center text-center bg-zinc-900/20 border border-white/5 rounded-2xl p-8 max-w-md shadow-2xl backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No saved prompts yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
                Use our prompt enhancer or scoring dashboard to build, refine, and store your first
                optimized prompt!
              </p>
              <Link href="/enhance" passHref>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold cursor-pointer">
                  Create First Prompt
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt, index) => {
              let cleanedPrompt = prompt.prompt_value || '';

              // Remove 'text' from beginning if it starts with it (case-insensitive)
              if (/^text\s?/i.test(cleanedPrompt)) {
                cleanedPrompt = cleanedPrompt.replace(/^text\s?/i, '');
              }

              return (
                <Card
                  key={prompt.id}
                  className="prompt-card p-5 h-[230px] overflow-hidden relative flex flex-col justify-between bg-zinc-900/40 backdrop-blur-md border border-white/5 hover:border-emerald-500/30 hover:bg-zinc-900/70 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.3)] group rounded-xl"
                >
                  {/* Glowing top line on hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex flex-col gap-3 h-[130px] overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-emerald-400/80 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded text-xs">
                          #{prompts.length - index}
                        </span>
                        {prompt.created_at && (
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {new Date(prompt.created_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                      <Code className="w-3.5 h-3.5 text-zinc-600 group-hover:text-emerald-500/50 transition-colors" />
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap line-clamp-4 group-hover:text-zinc-100 transition-colors font-sans">
                      {cleanedPrompt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex justify-between items-center bg-transparent relative z-10">
                    <Link href={`/dashboard/prompt/${prompt.id}`} passHref>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs p-0 text-emerald-400 hover:text-emerald-300 hover:bg-transparent font-medium group/btn cursor-pointer flex items-center gap-1.5"
                      >
                        Configure & Optimize
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeletePromptId(prompt.id);
                        setShowDeleteModel(true);
                      }}
                      className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
                      title="Delete saved prompt"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Drawer open={showDeleteModel} onOpenChange={setShowDeleteModel}>
        <DrawerContent className="bg-zinc-900 border-t border-zinc-800 text-zinc-100">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="text-white text-lg">Are you absolutely sure?</DrawerTitle>
              <DrawerDescription className="text-zinc-400 text-sm">
                This will permanently remove this prompt and all of its associated version
                histories. This action cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="flex flex-col gap-2 pt-2">
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer w-full font-medium"
              >
                Delete Prompt
              </Button>
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="w-full border-zinc-700 hover:bg-zinc-800 text-zinc-300 cursor-pointer"
                >
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Page;
