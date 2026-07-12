import React from 'react';

export function Logo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        {/* Brand Theme Gradient: Emerald Green to White */}
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" /> {/* Emerald Green */}
          <stop offset="60%" stopColor="#34d399" /> {/* Mint Green */}
          <stop offset="100%" stopColor="#ffffff" /> {/* Pure White */}
        </linearGradient>

        {/* Glow Filter for the AI Spark */}
        <filter id="spark-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Main vertical stem of the 'P' */}
      <line
        x1="25"
        y1="15"
        x2="25"
        y2="85"
        stroke="url(#logo-grad)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* 2. Chat Bubble Loop of the 'P' (signifying messages/prompts) */}
      <path
        d="M25 15H60C73.8 15 85 26.2 85 40C85 53.8 73.8 65 60 65H35L23 77V65H25"
        stroke="url(#logo-grad)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Terminal Prompt symbol ( > ) inside the bubble (signifying prompt/command inputs) */}
      <path
        d="M38 31L47 40L38 49"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 4. AI Optimization Spark ( ✦ ) (signifying enhancement and intelligence) */}
      <path
        d="M58 40C63 40 63 33 63 33C63 33 63 40 68 40C63 40 63 47 63 47C63 47 63 40 58 40Z"
        fill="#10b981"
        filter="url(#spark-glow)"
      />

      {/* Smaller companion spark */}
      <path
        d="M69 27C71.5 27 71.5 24 71.5 24C71.5 24 71.5 27 74 27C71.5 27 71.5 30 71.5 30C71.5 30 71.5 27 69 27Z"
        fill="#34d399"
        opacity="0.8"
      />
    </svg>
  );
}
