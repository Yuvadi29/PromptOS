"use client";

import { useState, useEffect } from "react";

interface CodeWindowProps {
  title: string;
  code: string;
}

export default function CodeWindow({ title, code }: CodeWindowProps) {
  const [displayedCode, setDisplayedCode] = useState<string>("");

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < code.length) {
        setDisplayedCode((prev) => prev + code[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 15); // Typing speed in milliseconds (adjust as needed)

    return () => clearInterval(interval);
  }, [code]);

  // Highlight syntax for the displayed code (progressively)
  const getHighlightedCode = (code: string) => {
    let highlighted = code
      .replace(/(['"`])(?:\\.|[^\\])*?\1/g, '<span class="token-string">$&</span>')
      .replace(/(\/\/.*)/g, '<span class="token-comment">$1</span>')
      .replace(/\b(import|from|const|let|var|function|async|await|return|if|else|for|while)\b/g, '<span class="token-keyword">$1</span>')
      .replace(/\b([A-Za-z_][A-Za-z0-9_]*)\s*(?=\()/g, '<span class="token-function">$1</span>')
      .replace(/\.([A-Za-z_][A-Za-z0-9_]*)/g, '.<span class="token-property">$1</span>');

    return highlighted;
  };

  return (
    <div className="code-window shadow-lg animate-float">
      <div className="code-window-header flex items-center p-2 bg-gray-800 rounded-t-lg">
        <div className="window-dot bg-red-500 w-3 h-3 rounded-full mr-2"></div>
        <div className="window-dot bg-yellow-500 w-3 h-3 rounded-full mr-2"></div>
        <div className="window-dot bg-green-500 w-3 h-3 rounded-full mr-2"></div>
        <div className="ml-2 text-gray-300 text-sm">{title}</div>
      </div>
      <div className="code-content p-4 bg-gray-900 rounded-b-lg text-sm text-gray-100 font-mono leading-relaxed min-h-[300px]">
        <pre>
          <code dangerouslySetInnerHTML={{ __html: getHighlightedCode(displayedCode) }} />
        </pre>
      </div>
    </div>
  );
}
