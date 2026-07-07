'use client';

import React from 'react';

interface CircularProgressProps {
  value: number;
  max: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({
  value,
  max,
  label,
  size = 180,
  strokeWidth = 10,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = max > 0 ? (value / max) * 100 : 0;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Background Circle */}
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-white/[0.03]"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-primary transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      {/* Center Text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <div className="text-3xl font-bold text-foreground">
          {value}
          <span className="text-muted-foreground text-xl">/{max}</span>
        </div>
        <div className="text-sm font-medium text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}
