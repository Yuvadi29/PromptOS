'use client';

import { useUser } from '@/context/UserContext';
import { supabaseAdmin } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Terminal, ArrowUpRight, Trash2 } from 'lucide-react';

const Page = () => {
  const user = useUser();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [deletePromptId, setDeletePromptId] = useState<string | null>(null);

  useEffect(() => {
    const getPrompts = async () => {
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', user?.email)
        .single();

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
    };

    if (user?.email) getPrompts();
  }, [user?.email]);

  const handleDelete = async () => {
    if (!deletePromptId) return;

    const { error } = await supabaseAdmin.from('prompts').delete().eq('id', deletePromptId);

    if (error) {
      toast.error('Error Deleting Prompt');
      return;
    }

    toast.success('Prompt Deleted Successfully');
    setPrompts((prev) => prev.filter((p) => p.id !== deletePromptId));
    setDeletePromptId(null);
    setShowDeleteModel(false);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden noise-overlay selection:bg-white/20">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-20">
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black" />
      </div>

      {/* Grid Lines */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03]">
        {[...Array(12)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-white"
            style={{ top: `${(100 / 12) * (i + 1)}%`, left: 0, right: 0 }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-white"
            style={{ left: `${(100 / 12) * (i + 1)}%`, top: 0, bottom: 0 }}
          />
        ))}
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-32 lg:py-40">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-start text-left max-w-4xl mb-24"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-white/30" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
              Persistence Layer
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display tracking-tight leading-[0.9] text-white mb-8">
            Prompt Repository
          </h1>
          <p className="text-xl text-white/40 max-w-2xl font-display font-light leading-relaxed">
            A centralized archive of your architectural instructions and linguistic synthesis. Each
            session is preserved with full structural integrity.
          </p>
        </motion.div>

        {/* Prompt Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {prompts.map((prompt, index) => {
              let cleanedPrompt = prompt.prompt_value;
              if (/^text\s?/i.test(cleanedPrompt)) {
                cleanedPrompt = cleanedPrompt.replace(/^text\s?/i, '');
              }

              return (
                <motion.div
                  key={prompt.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.6,
                    delay: Math.min(index * 0.05, 0.5),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group h-full"
                >
                  <Card className="h-full bg-white/[0.02] border-white/5 p-8 rounded-2xl flex flex-col justify-between group-hover:bg-white/[0.04] group-hover:border-white/10 transition-all duration-500 relative overflow-hidden backdrop-blur-sm">
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                            <Terminal className="w-3.5 h-3.5 text-white/40" />
                          </div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                            Node #{String(index + 1).padStart(3, '0')}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-white/20">
                          {new Date(prompt.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="relative mb-12">
                        <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 to-transparent" />
                        <p className="text-lg font-display font-light text-white/80 line-clamp-4 leading-relaxed pl-2">
                          {cleanedPrompt}
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between pt-8 border-t border-white/5">
                      <Link href={`/dashboard/prompt/${prompt.id}`} className="group/link">
                        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 group-hover/link:text-white transition-colors">
                          <span>Access Node</span>
                          <ArrowUpRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                        </div>
                      </Link>

                      <button
                        onClick={() => {
                          setDeletePromptId(prompt.id);
                          setShowDeleteModel(true);
                        }}
                        className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Ambient Background Number */}
                    <div className="absolute -bottom-8 -right-8 text-9xl font-display text-white/[0.02] select-none pointer-events-none group-hover:text-white/[0.04] transition-colors duration-700">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {prompts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-40"
          >
            <p className="text-sm font-mono uppercase tracking-[0.4em] text-white/20">
              No active nodes in repository
            </p>
          </motion.div>
        )}
      </main>

      <Drawer open={showDeleteModel} onOpenChange={setShowDeleteModel}>
        <DrawerContent className="bg-black border-white/10">
          <div className="mx-auto w-full max-w-sm p-8">
            <DrawerHeader className="px-0">
              <DrawerTitle className="text-2xl font-display tracking-tight text-white mb-2">
                Confirm Termination
              </DrawerTitle>
              <DrawerDescription className="text-white/40 font-mono text-xs uppercase tracking-widest leading-relaxed">
                This node will be purged from the repository. This action is irreversible.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="px-0 flex-row gap-4 mt-8">
              <Button
                onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-6 font-mono text-[10px] uppercase tracking-widest transition-all"
              >
                Confirm Purge
              </Button>
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 hover:bg-white/5 rounded-xl py-6 font-mono text-[10px] uppercase tracking-widest text-white/40"
                >
                  Abort
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
