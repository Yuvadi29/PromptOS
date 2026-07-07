'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const codeExamples = [
  {
    label: 'Initialize',
    code: `import { PromptOS } from '@promptos/sdk'

const promptos = new PromptOS({
  apiKey: process.env.PROMPTOS_API_KEY
})`,
  },
  {
    label: 'Enhance',
    code: `const result = await promptos.enhance({
  prompt: userMessage,
  model: 'gpt-4o',
  stream: true
})

for await (const chunk of result) {
  process.stdout.write(chunk.text)
}`,
  },
  {
    label: 'Compare',
    code: `const comparison = await promptos.compare({
  prompt: enhancedPrompt,
  models: ['gpt-4o', 'gemini', 'claude'],
  webhook: 'https://api.yourapp.com/results'
})

// Side-by-side results
console.log('Score:', comparison.best)`,
  },
];

const features = [
  {
    title: 'TypeScript-first',
    description: 'Full type safety with auto-generated types for all API responses.',
  },
  {
    title: 'Streaming built-in',
    description: 'Native support for streaming responses with async iterators.',
  },
  {
    title: 'Edge-ready',
    description: 'Works in Node.js, Deno, Bun, and edge runtimes out of the box.',
  },
  {
    title: 'Zero dependencies',
    description: 'Lightweight SDK with no external dependencies. Just 12KB gzipped.',
  },
];

// Safe syntax highlighter that returns React elements (no dangerouslySetInnerHTML)
function CodeLine({ line }: { line: string }) {
  const tokens: { text: string; className: string }[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    const stringMatch = remaining.match(/^('.*?'|".*?")/);
    if (stringMatch) {
      tokens.push({ text: stringMatch[0], className: 'text-green-400' });
      remaining = remaining.slice(stringMatch[0].length);
      continue;
    }

    const commentMatch = remaining.match(/^(\/\/.*$)/);
    if (commentMatch) {
      tokens.push({ text: commentMatch[0], className: 'text-muted-foreground/50' });
      remaining = remaining.slice(commentMatch[0].length);
      continue;
    }

    const keywordMatch = remaining.match(/^(import|from|const|await|for|process|console)\b/);
    if (keywordMatch) {
      tokens.push({ text: keywordMatch[0], className: 'text-primary' });
      remaining = remaining.slice(keywordMatch[0].length);
      continue;
    }

    const bracketMatch = remaining.match(/^([{}()\[\]])/);
    if (bracketMatch) {
      tokens.push({ text: bracketMatch[0], className: 'text-muted-foreground' });
      remaining = remaining.slice(bracketMatch[0].length);
      continue;
    }

    tokens.push({ text: remaining[0], className: '' });
    remaining = remaining.slice(1);
  }

  return (
    <>
      {tokens.map((token, idx) => (
        <span key={idx} className={token.className}>
          {token.text}
        </span>
      ))}
    </>
  );
}

export function DevelopersSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developers" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Content */}
          <div>
            <p className="text-sm font-mono text-primary mb-3">{'// FOR DEVELOPERS'}</p>
            <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight mb-6 text-balance">
              Built for developers,
              <br />
              by developers.
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              A thoughtfully designed SDK that gets out of your way. Ship faster with intuitive APIs
              and comprehensive documentation.
            </p>

            {/* Features list */}
            <div className="grid gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="w-1 bg-primary/30 rounded-full shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Code block */}
          <div className="lg:sticky lg:top-32">
            <div className="rounded-xl overflow-hidden bg-card border border-border card-shadow">
              {/* Tabs */}
              <div className="flex items-center gap-1 p-2 border-b border-border bg-secondary/30">
                {codeExamples.map((example, idx) => (
                  <button
                    key={example.label}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
                      activeTab === idx
                        ? 'bg-card text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {example.label}
                  </button>
                ))}
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Copy code"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Code content */}
              <div className="p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-muted-foreground">
                  <code>
                    {codeExamples[activeTab].code.split('\n').map((line, i) => (
                      <div key={`${activeTab}-${i}`} className="leading-relaxed">
                        <span className="text-muted-foreground/40 select-none w-8 inline-block">
                          {i + 1}
                        </span>
                        <CodeLine line={line} />
                      </div>
                    ))}
                  </code>
                </pre>
              </div>

              {/* Terminal output */}
              <div className="border-t border-border p-4 bg-secondary/20">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
                  <span className="text-green-500">$</span>
                  <span>npm install @promptos/sdk</span>
                </div>
                <div className="text-xs font-mono text-muted-foreground/60">
                  added 1 package in 0.4s
                </div>
              </div>
            </div>

            {/* Docs link */}
            <div className="mt-6 flex items-center gap-4 text-sm">
              <a href="/docs" className="text-primary hover:underline font-mono">
                Read the docs
              </a>
              <span className="text-border">|</span>
              <a
                href="https://github.com/Yuvadi29/PromptOS"
                className="text-muted-foreground hover:text-foreground font-mono"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
