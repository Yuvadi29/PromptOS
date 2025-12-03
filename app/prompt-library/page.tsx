"use client"

import { ReactNode, useEffect, useState } from "react"
import { Filter, Plus, ThumbsDown, ThumbsUp, Sparkles, Copy, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { supabaseAdmin } from "@/lib/supabase"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Prompt {
    [x: string]: ReactNode
    id: number;
    title: string;
    description: string;
    promptText: string;
    niche: string;
    likes: number;
    dislikes: number;
}

const niches = ["All", "Creative Writing", "Technical Writing", "Marketing", "Programming", "HR"]

export default function PromptLibrary() {
    const [prompts, setPrompts] = useState<Prompt[]>([])
    const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
    const [selectedNiche, setSelectedNiche] = useState("All")
    const [sortBy, setSortBy] = useState("newest")
    const { data: session } = useSession();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromptsWithUsernames = async () => {
            try {
                const response = await fetch("/api/prompt-library", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await response.json();
                const userIds = [...new Set(data?.map((prompt: any) => prompt?.created_by))];

                const { data: usersData, error: usersError } = await supabaseAdmin
                    .from("users")
                    .select("id, name, username")
                    .in("id", userIds);

                if (usersError) {
                    console.error("Error fetching user data:", usersError);
                    toast.error("Failed to load user info.");
                    return;
                }

                const userMap = new Map(usersData.map(user => [user.id, user.username || user.name]));

                const formatted = data?.map((prompt: any, index: number) => ({
                    id: prompt?.id || index + 1,
                    createdBy: prompt?.created_by,
                    createdByName: userMap?.get(prompt?.created_by) || "Unknown",
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
                console.error("Failed to fetch prompts", error);
                toast.error("Failed to load prompts. Try again later.");
            }
        };

        fetchPromptsWithUsernames();
    }, []);

    const [newPrompt, setNewPrompt] = useState({
        title: "",
        description: "",
        promptText: "",
        niche: "",
    })

    const handleCreatePrompt = async () => {
        const userEmail = session?.user?.email;
        if (!userEmail) return toast.error("User not logged in");

        const { data: userData, error } = await supabaseAdmin
            .from("users")
            .select("id")
            .eq("email", userEmail)
            .single();

        if (error || !userData) {
            return toast.error("Failed to fetch user ID");
        }

        const createdPrompt = {
            userId: userData?.id,
            title: newPrompt?.title,
            description: newPrompt?.description,
            promptText: newPrompt?.promptText,
            niche: newPrompt?.niche,
        };

        const res = await fetch("/api/prompt-library", {
            method: "POST",
            body: JSON.stringify(createdPrompt),
        });

        if (!res.ok) return toast.error("Failed to save prompt!! Please try again");

        const savedPrompt = {
            ...createdPrompt,
            id: prompts.length + 1,
            likes: 0,
            dislikes: 0,
        };

        setPrompts([savedPrompt, ...prompts])
        setFilteredPrompts([savedPrompt, ...filteredPrompts])
        toast.success("Prompt created successfully");

        setNewPrompt({ title: "", description: "", promptText: "", niche: "" });
        setIsDialogOpen(false);
    }

    const filterPrompts = (niche: string, sort: string) => {
        let filtered = [...prompts]

        if (niche !== "All") {
            filtered = filtered.filter((prompt) => prompt.niche === niche)
        }

        if (sort === "mostLiked") {
            filtered = filtered.sort((a, b) => b.likes - a.likes)
        } else if (sort === "newest") {
            filtered = filtered.sort((a, b) => b.id - a.id)
        }

        setFilteredPrompts(filtered)
    }

    const handleVote = async (id: number, type: "likes" | "dislikes") => {
        const res = await fetch("/api/prompt/vote", {
            method: "POST",
            body: JSON.stringify({ promptId: id, type }),
        });

        if (!res.ok) return toast.error("Failed to register vote. Try again later");

        const updatedPrompts = prompts?.map((prompt) => {
            if (prompt?.id === id) {
                return {
                    ...prompt,
                    likes: type === "likes" ? prompt?.likes + 1 : prompt?.likes,
                    dislikes: type === "dislikes" ? prompt?.dislikes + 1 : prompt?.dislikes,
                };
            }
            return prompt;
        })

        setPrompts(updatedPrompts)
        filterPrompts(selectedNiche, sortBy)
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success('Copied to Clipboard!!')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-zinc-800 border-t-orange-500 rounded-full animate-spin" />
                    <p className="text-zinc-400 animate-pulse">Loading prompts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-2">
                                <Sparkles className="w-4 h-4 text-orange-400" />
                                <span className="text-xs font-medium text-orange-300">Community Library</span>
                            </div>
                            <h1 className="text-3xl font-bold">
                                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                                    Prompt Library
                                </span>
                            </h1>
                            <p className="mt-1 text-zinc-400">Discover, create, and share effective prompts</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500">
                                        <Plus className="h-4 w-4" />
                                        Create Prompt
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[525px] bg-zinc-900 border-zinc-800">
                                    <DialogHeader>
                                        <DialogTitle className="text-white">Create a new prompt</DialogTitle>
                                        <DialogDescription className="text-zinc-400">
                                            Fill in the details below to create a new prompt. Click save when you&apos;re done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="title" className="text-zinc-300">Title</Label>
                                            <Input
                                                id="title"
                                                placeholder="Enter a descriptive title"
                                                value={newPrompt?.title}
                                                onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
                                                className="bg-zinc-800 border-zinc-700 text-white focus:ring-orange-500"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="description" className="text-zinc-300">Description</Label>
                                            <Input
                                                id="description"
                                                placeholder="Brief description of what this prompt does"
                                                value={newPrompt?.description}
                                                onChange={(e) => setNewPrompt({ ...newPrompt, description: e.target.value })}
                                                className="bg-zinc-800 border-zinc-700 text-white focus:ring-orange-500"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="promptText" className="text-zinc-300">Prompt Text</Label>
                                            <Textarea
                                                id="promptText"
                                                placeholder="Enter the actual prompt text here"
                                                className="min-h-[100px] bg-zinc-800 border-zinc-700 text-white focus:ring-orange-500"
                                                value={newPrompt?.promptText}
                                                onChange={(e) => setNewPrompt({ ...newPrompt, promptText: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="niche" className="text-zinc-300">Niche</Label>
                                            <Select
                                                onValueChange={(value) => setNewPrompt({ ...newPrompt, niche: value })}
                                                value={newPrompt?.niche}
                                            >
                                                <SelectTrigger id="niche" className="bg-zinc-800 border-zinc-700 text-white">
                                                    <SelectValue placeholder="Select a niche" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                                    <SelectGroup>
                                                        <SelectLabel className="text-zinc-400">Niches</SelectLabel>
                                                        {niches
                                                            .filter((niche) => niche !== "All")
                                                            .map((niche) => (
                                                                <SelectItem key={niche} value={niche} className="text-white focus:bg-orange-500/20">
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
                                            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500"
                                        >
                                            Save Prompt
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </motion.div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2 bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800">
                                    <Filter className="h-4 w-4" />
                                    Filter
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800">
                                <DropdownMenuLabel className="text-zinc-400">Filter by Niche</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-zinc-800" />
                                <DropdownMenuGroup>
                                    {niches?.map((niche) => (
                                        <DropdownMenuItem
                                            key={niche}
                                            onClick={() => {
                                                setSelectedNiche(niche)
                                                filterPrompts(niche, sortBy)
                                            }}
                                            className="text-white hover:bg-zinc-800 focus:bg-orange-500/20"
                                        >
                                            {niche}
                                            {selectedNiche === niche && <span className="ml-auto text-orange-500">✓</span>}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Select
                            onValueChange={(value) => {
                                setSortBy(value)
                                filterPrompts(selectedNiche, value)
                            }}
                            defaultValue="newest"
                        >
                            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-white">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                <SelectItem value="newest" className="text-white focus:bg-orange-500/20">Newest</SelectItem>
                                <SelectItem value="mostLiked" className="text-white focus:bg-orange-500/20">Most Liked</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedNiche !== "All" && (
                        <Badge variant="outline" className="text-sm border-orange-500/50 text-orange-300">
                            {selectedNiche}
                            <button
                                className="ml-2 text-zinc-400 hover:text-white"
                                onClick={() => {
                                    setSelectedNiche("All")
                                    filterPrompts("All", sortBy)
                                }}
                            >
                                ✕
                            </button>
                        </Badge>
                    )}
                </motion.div>

                {/* Prompts Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPrompts?.map((prompt, index) => (
                        <motion.div
                            key={prompt?.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative"
                        >
                            <div className="h-full p-6 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 flex flex-col">
                                {/* Hover glow */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl" />

                                <div className="relative flex-1 flex flex-col">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-white mb-1 line-clamp-1 group-hover:text-orange-400 transition-colors">{prompt?.title}</h3>
                                            <p className="text-sm text-zinc-400 line-clamp-2">{prompt?.description}</p>
                                        </div>
                                        <Badge variant="outline" className="ml-2 border-zinc-700 text-zinc-300 shrink-0">
                                            {prompt?.niche}
                                        </Badge>
                                    </div>

                                    {/* Prompt Text */}
                                    <div className="flex-1 rounded-lg bg-zinc-800/50 p-3 mb-4 border border-zinc-800 group-hover:border-orange-500/20 transition-colors">
                                        <p className="text-sm font-mono text-zinc-300 line-clamp-6">{prompt?.promptText}</p>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-1 text-zinc-400 hover:text-green-400 h-8 px-2"
                                                onClick={() => handleVote(prompt?.id, "likes")}
                                            >
                                                <ThumbsUp className="h-4 w-4" />
                                                <span className="text-xs">{prompt.likes}</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-1 text-zinc-400 hover:text-red-400 h-8 px-2"
                                                onClick={() => handleVote(prompt?.id, "dislikes")}
                                            >
                                                <ThumbsDown className="h-4 w-4" />
                                                <span className="text-xs">{prompt?.dislikes}</span>
                                            </Button>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCopy(prompt?.promptText)}
                                            className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-white h-8 hover:text-orange-400 hover:border-orange-500/50"
                                        >
                                            <Copy className="h-3 w-3 mr-1" />
                                            Copy
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredPrompts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-zinc-500">No prompts found. Try adjusting your filters or create a new prompt!</p>
                    </div>
                )}
            </main>
        </div>
    )
}
