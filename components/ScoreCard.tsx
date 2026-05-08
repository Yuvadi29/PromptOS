'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

// Props type definition
type ScoreCardProps = {
  score: {
    overallScore: number;
    criteriaScores: {
      clarity: number;
      specificity: number;
      model_fit: number;
      relevance: number;
      structure: number;
      conciseness: number;
    };
    feedback: string;
  };
};

const getScoreColor = (score: number) => {
  if (score >= 8) return 'bg-white';
  if (score >= 6) return 'bg-zinc-400';
  if (score >= 4) return 'bg-zinc-600';
  return 'bg-zinc-800';
};

const getScoreLabel = (score: number) => {
  if (score >= 8) return 'Optimal Architecture';
  if (score >= 6) return 'Standard Performance';
  if (score >= 4) return 'Linguistic Friction';
  return 'Critical Failure';
};

const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  const { overallScore, criteriaScores, feedback } = score;

  return (
    <div className="space-y-12">
      <div className="grid lg:grid-cols-12 gap-12">
        {/* Overall Score */}
        <div className="lg:col-span-5 p-12 rounded-2xl bg-black border border-foreground/10 flex flex-col items-center justify-center text-center space-y-6">
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted-foreground">
            Aggregated Index
          </span>
          <div className="relative">
            <h2 className="text-[120px] font-display tracking-tighter leading-none text-foreground">
              {overallScore}
            </h2>
            <span className="absolute -top-2 -right-8 text-xl font-mono text-muted-foreground">
              /10
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-display tracking-wide uppercase text-foreground">
              {getScoreLabel(overallScore)}
            </p>
            <div className="w-48 h-1 bg-foreground/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallScore * 10}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full ${getScoreColor(overallScore)}`}
              />
            </div>
          </div>
        </div>

        {/* Criteria Breakdown */}
        <div className="lg:col-span-7 p-12 rounded-2xl bg-black border border-foreground/10 space-y-10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Matrix Breakdown
            </span>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="grid gap-6">
            {criteriaScores &&
              Object.entries(criteriaScores).map(([criterion, score], index) => (
                <motion.div
                  key={criterion}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="space-y-3"
                >
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                    <span className="text-muted-foreground">{criterion.replace(/_/g, ' ')}</span>
                    <span className="text-foreground">{score}/10</span>
                  </div>
                  <div className="h-0.5 bg-foreground/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score * 10}%` }}
                      transition={{ delay: 0.5 + 0.1 * index, duration: 0.8 }}
                      className="h-full bg-white"
                    />
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="p-12 rounded-2xl bg-white/[0.02] border border-foreground/5 space-y-6"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-foreground/30" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
              Optimization Protocol
            </span>
          </div>
          <p className="text-2xl font-display font-light leading-relaxed text-muted-foreground">
            &quot;{feedback}&quot;
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ScoreCard;
