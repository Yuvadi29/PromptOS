"use client";

import ScoreCard from '@/components/ScoreCard';
import ScoringCriteria from '@/components/ScoringCriteria'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'
import { toast } from 'sonner';

const page = () => {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [score, setScore] = useState(null);

    const handleScore = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!prompt?.trim()) {
            toast.warning("Empty Prompt. Please enter a prompt to score")
        }
        setIsLoading(true);

        try {
            const res = await fetch('/api/score-prompt', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                })
            });

            if (res.ok) {
                const data = await res.json();
                setScore(data);
                setIsLoading(false)
            } else {
                console.warn("Scoring Failed.");
            }
        } catch (error) {

        }
    }

    return (
        <main className='container mx-auto px-4 py-12 max-w-4xl'>
            <h1 className="text-4xl font-bold text-center mb-8">Prompt Score</h1>
            <p className="text-center text-muted-foreground mb-8">Enter your prompt below to receive a quality score and feedback</p>

            <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Enter Your Prompt</CardTitle>
                        </CardHeader>
                        <form onSubmit={handleScore}>
                            <CardContent>
                                <Textarea
                                    placeholder='Write your prompt here...'
                                    className='min-h-[200px] resize-none'
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                            </CardContent>

                            <CardFooter className='flex justify-end mt-4 '>
                                <Button className='cursor-pointer'>{isLoading ? "Scoring..." : "Score Prompt"}</Button>
                            </CardFooter>
                        </form>
                    </Card>
                    {score && (
                        <ScoreCard score={score} />
                    )}
                </div>
                <div>
                    <ScoringCriteria />
                </div>
            </div>
        </main>
    )
}

export default page