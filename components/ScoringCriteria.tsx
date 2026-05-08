import { Info, Sparkles } from 'lucide-react';

const criteria = [
  {
    name: 'Clarity',
    icon: '💡',
    description: 'Clear and understandable language',
  },
  {
    name: 'Specificity',
    icon: '🎯',
    description: 'Detailed and precise instructions',
  },
  {
    name: 'Relevance',
    icon: '✅',
    description: 'Focused on essential information',
  },
  {
    name: 'Structure',
    icon: '🏗️',
    description: 'Well-organized and logical',
  },
  {
    name: 'Conciseness',
    icon: '⚡',
    description: 'Brief yet complete',
  },
];

const ScoringCriteria = () => {
  return (
    <div className="p-8 rounded-2xl bg-black border border-foreground/10 space-y-8">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Evaluation Parameters
        </span>
        <Info className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {criteria?.map((criterion) => (
          <div
            key={criterion?.name}
            className="group flex items-start gap-4 p-4 rounded-xl border border-foreground/5 hover:border-foreground/20 transition-all duration-300"
          >
            <span className="text-xl grayscale group-hover:grayscale-0 transition-all">
              {criterion.icon}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-mono uppercase tracking-widest text-foreground mb-1">
                {criterion.name}
              </h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {criterion.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-foreground/5">
        <div className="flex items-start gap-3">
          <Sparkles className="h-3 w-3 text-muted-foreground mt-0.5" />
          <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest leading-relaxed">
            Data normalized to 1-10 index.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoringCriteria;
