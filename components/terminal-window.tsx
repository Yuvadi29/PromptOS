"use client";

import { useState, useEffect } from "react";

interface TerminalCommand {
  prompt?: string;
  command?: string;
  output?: string;
  success?: boolean;
  multiline?: string[];
}

interface TerminalWindowProps {
  commands: TerminalCommand[];
}

export default function TerminalWindow({ commands }: TerminalWindowProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    if (currentCommandIndex >= commands.length) {
      setTypingComplete(true);
      return;
    }

    const currentCmd = commands[currentCommandIndex];
    let fullLine = "";

    if (currentCmd.prompt && currentCmd.command) {
      fullLine = `${currentCmd.prompt} ${currentCmd.command}`;
    } else if (currentCmd.output) {
      fullLine = currentCmd.output;
    }

    const typingSpeed = 20; // ms between each character

    const interval = setInterval(() => {
      if (currentCharIndex < fullLine.length) {
        if (displayedLines[currentCommandIndex]) {
          setDisplayedLines((prev) =>
            prev.map((line, idx) =>
              idx === currentCommandIndex
                ? line + fullLine[currentCharIndex]
                : line
            )
          );
        } else {
          setDisplayedLines((prev) => [...prev, fullLine[currentCharIndex]]);
        }
        setCurrentCharIndex((prev) => prev + 1);
      } else {
        clearInterval(interval);
        if (currentCmd.multiline && currentCmd.multiline.length > 0) {
          setDisplayedLines((prev) => [...prev, ...(currentCmd.multiline ?? [])]);
        }
        setCurrentCommandIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [commands, currentCommandIndex, currentCharIndex, displayedLines]);

  return (
    <div className="terminal shadow-lg animate-float rounded-xl overflow-hidden bg-gray-900">
      <div className="terminal-header flex items-center p-2 bg-gray-800 rounded-t-xl">
        <div className="window-dot bg-red-500 w-3 h-3 rounded-full mr-2"></div>
        <div className="window-dot bg-yellow-500 w-3 h-3 rounded-full mr-2"></div>
        <div className="window-dot bg-green-500 w-3 h-3 rounded-full mr-2"></div>
        <div className="ml-2 text-gray-300 text-sm">terminal</div>
      </div>
      <div className="terminal-content p-4 text-sm text-gray-100 font-mono leading-relaxed min-h-[300px]">
        {displayedLines.map((line, index) => (
          <div
            key={index}
            className={`terminal-line ${
              line.startsWith("Logged in") || line.startsWith("Enhanced prompt")
                ? "text-green-400"
                : "text-gray-200"
            }`}
          >
            {line}
          </div>
        ))}
        {!typingComplete && (
          <div className="terminal-line">
            <span className="animate-blink">|</span>
          </div>
        )}
      </div>
    </div>
  );
}
