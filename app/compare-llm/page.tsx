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

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault()
    //     if (!prompt.trim()) return

    //     setIsLoading(true)

    //     // Simulate API calls to different LLMs
    //     setTimeout(() => {
    //         setResults({
    //             model1: `Model 1 response to: "${prompt}"\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.`,
    //             model2: `Model 2 response to: "${prompt}"\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.`,
    //             model3: `Model 3 response to: "${prompt}"\n\nAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi.`,
    //         })
    //         setIsLoading(false)
    //     }, 1500)
    // }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!prompt.trim()) return
      
        setIsLoading(true)
        setResults({ model1: null, model2: null, model3: null })
      
        try {
          const res = await fetch('/api/compare-llm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
          })
      
          const data = await res.json()
      
          setResults({
            model1: data.model1,
            model2: data.model2,
            model3: data.model3,
          })
        } catch (err) {
          console.error('API call failed', err)
        } finally {
          setIsLoading(false)
        }
      }
      

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <SidebarInset className="flex flex-col">
                <header className="flex h-16 items-center gap-4 border-b px-6">
                    <h1 className="text-xl font-semibold">LLM Output Comparison</h1>
                </header>
                <main className="flex flex-1 flex-col gap-6 overflow-auto p-6">
                    <form onSubmit={handleSubmit} className="flex w-full gap-2">
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
