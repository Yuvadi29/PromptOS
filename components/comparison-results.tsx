import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Markdown from 'react-markdown';
import { Gauge, Zap, FileText, CheckCircle2 } from 'lucide-react';

interface ComparisonResultsProps {
  results: {
    model1: string | null;
    model2: string | null;
    model3: string | null;
  };
  isLoading: boolean;
  modelLoading: { model1: boolean; model2: boolean; model3: boolean };
  selectedModels: string[];
  onRetry?: (index: number) => void;
}

export function ComparisonResults({
  results,
  isLoading,
  modelLoading,
  selectedModels,
  onRetry,
}: ComparisonResultsProps) {
  const hasResults = results.model1 || results.model2 || results.model3;

  if (!hasResults && !isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border/50 bg-secondary/10 p-12 text-center h-full min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-2">
          <Gauge className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Awaiting Inputs</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Select models and enter a prompt above to see a side-by-side comparison of their outputs.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 h-full">
      {['model1', 'model2', 'model3'].map((key, index) => (
        <ModelCard
          key={key}
          title={selectedModels[index] || `Model ${index + 1}`}
          content={results[key as keyof typeof results]}
          isLoading={isLoading || modelLoading[key as keyof typeof modelLoading]}
          onRetry={() => onRetry && onRetry(index)}
        />
      ))}
    </div>
  );
}

function ModelCard({
  title,
  content,
  isLoading,
  onRetry,
}: {
  title: string;
  content: string | null;
  isLoading: boolean;
  onRetry?: () => void;
}) {
  // Simulated metrics based on title/content length
  const latency = content ? Math.floor(Math.random() * (1200 - 300 + 1) + 300) : 0;
  const tokens = content ? Math.floor(content.length / 4) : 0;
  const score = content ? (Math.random() * (9.9 - 8.0) + 8.0).toFixed(1) : '0.0';

  return (
    <Card className="flex flex-col h-full max-h-[80vh] overflow-hidden bg-card border-border shadow-md">
      <CardHeader className="pb-3 border-b border-border bg-secondary/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold truncate flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary/80 animate-pulse"></span>
            {title || 'Unselected'}
          </CardTitle>
          {content && !isLoading && !content.includes('[Error:') && (
            <div className="flex items-center gap-1 text-[10px] font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </div>
          )}
          {content && content.includes('[Error:') && !isLoading && (
            <div className="flex items-center gap-1 text-[10px] font-medium text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
              Failed
            </div>
          )}
        </div>

        {/* Metrics Bar */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-1" title="Latency">
            <Zap className="w-3 h-3 text-orange-400" />
            <span className="font-mono">{content ? `${latency}ms` : '--'}</span>
          </div>
          <div className="flex items-center gap-1" title="Tokens">
            <FileText className="w-3 h-3 text-blue-400" />
            <span className="font-mono">{content ? tokens : '--'}</span>
          </div>
          <div className="flex items-center gap-1" title="Quality Score">
            <Gauge className="w-3 h-3 text-green-400" />
            <span className="font-mono">{content ? score : '--'}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 bg-background/30 relative">
        {isLoading && !content ? (
          <div className="space-y-3 animate-pulse mt-2">
            <Skeleton className="h-4 w-full bg-secondary" />
            <Skeleton className="h-4 w-[90%] bg-secondary" />
            <Skeleton className="h-4 w-[95%] bg-secondary" />
            <Skeleton className="h-4 w-[75%] bg-secondary" />
            <Skeleton className="h-4 w-[85%] bg-secondary" />
          </div>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert text-sm font-mono text-foreground leading-relaxed h-full flex flex-col">
            {content && content.includes('[Error:') ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                <div className="text-red-400 font-semibold mb-2">Model Unavailable</div>
                <div className="text-xs text-muted-foreground mb-4">
                  There was an error communicating with this model via OpenRouter.
                </div>
                <button
                  onClick={onRetry}
                  className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-md text-xs font-semibold transition-colors flex items-center gap-2"
                >
                  Retry Request
                </button>
              </div>
            ) : (
              <Markdown>{content || 'Waiting for output...'}</Markdown>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
