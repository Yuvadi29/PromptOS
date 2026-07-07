'use client';

import { ReactNode, useEffect, useState } from 'react';
import {
  Filter,
  Plus,
  ThumbsDown,
  ThumbsUp,
  Sparkles,
  Copy,
  Bookmark,
  BookmarkCheck,
  Search,
  Flame,
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
import { Badge } from '@/components/ui/badge';
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

// Helper function to map niches to colors for the bento aesthetic
const getNicheColor = (niche: string) => {
  switch (niche) {
    case 'Marketing':
      return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 'Programming':
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'Creative Writing':
      return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    case 'Technical Writing':
      return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    case 'HR':
      return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
    default:
      return 'text-primary bg-primary/10 border-primary/20';
  }
};

export default function PromptLibrary() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [selectedNiche, setSelectedNiche] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Load cache
    const cachedPrompts = sessionStorage.getItem('library_prompts');
    if (cachedPrompts) {
      try {
        const parsed = JSON.parse(cachedPrompts);
        setPrompts(parsed);
        setFilteredPrompts(parsed);
        setLoading(false);
      } catch (e) {
        console.error('Failed to parse cached prompts', e);
      }
    }

    const cachedBookmarks = sessionStorage.getItem('library_bookmarks');
    if (cachedBookmarks) {
      try {
        setBookmarkedIds(new Set(JSON.parse(cachedBookmarks)));
      } catch (e) {
        console.error('Failed to parse cached bookmarks', e);
      }
    }

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
        sessionStorage.setItem('library_prompts', JSON.stringify(formatted));
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch prompts', error);
        if (!cachedPrompts) {
          toast.error('Failed to load prompts. Try again later.');
        }
      }
    };

    const fetchBookmarks = async () => {
      try {
        const res = await fetch('/api/prompt-library/bookmark');
        if (res.ok) {
          const ids: number[] = await res.json();
          setBookmarkedIds(new Set(ids));
          sessionStorage.setItem('library_bookmarks', JSON.stringify(ids));
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

    const updatedPrompts = [savedPrompt, ...prompts];
    setPrompts(updatedPrompts);
    setFilteredPrompts([savedPrompt, ...filteredPrompts]);
    sessionStorage.setItem('library_prompts', JSON.stringify(updatedPrompts));
    toast.success('Prompt created successfully');

    setNewPrompt({ title: '', description: '', promptText: '', niche: '' });
    setIsDialogOpen(false);
  };

  useEffect(() => {
    let filtered = [...prompts];

    if (selectedNiche !== 'All') {
      filtered = filtered.filter((prompt) => prompt.niche === selectedNiche);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.promptText.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'mostLiked') {
      filtered = filtered.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'newest') {
      filtered = filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredPrompts(filtered);
  }, [selectedNiche, sortBy, searchQuery, prompts]);

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
    sessionStorage.setItem('library_prompts', JSON.stringify(updatedPrompts));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to Clipboard!!');
  };

  const handleBookmark = async (promptId: number) => {
    // Optimistic update
    const wasBookmarked = bookmarkedIds.has(promptId);
    const nextBookmarks = new Set(bookmarkedIds);
    if (wasBookmarked) nextBookmarks.delete(promptId);
    else nextBookmarks.add(promptId);

    setBookmarkedIds(nextBookmarks);
    sessionStorage.setItem('library_bookmarks', JSON.stringify(Array.from(nextBookmarks)));

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
      // Revert on failure
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (wasBookmarked) next.add(promptId);
        else next.delete(promptId);
        sessionStorage.setItem('library_bookmarks', JSON.stringify(Array.from(next)));
        return next;
      });
      toast.error('Failed to update bookmark');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full animate-spin" />
            <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-muted-foreground animate-pulse font-mono text-sm tracking-widest uppercase">
            Initializing Vault...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full pt-24 px-4 sm:px-6 pb-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-6 shadow-xl">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Community Vault
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-white">
            Discover & Share{' '}
            <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              Prompts
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore a highly curated collection of prompts engineered for perfection. Find exactly
            what you need to scale your workflows.
          </p>

          {/* Filter & Search Bar - Glassmorphic */}
          <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-2xl">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, description or content..."
                className="w-full pl-11 bg-transparent border-none text-foreground shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-px h-8 bg-white/10 hidden md:block" />

            <div className="flex items-center gap-2 w-full md:w-auto px-2 pb-2 md:pb-0 justify-between md:justify-start">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="gap-2 text-foreground hover:bg-white/10 rounded-xl h-10 px-4"
                  >
                    <Filter className="h-4 w-4" />
                    {selectedNiche !== 'All' ? selectedNiche : 'All Niches'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-xl border-border rounded-xl">
                  <DropdownMenuLabel className="text-muted-foreground text-xs uppercase tracking-wider">
                    Filter by Niche
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuGroup>
                    {niches?.map((niche) => (
                      <DropdownMenuItem
                        key={niche}
                        onClick={() => setSelectedNiche(niche)}
                        className="text-foreground hover:bg-primary/20 focus:bg-primary/20 cursor-pointer rounded-lg"
                      >
                        {niche}
                        {selectedNiche === niche && <span className="ml-auto text-primary">✓</span>}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] bg-transparent border-none text-foreground hover:bg-white/10 rounded-xl h-10 px-4 focus:ring-0 shadow-none">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-border rounded-xl">
                  <SelectItem
                    value="newest"
                    className="cursor-pointer focus:bg-primary/20 rounded-lg"
                  >
                    Newest First
                  </SelectItem>
                  <SelectItem
                    value="mostLiked"
                    className="cursor-pointer focus:bg-primary/20 rounded-lg"
                  >
                    Top Rated
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="w-px h-8 bg-white/10 mx-2 hidden md:block" />

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(249,115,22,0.3)] rounded-xl h-10 px-4">
                    <Plus className="h-4 w-4" />
                    Create
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px] bg-card/80 backdrop-blur-3xl border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                  <DialogHeader className="relative z-10">
                    <DialogTitle className="text-2xl font-bold">Create a new prompt</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Contribute to the vault. Craft something powerful.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-5 py-4 relative z-10">
                    <div className="space-y-1">
                      <Label
                        htmlFor="title"
                        className="text-xs uppercase tracking-wider text-muted-foreground"
                      >
                        Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="E.g., SEO Blog Post Generator"
                        value={newPrompt?.title}
                        onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
                        className="bg-black/30 border-white/10 focus:border-primary/50 rounded-xl h-12"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label
                        htmlFor="description"
                        className="text-xs uppercase tracking-wider text-muted-foreground"
                      >
                        Description
                      </Label>
                      <Input
                        id="description"
                        placeholder="What does this prompt do?"
                        value={newPrompt?.description}
                        onChange={(e) =>
                          setNewPrompt({ ...newPrompt, description: e.target.value })
                        }
                        className="bg-black/30 border-white/10 focus:border-primary/50 rounded-xl h-12"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label
                        htmlFor="promptText"
                        className="text-xs uppercase tracking-wider text-muted-foreground"
                      >
                        Prompt Text
                      </Label>
                      <Textarea
                        id="promptText"
                        placeholder="Enter the raw prompt instruction here..."
                        className="min-h-[120px] bg-black/30 border-white/10 focus:border-primary/50 rounded-xl resize-none font-mono text-sm"
                        value={newPrompt?.promptText}
                        onChange={(e) => setNewPrompt({ ...newPrompt, promptText: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label
                        htmlFor="niche"
                        className="text-xs uppercase tracking-wider text-muted-foreground"
                      >
                        Niche
                      </Label>
                      <Select
                        onValueChange={(value) => setNewPrompt({ ...newPrompt, niche: value })}
                        value={newPrompt?.niche}
                      >
                        <SelectTrigger
                          id="niche"
                          className="bg-black/30 border-white/10 focus:border-primary/50 rounded-xl h-12"
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-card/95 backdrop-blur-xl border-border rounded-xl">
                          {niches
                            .filter((niche) => niche !== 'All')
                            .map((niche) => (
                              <SelectItem
                                key={niche}
                                value={niche}
                                className="focus:bg-primary/20 rounded-lg cursor-pointer"
                              >
                                {niche}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="relative z-10">
                    <Button
                      type="submit"
                      onClick={handleCreatePrompt}
                      disabled={!newPrompt.title || !newPrompt.promptText || !newPrompt.niche}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(249,115,22,0.3)] rounded-xl h-12 text-base font-semibold transition-all disabled:opacity-50 disabled:shadow-none"
                    >
                      Publish to Vault
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>

        {/* CSS Columns (Masonry Layout) for Prompts */}
        {filteredPrompts.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence>
              {filteredPrompts.map((prompt, index) => (
                <motion.div
                  key={prompt?.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="break-inside-avoid"
                >
                  <div className="group relative border border-white/10 bg-white/5 backdrop-blur-xl rounded-[24px] p-6 flex flex-col hover:bg-white/10 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1">
                    {/* Hover Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4 gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors leading-tight">
                            {prompt?.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-3">
                            <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] uppercase font-bold border border-primary/30">
                              {prompt?.createdByName?.charAt(0) || 'U'}
                            </span>
                            <span>{prompt?.createdByName}</span>
                          </div>
                          <p className="text-sm text-muted-foreground/80 leading-relaxed">
                            {prompt?.description}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            'px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border',
                            getNicheColor(prompt?.niche)
                          )}
                        >
                          {prompt?.niche}
                        </Badge>
                      </div>

                      {/* Terminal Snippet */}
                      <div className="mt-2 mb-6 rounded-xl bg-black/50 border border-white/5 p-4 shadow-inner overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />
                        <p className="text-[13px] font-mono text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed line-clamp-6">
                          {prompt?.promptText}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 px-3 rounded-lg text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-400 group/btn transition-colors"
                            onClick={() => handleVote(prompt?.id, 'likes')}
                          >
                            <ThumbsUp className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                            <span className="text-xs font-semibold">{prompt.likes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 px-3 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-400 group/btn transition-colors"
                            onClick={() => handleVote(prompt?.id, 'dislikes')}
                          >
                            <ThumbsDown className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                            <span className="text-xs font-semibold">{prompt?.dislikes}</span>
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleBookmark(prompt?.id)}
                            className={cn(
                              'h-9 w-9 rounded-lg transition-all hover:scale-110',
                              bookmarkedIds.has(prompt?.id)
                                ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(249,115,22,0.2)]'
                                : 'bg-white/5 text-muted-foreground hover:bg-primary/10 hover:text-primary'
                            )}
                            title={bookmarkedIds.has(prompt?.id) ? 'Remove bookmark' : 'Bookmark'}
                          >
                            {bookmarkedIds.has(prompt?.id) ? (
                              <BookmarkCheck className="h-4 w-4" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(prompt?.promptText)}
                            className="h-9 w-9 bg-white/5 rounded-lg text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all hover:scale-110"
                            title="Copy Prompt"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 mb-6">
              <Flame className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">The Vault is Empty</h3>
            <p className="text-muted-foreground max-w-sm mb-8">
              No prompts match your current filters. Adjust your search or create a new prompt to
              populate the library.
            </p>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(249,115,22,0.3)] rounded-xl"
              onClick={() => {
                setSelectedNiche('All');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
