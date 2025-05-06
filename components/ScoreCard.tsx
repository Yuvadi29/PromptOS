"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Improvement";
};

const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  const { overallScore, criteriaScores, feedback } = score;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Your Prompt Score
          <Badge className={`text-white ${getScoreColor(overallScore)}`}>
            {overallScore}/100
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Quality</span>
            <span className="font-medium">{getScoreLabel(overallScore)}</span>
          </div>
          <Progress value={overallScore} className={getScoreColor(overallScore)} />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Criteria Breakdown</h3>
          {criteriaScores && Object.entries(criteriaScores).map(([criterion, score]) => (
            <div key={criterion} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{criterion.replace("_", " ")}</span>
                <span>{score * 10}/100</span>
              </div>
              <Progress value={score * 10} className={getScoreColor(score)} />
            </div>
          ))}
        </div>

        {feedback && (
          <div className="space-y-2">
            <h3 className="font-medium">Feedback</h3>
            <p className="text-sm text-muted-foreground">{feedback}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
