import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

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
      <ModelCard title="Model 1 (GPT-4)" content={results.model1} isLoading={isLoading} />
      <ModelCard title="Model 2 (Claude)" content={results.model2} isLoading={isLoading} />
      <ModelCard title="Model 3 (Gemini)" content={results.model3} isLoading={isLoading} />
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
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-[90%]" />
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-sm">{content}</div>
        )}
      </CardContent>
    </Card>
  )
}
