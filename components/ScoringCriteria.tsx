import React from 'react';
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
    <div className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-[24px] p-6 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Info className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Scoring Criteria</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              5 Key Dimensions
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {criteria?.map((criterion) => (
            <div
              key={criterion?.name}
              className="group relative rounded-xl border border-white/5 bg-black/20 p-3 hover:bg-white/5 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-colors shadow-inner">
                  {criterion.icon}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center pt-0.5">
                  <h3 className="font-bold text-sm text-zinc-200 mb-0.5 group-hover:text-purple-400 transition-colors">
                    {criterion.name}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{criterion.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/5 border border-purple-500/20 p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-20">
            <Sparkles className="w-12 h-12 text-purple-400" />
          </div>
          <div className="relative flex items-start gap-3 z-10">
            <Sparkles className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-purple-200/80 leading-relaxed font-medium">
              Each dimension is evaluated and scored from 0-10. Higher scores indicate a more
              robust, effective prompt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoringCriteria;
