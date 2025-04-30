import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Markdown from "react-markdown";

interface ComparisonResultsProps {
  results: {
    model1: string | null
    model2: string | null
    model3: string | null
  }
  isLoading: boolean
}

export function ComparisonResults({ results, isLoading }: ComparisonResultsProps) {
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
      <ModelCard title="Model 1 (llama-3.3-70b-versatile)" content={results.model1} isLoading={isLoading} />
      <ModelCard title="Model 2 (llama3-70b-8192)" content={results.model2} isLoading={isLoading} />
      <ModelCard title="Model 3 (gemma2-9b-it)" content={results.model3} isLoading={isLoading} />
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
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-md">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 ">
        {isLoading ? (
          <div className="space-y-2 ">
            <Skeleton className="h-4 w-full " />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-[90%]" />
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-sm border-2 bg-gray-800 text-white p-7 rounded-2xl overflow-y-auto ">
            <Markdown>
              {content || ""}
            </Markdown>

            </div>
        )}
      </CardContent>
    </Card>
  )
}
