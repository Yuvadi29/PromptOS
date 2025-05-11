"use client"

import { ReactNode, useEffect, useState } from "react"
import { Filter, Plus, ThumbsDown, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import supabase from "@/lib/supabase"
import { useSession } from "next-auth/react"
import Link from "next/link"

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

// Available niches for filtering
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
                // 1. Fetch prompts
                const response = await fetch("/api/prompt-library", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                // 2. Extract user IDs
                const userIds = [...new Set(data.map((prompt: any) => prompt.created_by))];

                // 3. Fetch user info in batch
                const { data: usersData, error: usersError } = await supabase
                    .from("users")
                    .select("id, name, username") // assuming `name` is the column for username
                    .in("id", userIds);

                if (usersError) {
                    console.error("Error fetching user data:", usersError);
                    toast.error("Failed to load user info.");
                    return;
                }

                // 4. Create a map of userId -> username (or name)
                const userMap = new Map(usersData.map(user => [user.id, user.username || user.name]));

                // 5. Combine prompt + username
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

    // Handle creating a new prompt
    const handleCreatePrompt = async () => {
        const userEmail = session?.user?.email;
        if (!userEmail) return toast.error("User not logged in");

        const { data: userData, error } = await supabase
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

        // Reset form
        setNewPrompt({
            title: "",
            description: "",
            promptText: "",
            niche: "",
        });
        setIsDialogOpen(false);
    }

    // Handle filtering prompts
    const filterPrompts = (niche: string, sort: string) => {
        let filtered = [...prompts]

        // Filter by niche
        if (niche !== "All") {
            filtered = filtered.filter((prompt) => prompt.niche === niche)
        }

        // Sort prompts
        if (sort === "mostLiked") {
            filtered = filtered.sort((a, b) => b.likes - a.likes)
        } else if (sort === "newest") {
            filtered = filtered.sort((a, b) => b.id - a.id)
        }

        setFilteredPrompts(filtered)
    }

    // Handle like/dislike
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
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
            </div>

        );
    }


    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <header className="border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Prompt Library</h1>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">Discover, create, and share effective prompts</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
                                        <Plus className="h-4 w-4" />
                                        Create Prompt
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[525px]">
                                    <DialogHeader>
                                        <DialogTitle>Create a new prompt</DialogTitle>
                                        <DialogDescription>
                                            Fill in the details below to create a new prompt. Click save when you're done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                id="title"
                                                placeholder="Enter a descriptive title"
                                                value={newPrompt?.title}
                                                onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Input
                                                id="description"
                                                placeholder="Brief description of what this prompt does"
                                                value={newPrompt?.description}
                                                onChange={(e) => setNewPrompt({ ...newPrompt, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="promptText">Prompt Text</Label>
                                            <Textarea
                                                id="promptText"
                                                placeholder="Enter the actual prompt text here"
                                                className="min-h-[100px]"
                                                value={newPrompt?.promptText}
                                                onChange={(e) => setNewPrompt({ ...newPrompt, promptText: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="niche">Niche</Label>
                                            <Select
                                                onValueChange={(value) => setNewPrompt({ ...newPrompt, niche: value })}
                                                value={newPrompt?.niche}
                                            >
                                                <SelectTrigger id="niche">
                                                    <SelectValue placeholder="Select a niche" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Niches</SelectLabel>
                                                        {niches
                                                            .filter((niche) => niche !== "All")
                                                            .map((niche) => (
                                                                <SelectItem key={niche} value={niche}>
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
                                        >
                                            Save Prompt
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2 cursor-pointer">
                                    <Filter className="h-4 w-4" />
                                    Filter
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Filter by Niche</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    {niches?.map((niche) => (
                                        <DropdownMenuItem
                                            key={niche}
                                            onClick={() => {
                                                setSelectedNiche(niche)
                                                filterPrompts(niche, sortBy)
                                            }}
                                        >
                                            {niche}
                                            {selectedNiche === niche && <span className="ml-auto">✓</span>}
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
                            <SelectTrigger className="w-[180px] cursor-pointer">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="mostLiked">Most Liked</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedNiche !== "All" && (
                        <Badge variant="outline" className="text-sm">
                            {selectedNiche}
                            <button
                                className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                onClick={() => {
                                    setSelectedNiche("All")
                                    filterPrompts("All", sortBy)
                                }}
                            >
                                ✕
                            </button>
                        </Badge>
                    )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPrompts?.map((prompt) => (
                        <Card key={prompt?.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="line-clamp-1 text-base font-semibold text-black dark:text-white">{prompt?.title}</CardTitle>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{prompt?.description}</p>
                                    </div>
                                    <Badge variant="outline">{prompt?.niche}</Badge>
                                    <Link href={`/profile/${prompt?.createdByName}`}>
                                        <span className="text-xs text-gray-400 ml-2">{prompt?.createdByName}</span>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="rounded-md bg-gray-50 dark:bg-gray-900 p-3 text-sm">
                                    <p className="line-clamp-6 font-mono">{prompt?.promptText}</p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t pt-4">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                                        onClick={() => handleVote(prompt?.id, "likes")}
                                    >
                                        <ThumbsUp className="h-4 w-4" fill="#50C878" />
                                        <span>{prompt.likes}</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                                        onClick={() => handleVote(prompt?.id, "dislikes")}
                                    >
                                        <ThumbsDown className="h-4 w-4" fill="red" />
                                        <span>{prompt?.dislikes}</span>
                                    </Button>
                                </div>
                                <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => handleCopy(prompt?.promptText)}>
                                    Copy
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {filteredPrompts?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3">
                            <Filter className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium">No prompts found</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Try changing your filters or create a new prompt.
                        </p>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="mt-4 gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create Prompt
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px]">{/* Same dialog content as above */}</DialogContent>
                        </Dialog>
                    </div>
                )}
            </main>
        </div>
    )
}
