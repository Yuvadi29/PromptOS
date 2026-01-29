"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, BookOpen, Clock } from "lucide-react";
import Image from "next/image";

export default function LibraryTab() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/library")
            .then((res) => res.json())
            .then((data) => {
                setItems(data);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-white/5 rounded-2xl"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-pink-400" />
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">
                    Public Prompt Library
                </h2>
                <span className="bg-white/10 text-white text-xs px-2 py-1 rounded-full">{items.length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <Card key={item.id} className="p-6 bg-[#0F0F12] border-white/5 hover:border-pink-500/30 transition-all group relative overflow-hidden flex flex-col h-full">
                        <div className="absolute top-0 right-0 p-24 rounded-full bg-pink-500/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className="flex items-start justify-between mb-4">
                            <Badge variant="outline" className="border-pink-500/30 text-pink-300 bg-pink-500/5 hover:bg-pink-500/10 transition-colors">
                                {item.niche}
                            </Badge>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <span className="flex items-center gap-1 hover:text-green-400 transition-colors"><ThumbsUp className="h-3 w-3" /> {item.likes || 0}</span>
                                <span className="flex items-center gap-1 hover:text-red-400 transition-colors"><ThumbsDown className="h-3 w-3" /> {item.dislikes || 0}</span>
                            </div>
                        </div>

                        <h3 className="font-bold text-lg text-white mb-2 line-clamp-1 group-hover:text-pink-300 transition-colors">{item.prompt_title}</h3>
                        <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-1">{item.prompt_description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 overflow-hidden relative border border-white/10">
                                    {item.users?.image ? (
                                        <Image src={item.users.image} alt={item.users.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[8px] text-white">
                                            {item.users?.name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs text-gray-500">{item.users?.name || "Unknown"}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Clock className="h-3 w-3" />
                                {new Date(item.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
