'use client';

import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    number: '01',
    title: 'Paste Your Prompt',
    description:
      'Drop in your raw, unstructured idea. PromptOS accepts any format — plain text, bullet points, or stream-of-consciousness.',
    code: `promptos.enhance({
  input: 'write an email about delay',
  context: process.env.USER_CONTEXT
})`,
  },
  {
    number: '02',
    title: 'Refine & Configure',
    description:
      'Add intent, audience, and constraints. Our AI analyzes structure, injects best practices, and builds a production-grade prompt.',
    code: `promptos.configure({
  intent: 'professional_email',
  audience: 'client',
  tone: 'empathetic',
  format: 'structured'
})`,
  },
  {
    number: '03',
    title: 'Deploy & Compare',
    description:
      'Test across GPT-4, Gemini, and Claude side-by-side. Score, iterate, and ship — all from one dashboard.',
    code: `promptos.compare({
  models: ['gpt-4o', 'gemini', 'claude'],
  metric: 'quality'
}) // Results in < 2s`,
  },
];

// Safe syntax highlighter that returns React elements (no dangerouslySetInnerHTML)
function CodeLine({ line }: { line: string }) {
  const tokens: { text: string; className: string }[] = [];

  // Simple tokenizer: split by known patterns without cascading regex
  let remaining = line;

  while (remaining.length > 0) {
    // Match string literals first
    const stringMatch = remaining.match(/^('.*?'|".*?")/);
    if (stringMatch) {
      tokens.push({ text: stringMatch[0], className: 'text-green-400' });
      remaining = remaining.slice(stringMatch[0].length);
      continue;
    }

    // Match comments
    const commentMatch = remaining.match(/^(\/\/.*$)/);
    if (commentMatch) {
      tokens.push({ text: commentMatch[0], className: 'text-muted-foreground/50' });
      remaining = remaining.slice(commentMatch[0].length);
      continue;
    }

    // Match keywords
    const keywordMatch = remaining.match(/^(promptos|process|env|const|await|import|from)\b/);
    if (keywordMatch) {
      tokens.push({ text: keywordMatch[0], className: 'text-foreground' });
      remaining = remaining.slice(keywordMatch[0].length);
      continue;
    }

    // Match property access (.something)
    const propMatch = remaining.match(/^(\.\w+)/);
    if (propMatch) {
      tokens.push({ text: propMatch[0], className: 'text-primary' });
      remaining = remaining.slice(propMatch[0].length);
      continue;
    }

    // Match brackets/braces
    const bracketMatch = remaining.match(/^([{}()\[\]:,])/);
    if (bracketMatch) {
      tokens.push({ text: bracketMatch[0], className: 'text-muted-foreground/70' });
      remaining = remaining.slice(bracketMatch[0].length);
      continue;
    }

    // Default: take one character
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

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-cycle through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-secondary/30"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20">
          <p className="text-sm font-mono text-primary mb-3">{'// HOW IT WORKS'}</p>
          <h2
            className={`text-3xl lg:text-5xl font-semibold tracking-tight mb-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="text-balance">From vague idea to</span>
            <br />
            <span className="text-balance">production prompt.</span>
          </h2>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Steps list */}
          <div className="space-y-2">
            {steps.map((step, index) => (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`w-full text-left p-6 rounded-xl border transition-all duration-300 ${
                  activeStep === index
                    ? 'bg-card border-primary/50 card-shadow'
                    : 'bg-transparent border-transparent hover:bg-card/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`font-mono text-sm transition-colors ${
                      activeStep === index ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {step.number}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                    <p
                      className={`text-sm leading-relaxed transition-colors ${
                        activeStep === index ? 'text-muted-foreground' : 'text-muted-foreground/60'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                {activeStep === index && (
                  <div className="mt-4 ml-8">
                    <div className="h-0.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: '100%',
                          animation: 'progress 4s linear',
                        }}
                      />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Code display */}
          <div className="lg:sticky lg:top-32">
            <div className="rounded-xl overflow-hidden bg-card border border-border card-shadow">
              {/* Window chrome */}
              <div className="px-4 py-3 border-b border-border flex items-center gap-3 bg-secondary/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
                </div>
                <span className="text-xs font-mono text-muted-foreground">enhance.ts</span>
              </div>

              {/* Code content */}
              <div className="p-6 font-mono text-sm min-h-[200px]">
                <pre className="text-muted-foreground">
                  {steps[activeStep].code.split('\n').map((line, i) => (
                    <div key={`${activeStep}-${i}`} className="leading-relaxed">
                      <span className="text-muted-foreground/40 select-none w-6 inline-block">
                        {i + 1}
                      </span>
                      <CodeLine line={line} />
                    </div>
                  ))}
                </pre>
              </div>

              {/* Output */}
              <div className="border-t border-border p-4 bg-secondary/20 font-mono text-xs">
                <div className="flex items-center gap-2 text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Ready
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
