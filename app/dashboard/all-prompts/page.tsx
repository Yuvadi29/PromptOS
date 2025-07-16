'use client';

import { useUser } from "@/context/UserContext";
import supabase from "@/lib/supabase";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import gsap from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const Page = () => {
    const user = useUser();
    const [prompts, setPrompts] = useState<any[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

    useEffect(() => {
        const getPrompts = async () => {
            const { data: userData } = await supabase
                .from("users")
                .select("id")
                .eq("email", user?.email)
                .single();

            const { data, error } = await supabase
                .from("prompts")
                .select("id, prompt_value")
                .eq("created_by", userData?.id);

            if (error) {
                toast.error("Error fetching prompts");
                return;
            }

            setPrompts(data || []);
        };

        if (user?.email) getPrompts();
    }, [user?.email]);

    useEffect(() => {
        if (prompts.length && containerRef.current) {
            const cards = containerRef.current.querySelectorAll(".prompt-card");
            gsap.fromTo(
                cards,
                {
                    opacity: 0,
                    y: 30
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power3.out",
                    stagger: 0.1
                }
            );
        }
    }, [prompts]);

    return (
        <>
            <div ref={containerRef} className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {prompts?.map((prompt, index) => {
                    let cleanedPrompt = prompt.prompt_value;

                    // Remove 'text' from beginning if it starts with it (case-insensitive)
                    if (/^text\s?/i.test(cleanedPrompt)) {
                        cleanedPrompt = cleanedPrompt.replace(/^text\s?/i, "");
                    }

                    return (
                        <Card
                            key={prompt.id}
                            className="prompt-card p-4 h-[220px] overflow-hidden relative flex flex-col justify-between"
                        >
                            <div className="flex items-start gap-3">
                                <div className="text-8xl font-bold text-gray-300 leading-none">#{index + 1}</div>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-5">
                                    {cleanedPrompt}
                                </p>
                            </div>

                            <div className="pt-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="text-xs p-0 h-auto cursor-pointer"
                                            onClick={() => setSelectedPrompt(cleanedPrompt)}
                                        >
                                            Read more
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-base">Full Prompt</DialogTitle>
                                        </DialogHeader>
                                        <div className="max-h-[400px] overflow-y-auto whitespace-pre-wrap text-sm text-muted-foreground">
                                            {cleanedPrompt}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </Card>
                    );
                })}

            </div>
        </>
    );
};

export default Page;
