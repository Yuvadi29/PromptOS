"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ComparisonResults } from "@/components/comparison-results"
import { SidebarInset } from "@/components/ui/sidebar"
import { getModelList } from "@/lib/getModelList"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  });
  const [selectedModels, setSelectedModels] = useState<string[]>(["", "", ""]);
  const [modelList, setModelList] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    async function fetchModels() {
      const data = await getModelList();
      setModelList(data?.data || []);
    }
    fetchModels();
  }, []);

  useEffect(() => {
  const el = document.getElementById("comparison-output");
  if (el) el.scrollTop = el.scrollHeight;
}, [results]);


  const handleModelChange = (index: number, value: string) => {
    const updated = [...selectedModels];
    updated[index] = value;
    setSelectedModels(updated)
  };

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
        body: JSON.stringify({ prompt, models: selectedModels }),
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
      let buffer = '';

      const updateResult = (modelKey: keyof typeof modelChunks, text: string) => {
        modelChunks[modelKey] += text;
        setResults((prev) => ({ ...prev, [modelKey]: modelChunks[modelKey] }));
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Detect model header
        if (buffer.includes("--- Model 1")) currentModel = "model1";
        else if (buffer.includes("--- Model 2")) currentModel = "model2";
        else if (buffer.includes("--- Model 3")) currentModel = "model3";

        // If current model is set, collect until next model header
        if (currentModel && !chunk.includes("--- Model")) {
          updateResult(currentModel, chunk);
        }

        // Optionally, trim buffer
        if (buffer.length > 2000) buffer = buffer.slice(-500); // Keep only recent
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

            <div className="flex gap-4">
              {["Model 1", "Model 2", "Model 3"].map((label, i) => (
                <Select
                  key={label}
                  value={selectedModels[i]}
                  onValueChange={(val) => handleModelChange(i, val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select ${label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {modelList
                      .filter(
                        (m) =>
                          m.id.includes("free") &&
                          (!selectedModels.includes(m.id) || selectedModels[i] === m.id)
                      )
                      .map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.id}
                        </SelectItem>
                      ))}
                  </SelectContent>

                </Select>
              ))}
            </div>
            <Button type="submit" size="icon" className="h-12" disabled={isLoading || !prompt.trim()}>
              <Send className="h-5 w-5 cursor-pointer" />
              <span className="sr-only cursor-pointer">Send</span>
            </Button>
          </form>

          <div id="comparison-output">
            <ComparisonResults results={results} isLoading={isLoading} selectedModels={selectedModels}/>
          </div>

        </main>
      </SidebarInset>
    </div>
  )
}
