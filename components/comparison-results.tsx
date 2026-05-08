import Markdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface ComparisonResultsProps {
  results: {
    model1: string | null;
    model2: string | null;
    model3: string | null;
  };
  isLoading: boolean;
  selectedModels: string[];
}

export function ComparisonResults({ results, isLoading, selectedModels }: ComparisonResultsProps) {
  const hasResults = results.model1 || results.model2 || results.model3;

  if (!hasResults && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-1 flex-col items-center justify-center gap-6 rounded-2xl border border-foreground/5 bg-white/[0.01] p-24 text-center"
      >
        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
          <Activity className="w-5 h-5 text-muted-foreground animate-pulse" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-display font-light text-foreground">
            Awaiting Stream Initialization
          </h3>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Select models and execute evaluation to parallelize outputs
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
      {['model1', 'model2', 'model3'].map((key, index) => (
        <ModelCard
          key={key}
          title={selectedModels[index] || `Model ${index + 1}`}
          content={results[key as keyof typeof results]}
          isLoading={isLoading}
          index={index}
        />
      ))}
    </div>
  );
}

function ModelCard({
  title,
  content,
  isLoading,
  index,
}: {
  title: string;
  content: string | null;
  isLoading: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col h-full min-h-[400px]"
    >
      <div className="absolute -inset-[1px] bg-gradient-to-r from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="relative flex flex-col h-full bg-white/[0.02] border border-foreground/5 rounded-2xl overflow-hidden p-8 transition-colors group-hover:bg-white/[0.04]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-foreground/5">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground truncate max-w-[150px]">
              {title}
            </span>
          </div>
          {isLoading && !content && <div className="w-3 h-3 rounded-full bg-white animate-pulse" />}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading && !content ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-2 w-full bg-white/5 rounded" />
              <div className="h-2 w-[95%] bg-white/5 rounded" />
              <div className="h-2 w-[90%] bg-white/5 rounded" />
              <div className="h-2 w-[80%] bg-white/5 rounded" />
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert text-sm font-display font-light leading-relaxed text-muted-foreground/90">
              <Markdown>{content || ''}</Markdown>
              {!content && !isLoading && (
                <p className="font-mono text-[10px] uppercase tracking-widest opacity-20">
                  No stream data
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
