'use client';

import React, { useEffect, useState } from 'react';

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

const getScoreColorHex = (score: number) => {
  if (score >= 80) return '#34d399'; // emerald-400
  if (score >= 60) return '#fbbf24'; // amber-400
  if (score >= 40) return '#fb923c'; // orange-400
  return '#f87171'; // red-400
};

const getScoreColorClass = (score: number) => {
  if (score >= 80) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
  if (score >= 60) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
  if (score >= 40) return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
  return 'text-red-400 bg-red-400/10 border-red-400/20';
};

const getScoreBarColor = (score: number) => {
  if (score >= 8) return 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]';
  if (score >= 6) return 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]';
  if (score >= 4) return 'bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.8)]';
  return 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]';
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Exceptional';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Work';
};

const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  const { overallScore, criteriaScores, feedback } = score;
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate the radial score on mount
  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepTime = Math.abs(Math.floor(duration / steps));
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // easeOutQuart curve
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setAnimatedScore(Math.round(easeProgress * overallScore));

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedScore(overallScore);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [overallScore]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  const colorHex = getScoreColorHex(overallScore);

  return (
    <div className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col h-full">
      {/* Background Glow based on score */}
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-20 -translate-y-1/2 translate-x-1/4 transition-colors duration-1000"
        style={{ backgroundColor: colorHex }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row gap-10">
        {/* Left Side: Massive Radial Score */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="relative flex items-center justify-center w-48 h-48 mb-6">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                className="text-white/5"
                fill="transparent"
              />
              {/* Animated Progress Circle */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke={colorHex}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 ease-out drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
              />
            </svg>

            {/* Center Text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-6xl font-bold tracking-tighter text-white tabular-nums drop-shadow-md">
                {animatedScore}
              </span>
              <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mt-1">
                Out of 100
              </span>
            </div>
          </div>

          <div
            className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest shadow-lg ${getScoreColorClass(overallScore)}`}
          >
            {getScoreLabel(overallScore)}
          </div>
        </div>

        {/* Right Side: Criteria Breakdown & Feedback */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-5">
            {criteriaScores &&
              Object.entries(criteriaScores)?.map(([criterion, scoreValue], i) => (
                <div
                  key={criterion}
                  className="space-y-2"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex justify-between items-end text-sm">
                    <span className="font-semibold text-zinc-300 capitalize tracking-wide">
                      {criterion.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-mono font-bold text-zinc-400">
                      {scoreValue.toFixed(1)} <span className="text-zinc-600">/ 10</span>
                    </span>
                  </div>
                  {/* Neon Track */}
                  <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${getScoreBarColor(scoreValue)}`}
                      style={{ width: `${(scoreValue / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      {feedback && (
        <div className="mt-10 pt-6 border-t border-white/10 relative z-10">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            AI Constructive Feedback
          </h3>
          <div className="bg-black/30 border border-white/5 rounded-2xl p-5 shadow-inner">
            <p className="text-sm text-zinc-300 leading-relaxed font-mono">{feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreCard;
