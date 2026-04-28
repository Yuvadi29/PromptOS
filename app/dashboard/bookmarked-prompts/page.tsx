'use client';

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookmarkX, Copy, Bookmark, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface BookmarkedPrompt {
    bookmarkId: string;
    id: number;
    title: string;
    description: string;
    promptText: string;
    niche: string;
    likes: number;
    dislikes: number;
    createdByName: string;
    createdByImage?: string;
}

export default function BookmarkedPromptsPage() {
    const [prompts, setPrompts] = useState<BookmarkedPrompt[]>([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const res = await fetch("/api/prompt-library/bookmark?populated=true");
                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();

                const formatted: BookmarkedPrompt[] = (data || [])
                    .filter((item: any) => item.prompt_library) // filter out deleted prompts
                    .map((item: any) => ({
                        bookmarkId: item.id,
                        id: item.prompt_library.id,
                        title: item.prompt_library.prompt_title,
                        description: item.prompt_library.prompt_description,
                        promptText: item.prompt_library.promptText,
                        niche: item.prompt_library.niche,
                        likes: item.prompt_library.likes || 0,
                        dislikes: item.prompt_library.dislikes || 0,
                        createdByName: item.prompt_library.users?.name || item.prompt_library.users?.username || "Unknown",
                        createdByImage: item.prompt_library.users?.image,
                    }));

                setPrompts(formatted);
            } catch (err) {
                console.error("Failed to fetch bookmarks", err);
                toast.error("Failed to load bookmarked prompts");
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, []);

    useEffect(() => {
        if (prompts.length && containerRef.current) {
            const cards = containerRef.current.querySelectorAll(".bookmark-card");
            gsap.fromTo(
                cards,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 }
            );
        }
    }, [prompts]);

    const handleRemoveBookmark = async (promptId: number) => {
        try {
            const res = await fetch("/api/prompt-library/bookmark", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ promptId }),
            });

            if (!res.ok) throw new Error();

            setPrompts((prev) => prev.filter((p) => p.id !== promptId));
            toast.success("Bookmark removed");
        } catch {
            toast.error("Failed to remove bookmark");
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to Clipboard!");
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 border-4 border-zinc-800 border-t-amber-500 rounded-full animate-spin" />
                    <p className="text-zinc-400 animate-pulse text-sm">Loading bookmarks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Profile
                </Link>

                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center">
                        <Bookmark className="w-5 h-5 text-amber-400" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                            Bookmarked Prompts
                        </span>
                    </h1>
                </div>
                <p className="text-sm text-zinc-500">
                    {prompts.length} prompt{prompts.length !== 1 ? "s" : ""} saved from the community library
                </p>
            </motion.div>

            {prompts.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                >
                    <Bookmark className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500 text-lg mb-2">No bookmarks yet</p>
                    <p className="text-zinc-600 text-sm mb-6">
                        Browse the Prompt Library and bookmark prompts you find useful!
                    </p>
                    <Link href="/prompt-library">
                        <Button className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500">
                            Go to Prompt Library
                        </Button>
                    </Link>
                </motion.div>
            ) : (
                <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prompts.map((prompt) => (
                        <div key={prompt.bookmarkId} className="bookmark-card group relative">
                            <div className="h-full p-6 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 flex flex-col">
                                {/* Hover glow */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl" />

                                <div className="relative flex-1 flex flex-col">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors mb-1">
                                                {prompt.title}
                                            </h3>
                                            <p className="text-xs text-zinc-500 mb-2">
                                                by <span className="text-zinc-300 font-medium">{prompt.createdByName}</span>
                                            </p>
                                            <p className="text-sm text-zinc-400 line-clamp-2">{prompt.description}</p>
                                        </div>
                                        <Badge variant="outline" className="ml-2 border-zinc-700 text-zinc-300 shrink-0">
                                            {prompt.niche}
                                        </Badge>
                                    </div>

                                    {/* Prompt Text */}
                                    <div className="flex-1 rounded-lg bg-zinc-800/50 p-3 mb-4 border border-zinc-800 group-hover:border-amber-500/20 transition-colors">
                                        <p className="text-sm font-mono text-zinc-300 line-clamp-6">{prompt.promptText}</p>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveBookmark(prompt.id)}
                                            className="gap-1.5 text-zinc-400 hover:text-red-400 h-8 px-2"
                                        >
                                            <BookmarkX className="h-4 w-4" />
                                            <span className="text-xs">Remove</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCopy(prompt.promptText)}
                                            className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-white h-8 hover:text-amber-400 hover:border-amber-500/50"
                                        >
                                            <Copy className="h-3 w-3 mr-1" />
                                            Copy
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
