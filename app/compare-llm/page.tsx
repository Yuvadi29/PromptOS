"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ComparisonResults } from "@/components/comparison-results"
import { SidebarInset } from "@/components/ui/sidebar"

export default function LLMComparison() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{
    model1: string | null
    model2: string | null
    model3: string | null
  }>({
    model1: null,
    model2: null,
    model3: null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
  
    setIsLoading(true);
    setResults({ model1: null, model2: null, model3: null });
  
    try {
      const res = await fetch('/api/compare-llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
  
      if (!res.body) throw new Error("No response stream");
  
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
  
      let currentText = '';
      const modelChunks = {
        model1: '',
        model2: '',
        model3: '',
      };
  
      let currentModel: keyof typeof modelChunks | null = null;
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        const chunk = decoder.decode(value, { stream: true });
        // currentText += chunk;
  
        // Detect model headers
        if (chunk.includes("--- Model 1")) currentModel = "model1";
        if (chunk.includes("--- Model 2")) currentModel = "model2";
        if (chunk.includes("--- Model 3")) currentModel = "model3";
  
        // Append to current model response
        if (currentModel && chunk && !chunk.includes("--- Model")) {
          modelChunks[currentModel] += chunk;
          setResults({ ...modelChunks }); // update UI on the fly
        }
      }
    } catch (err) {
      console.error('Streaming API failed:', err);
    } finally {
      setIsLoading(false);
    }
  };
  


  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 items-center gap-4 border-b px-6">
          <h1 className="text-xl font-semibold">LLM Output Comparison</h1>
        </header>
        <main className="flex flex-1 flex-col gap-6 overflow-x-hidden p-6">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              placeholder="Enter your prompt here..."
              className="min-h-24 flex-1 resize-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button type="submit" size="icon" className="h-12" disabled={isLoading || !prompt.trim()}>
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>

          <ComparisonResults results={results} isLoading={isLoading} />
        </main>
      </SidebarInset>
    </div>
  )
}
