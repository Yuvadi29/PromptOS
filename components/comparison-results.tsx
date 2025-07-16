import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Markdown from "react-markdown";
import { useState } from "react";

interface ComparisonResultsProps {
  results: {
    model1: string | null
    model2: string | null
    model3: string | null
  }
  isLoading: boolean
  selectedModels: string[]
}

export function ComparisonResults({ results, isLoading, selectedModels }: ComparisonResultsProps) {
  const hasResults = results.model1 || results.model2 || results.model3

  if (!hasResults && !isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center">
        <h3 className="text-lg font-medium">Enter a prompt to compare LLM outputs</h3>
        <p className="text-sm text-muted-foreground">Results from three different models will appear here</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {["model1", "model2", "model3"].map((key, index) => (
        <ModelCard
          key={key}
          title={selectedModels[index] || `Model${index + 1}`}
          content={results[key as keyof typeof results]}
          isLoading={isLoading}
        />
      ))}
    </div>
  )
}

function ModelCard({
  title,
  content,
  isLoading,
}: {
  title: string
  content: string | null
  isLoading: boolean
}) {
 
  return (
    <Card className="flex flex-col max-h-[80vh] overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm truncate flex">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        {isLoading && !content ? (
          <div className="space-y-2 animate-pulse">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert text-sm">
            <Markdown>{content || "_No output yet._"}</Markdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}