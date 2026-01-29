"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Edit2, Settings, Activity, Star, Sparkles, Zap, ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ProfilePage() {
    const { data: session } = useSession();
    const user = session?.user;
    const [prompts, setPrompts] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalPrompts: 0,
        totalLikes: 0,
        reputation: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedPrompt, setSelectedPrompt] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.email) return;

            try {
                // Get user ID
                const { data: userData, error: userError } = await supabaseAdmin
                    .from('users')
                    .select('id, created_at')
                    .eq('email', user.email)
                    .single();

                if (userError || !userData) {
                    console.error("User fetch error:", userError);
                    return;
                }

                // Get User Prompts
                const { data: promptsData, error: promptsError } = await supabaseAdmin
                    .from('prompts')
                    .select('*')
                    .eq('created_by', userData?.id)
                    .order('created_at', { ascending: false });

                if (promptsError) {
                    console.error("Prompts fetch error:", promptsError);
                } else {
                    console.log(promptsData)
                    setPrompts(promptsData || []);
                }

                // Calculate Stats
                const totalPrompts = promptsData?.length || 0;
                const totalLikes = promptsData?.reduce((acc, curr) => acc + (curr.likes || 0), 0) || 0;
                // Simple reputation calculation: (likes - dislikes) * 10 + prompts * 5
                const totalDislikes = promptsData?.reduce((acc, curr) => acc + (curr.dislikes || 0), 0) || 0;
                const reputation = Math.max(0, (totalLikes - totalDislikes) * 10 + totalPrompts * 5);

                setStats({
                    totalPrompts,
                    totalLikes,
                    reputation
                });

            } catch (error) {
                console.error("Error fetching profile data:", error);
                toast.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.email]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to Clipboard!!');
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-20">
            {/* Sidebar blur overlay */}
            {selectedPrompt && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    style={{ marginLeft: '-280px' }}
                />
            )}
            {/* Banner */}
            <div className="h-64 w-full bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/80" />
            </div>

            <div className="container mx-auto px-4 -mt-32 relative z-10">
                <div className="flex flex-col md:flex-row items-end gap-8 mb-8">
                    {/* Avatar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <div className="h-40 w-40 rounded-full p-1 bg-zinc-950">
                            <Avatar className="h-full w-full border-4 border-orange-500">
                                <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                                <AvatarFallback className="text-4xl bg-zinc-900 text-orange-500">
                                    {user?.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="absolute bottom-2 right-2 p-2 bg-orange-500 rounded-full border-4 border-zinc-950">
                            <Sparkles className="w-5 h-5 text-white fill-white" />
                        </div>
                    </motion.div>

                    {/* Info */}
                    <div className="flex-1 pb-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                                {user?.name}
                                {/* <Badge className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border-orange-500/50">
                                    Pro Member
                                </Badge> */}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-zinc-400">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {user?.email}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Joined November 2025
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Actions */}
                    {/* <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="pb-4 flex gap-3"
                    >
                        <Button variant="outline" className="border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-white gap-2">
                            <Settings className="w-4 h-4" />
                            Settings
                        </Button>
                        <Button className="bg-orange-600 hover:bg-orange-500 text-white gap-2">
                            <Edit2 className="w-4 h-4" />
                            Edit Profile
                        </Button>
                    </motion.div> */}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: "Total Prompts", value: stats.totalPrompts, icon: Zap, color: "text-yellow-500" },
                        { label: "Total Likes", value: stats.totalLikes, icon: Star, color: "text-orange-500" },
                        { label: "Reputation", value: stats.reputation, icon: Activity, color: "text-red-500" },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-zinc-400">{stat.label}</span>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <div className="text-3xl font-bold">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="my-prompts" className="w-full">
                    <TabsList className="w-full justify-start bg-zinc-900/50 border-b border-zinc-800 rounded-none h-auto p-0 mb-8">
                        {["My Prompts", "Saved", "Activity", "Settings"].map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab.toLowerCase().replace(" ", "-")}
                                className="px-8 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:rounded data-[state=active]:bg-transparent data-[state=active]:text-orange-500 text-zinc-400 hover:text-white transition-all"
                            >
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="my-prompts" className="mt-0">
                        {loading ? (
                            <div className="text-center py-20 text-zinc-500">Loading prompts...</div>
                        ) : prompts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {prompts?.map((prompt, i) => (
                                    <motion.div
                                        key={prompt?.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => setSelectedPrompt(prompt)}
                                        className="group p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 transition-all cursor-pointer flex flex-col h-full"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                                                <Zap className="w-5 h-5" />
                                            </div>
                                            {/* <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                                                {prompt.niche || "General"}
                                            </Badge> */}
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-400 transition-colors line-clamp-1">
                                            {prompt?.original_prompt || "Untitled Prompt"}
                                        </h3>
                                        <p className="text-zinc-400 text-sm mb-4 line-clamp-2 flex-1">
                                            {prompt.prompt_description || prompt.promptText || "No description"}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-zinc-500 mt-auto pt-4 border-t border-zinc-800">
                                            <span>{format(new Date(prompt.created_at), 'MMM d, yyyy')}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    <ThumbsUp className="w-3 h-3" />
                                                    {prompt.likes || 0}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 hover:text-orange-500"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCopy(prompt.promptText);
                                                    }}
                                                >
                                                    <Copy className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-zinc-500">
                                No prompts created yet. Start creating to see them here!
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="saved">
                        <div className="text-center py-20 text-zinc-500">
                            No saved prompts yet.
                        </div>
                    </TabsContent>

                    <TabsContent value="activity">
                        <div className="text-center py-20 text-zinc-500">
                            No recent activity.
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Prompt Detail Modal */}
            <Dialog open={!!selectedPrompt} onOpenChange={(open) => !open && setSelectedPrompt(null)}>
                <DialogContent className="max-w-6xl h-[calc(100vh-4rem)] overflow-y-auto bg-zinc-900 border-zinc-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-orange-400 flex items-center gap-2">
                            <Sparkles className="w-6 h-6" />
                            Prompt Details
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            View your original prompt and its enhanced version
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        {/* Original Prompt */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
                                    <User className="w-5 h-5 text-orange-500" />
                                    Original Prompt
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCopy(selectedPrompt?.original_prompt || "")}
                                    className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-white"
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy
                                </Button>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
                                <p className="text-zinc-300 whitespace-pre-wrap">
                                    {selectedPrompt?.original_prompt || "No original prompt available"}
                                </p>
                            </div>
                        </div>

                        {/* Enhanced Prompt */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-orange-500" />
                                    Enhanced Prompt
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCopy(selectedPrompt?.prompt_value || "")}
                                    className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-white"
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy
                                </Button>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/5 to-amber-500/5 border border-orange-500/20">
                                <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                    {selectedPrompt?.prompt_value || "No enhanced prompt available"}
                                </p>
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4 text-zinc-500">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {selectedPrompt?.created_at && format(new Date(selectedPrompt.created_at), 'MMM d, yyyy')}
                                </div>
                                <div className="flex items-center gap-2">
                                    <ThumbsUp className="w-4 h-4" />
                                    {selectedPrompt?.likes || 0} likes
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
