'use client';

import { ReactNode, useEffect, useState } from 'react';
import {
  Filter,
  ThumbsDown,
  ThumbsUp,
  Sparkles,
  Copy,
  Bookmark,
  BookmarkCheck,
  Cpu,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { supabaseAdmin } from '@/lib/supabase';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Prompt {
  [x: string]: ReactNode;
  id: number;
  title: string;
  description: string;
  promptText: string;
  niche: string;
  likes: number;
  dislikes: number;
  createdByName?: string;
  createdByImage?: string;
}

const niches = ['All', 'Creative Writing', 'Technical Writing', 'Marketing', 'Programming', 'HR'];

export default function PromptLibrary() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [selectedNiche, setSelectedNiche] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch('/api/prompt-library', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        const formatted = data?.map((prompt: any) => ({
          id: prompt?.id,
          createdBy: prompt?.created_by,
          createdByName: prompt?.users?.name || prompt?.users?.username || 'Unknown',
          createdByImage: prompt?.users?.image,
          title: prompt?.prompt_title,
          description: prompt?.prompt_description,
          promptText: prompt?.promptText,
          niche: prompt?.niche,
          likes: prompt?.likes || 0,
          dislikes: prompt?.dislikes || 0,
        }));

        setPrompts(formatted);
        setFilteredPrompts(formatted);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch prompts', error);
        toast.error('Failed to load prompts. Try again later.');
      }
    };

    const fetchBookmarks = async () => {
      try {
        const res = await fetch('/api/prompt-library/bookmark');
        if (res.ok) {
          const ids: number[] = await res.json();
          setBookmarkedIds(new Set(ids));
        }
      } catch (err) {
        console.error('Failed to fetch bookmarks', err);
      }
    };

    fetchPrompts();
    if (session?.user) fetchBookmarks();
  }, [session?.user]);

  const [newPrompt, setNewPrompt] = useState({
    title: '',
    description: '',
    promptText: '',
    niche: '',
  });

  const handleCreatePrompt = async () => {
    const userEmail = session?.user?.email;
    if (!userEmail) return toast.error('User not logged in');

    const { data: userData, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (error || !userData) {
      return toast.error('Failed to fetch user ID');
    }

    const createdPrompt = {
      userId: userData?.id,
      title: newPrompt?.title,
      description: newPrompt?.description,
      promptText: newPrompt?.promptText,
      niche: newPrompt?.niche,
    };

    const res = await fetch('/api/prompt-library', {
      method: 'POST',
      body: JSON.stringify(createdPrompt),
    });

    if (!res.ok) return toast.error('Failed to save prompt!! Please try again');

    const savedPrompt = {
      ...createdPrompt,
      id: prompts.length + 1,
      likes: 0,
      dislikes: 0,
    };

    setPrompts([savedPrompt, ...prompts]);
    setFilteredPrompts([savedPrompt, ...filteredPrompts]);
    toast.success('Prompt created successfully');

    setNewPrompt({ title: '', description: '', promptText: '', niche: '' });
    setIsDialogOpen(false);
  };

  const filterPrompts = (niche: string, sort: string) => {
    let filtered = [...prompts];

    if (niche !== 'All') {
      filtered = filtered.filter((prompt) => prompt.niche === niche);
    }

    if (sort === 'mostLiked') {
      filtered = filtered.sort((a, b) => b.likes - a.likes);
    } else if (sort === 'newest') {
      filtered = filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredPrompts(filtered);
  };

  const handleVote = async (id: number, type: 'likes' | 'dislikes') => {
    const res = await fetch('/api/prompt/vote', {
      method: 'POST',
      body: JSON.stringify({ promptId: id, type }),
    });

    if (!res.ok) return toast.error('Failed to register vote. Try again later');

    const updatedPrompts = prompts?.map((prompt) => {
      if (prompt?.id === id) {
        return {
          ...prompt,
          likes: type === 'likes' ? prompt?.likes + 1 : prompt?.likes,
          dislikes: type === 'dislikes' ? prompt?.dislikes + 1 : prompt?.dislikes,
        };
      }
      return prompt;
    });

    setPrompts(updatedPrompts);
    filterPrompts(selectedNiche, sortBy);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to Clipboard!!');
  };

  const handleBookmark = async (promptId: number) => {
    const wasBookmarked = bookmarkedIds.has(promptId);
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (wasBookmarked) next.delete(promptId);
      else next.add(promptId);
      return next;
    });

    try {
      const res = await fetch('/api/prompt-library/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      toast.success(data.bookmarked ? 'Prompt bookmarked!' : 'Bookmark removed');
    } catch {
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (wasBookmarked) next.add(promptId);
        else next.delete(promptId);
        return next;
      });
      toast.error('Failed to update bookmark');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center animate-ping" />
            </div>
            <Activity className="absolute inset-0 m-auto w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white">
            Accessing Repository...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden noise-overlay">
      {/* Background elements */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-20 transition-opacity duration-1000"
        >
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black" />
      </div>

      {/* Subtle grid lines */}
      <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none opacity-[0.03]">
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
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
                Intelligence Repository
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-[100px] font-display tracking-tight leading-[0.9] text-foreground mb-8">
              Prompt Library
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl font-display font-light leading-relaxed">
              A curated database of high-density instructions. Discover, architecturalize, and
              deploy effective prompts across the modern LLM stack.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="group rounded-full bg-white text-black hover:bg-white/90 px-12 py-8 font-mono text-[10px] uppercase tracking-widest transition-all duration-500 flex items-center gap-4">
                  <span>Architect New Prompt</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px] bg-black border border-foreground/10 text-white rounded-2xl overflow-hidden p-0">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                <div className="relative p-8 space-y-8">
                  <DialogHeader>
                    <div className="flex items-center gap-2 mb-4">
                      <Cpu className="w-4 h-4 text-muted-foreground" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                        Buffer Input
                      </span>
                    </div>
                    <DialogTitle className="text-3xl font-display">New Instruction Set</DialogTitle>
                    <DialogDescription className="text-muted-foreground font-display font-light">
                      Define the parameters and core logic for your prompt architecture.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="title"
                        className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground"
                      >
                        Designation
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g. Technical Documentation Engine"
                        value={newPrompt?.title}
                        onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
                        className="bg-white/[0.03] border-foreground/10 text-white focus:border-white/40 transition-colors h-12"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="description"
                        className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground"
                      >
                        Objective
                      </Label>
                      <Input
                        id="description"
                        placeholder="Brief summary of intended output..."
                        value={newPrompt?.description}
                        onChange={(e) =>
                          setNewPrompt({ ...newPrompt, description: e.target.value })
                        }
                        className="bg-white/[0.03] border-foreground/10 text-white focus:border-white/40 transition-colors h-12"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="promptText"
                        className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground"
                      >
                        Logic Set
                      </Label>
                      <Textarea
                        id="promptText"
                        placeholder="Insert the core instruction hierarchy here..."
                        className="min-h-[150px] bg-white/[0.03] border-foreground/10 text-white focus:border-white/40 transition-colors resize-none"
                        value={newPrompt?.promptText}
                        onChange={(e) => setNewPrompt({ ...newPrompt, promptText: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="niche"
                        className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground"
                      >
                        Sector
                      </Label>
                      <Select
                        onValueChange={(value) => setNewPrompt({ ...newPrompt, niche: value })}
                        value={newPrompt?.niche}
                      >
                        <SelectTrigger
                          id="niche"
                          className="bg-white/[0.03] border-foreground/10 text-white h-12"
                        >
                          <SelectValue placeholder="Select Deployment Sector" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-foreground/10">
                          <SelectGroup>
                            {niches
                              .filter((niche) => niche !== 'All')
                              .map((niche) => (
                                <SelectItem
                                  key={niche}
                                  value={niche}
                                  className="text-white hover:bg-white/10 focus:bg-white/10 transition-colors font-mono text-[10px] uppercase tracking-widest"
                                >
                                  {niche}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={handleCreatePrompt}
                      disabled={!newPrompt.title || !newPrompt.promptText || !newPrompt.niche}
                      className="w-full rounded-full bg-white text-black hover:bg-white/90 py-8 font-mono text-[10px] uppercase tracking-widest transition-all duration-500"
                    >
                      Commit to Repository
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* Filters & Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16 flex flex-col sm:flex-row items-center justify-between gap-8 border-y border-foreground/5 py-8"
        >
          <div className="flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors"
                >
                  <Filter className="h-3 w-3" />
                  Filter: <span className="text-white">{selectedNiche}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black border-foreground/10">
                <DropdownMenuLabel className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground p-3">
                  Sector Analysis
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-foreground/5" />
                <DropdownMenuGroup>
                  {niches?.map((niche) => (
                    <DropdownMenuItem
                      key={niche}
                      onClick={() => {
                        setSelectedNiche(niche);
                        filterPrompts(niche, sortBy);
                      }}
                      className="text-white hover:bg-white/10 focus:bg-white/10 font-mono text-[10px] uppercase tracking-widest p-3"
                    >
                      {niche}
                      {selectedNiche === niche && (
                        <div className="ml-auto w-1 h-1 rounded-full bg-white" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-4 bg-foreground/10" />

            <Select
              onValueChange={(value) => {
                setSortBy(value);
                filterPrompts(selectedNiche, value);
              }}
              defaultValue="newest"
            >
              <SelectTrigger className="w-[160px] bg-transparent border-none font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors h-auto p-0 focus:ring-0">
                <SelectValue placeholder="Sequencing" />
              </SelectTrigger>
              <SelectContent className="bg-black border-foreground/10">
                <SelectItem
                  value="newest"
                  className="text-white font-mono text-[10px] uppercase tracking-widest"
                >
                  Chronological
                </SelectItem>
                <SelectItem
                  value="mostLiked"
                  className="text-white font-mono text-[10px] uppercase tracking-widest"
                >
                  Social Impact
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden sm:block text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Total Modules: {filteredPrompts.length}
          </div>
        </motion.div>

        {/* Prompts Grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredPrompts?.map((prompt) => (
              <motion.div
                key={prompt?.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group relative hover-lift"
              >
                <div className="absolute -inset-[1px] bg-gradient-to-r from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative h-full bg-white/[0.02] border border-foreground/5 rounded-2xl overflow-hidden flex flex-col p-8 transition-colors group-hover:bg-white/[0.04]">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                          {prompt?.niche}
                        </span>
                      </div>
                      <h3 className="text-3xl font-display leading-tight text-white mb-2 group-hover:text-stroke transition-all duration-500">
                        {prompt?.title}
                      </h3>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
                        Authored by <span className="text-white">{prompt?.createdByName}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground font-display font-light leading-relaxed mb-8 line-clamp-3">
                    {prompt?.description}
                  </p>

                  {/* Prompt Preview */}
                  <div className="relative flex-1 rounded-xl bg-black/40 border border-foreground/5 p-6 mb-8 group-hover:border-white/10 transition-colors overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-20">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-xs font-mono leading-relaxed text-muted-foreground/80 line-clamp-4">
                      {prompt?.promptText}
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-8 border-t border-foreground/5">
                    <div className="flex items-center gap-6 ">
                      <button
                        onClick={() => handleVote(prompt?.id, 'likes')}
                        className="flex items-center gap-2 group/vote cursor-pointer"
                      >
                        <ThumbsUp className="w-3 h-3 text-muted-foreground group-hover/vote:text-white transition-colors" />
                        <span className="text-[10px] font-mono text-muted-foreground group-hover/vote:text-white">
                          {prompt.likes}
                        </span>
                      </button>
                      <button
                        onClick={() => handleVote(prompt?.id, 'dislikes')}
                        className="flex items-center gap-2 group/vote cursor-pointer"
                      >
                        <ThumbsDown className="w-3 h-3 text-muted-foreground group-hover/vote:text-white transition-colors" />
                        <span className="text-[10px] font-mono text-muted-foreground group-hover/vote:text-white">
                          {prompt?.dislikes}
                        </span>
                      </button>
                    </div>
                    <div className="flex items-center gap-4 ">
                      <button
                        onClick={() => handleBookmark(prompt?.id)}
                        className={cn(
                          'transition-all duration-300 cursor-pointer',
                          bookmarkedIds.has(prompt?.id)
                            ? 'text-white scale-110'
                            : 'text-muted-foreground hover:text-white'
                        )}
                      >
                        {bookmarkedIds.has(prompt?.id) ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(prompt?.promptText)}
                        className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white hover:opacity-70 transition-opacity cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Extract</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPrompts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-40 border border-foreground/5 rounded-3xl bg-white/[0.01]"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground mb-4">
              No Modules Detected
            </p>
            <p className="text-xl font-display font-light text-muted-foreground/60">
              Adjust filters or architecturalize a new instruction set.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
