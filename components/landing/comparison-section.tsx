import { Check, X } from 'lucide-react';

export default function ComparisonSection() {
  const comparisonData = [
    { feature: 'Improves one prompt', chatgpt: true, promptos: 'Learns from every prompt' },
    { feature: 'Memory', chatgpt: false, promptos: 'Personalized memory' },
    { feature: 'Versioning', chatgpt: false, promptos: 'Prompt evolution' },
    { feature: 'Analytics', chatgpt: false, promptos: 'Prompt intelligence' },
    { feature: 'Evaluation', chatgpt: false, promptos: 'AI prompt scoring' },
    { feature: 'Learning', chatgpt: false, promptos: 'AI coaching' },
  ];

  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Why PromptOS?
          </h2>
          <p className="text-muted-foreground text-lg">
            See the difference an intelligence platform makes.
          </p>
        </div>

        <div className="border border-border rounded-2xl overflow-hidden bg-card/50 backdrop-blur">
          <div className="grid grid-cols-3 border-b border-border bg-card">
            <div className="p-6"></div>
            <div className="p-6 text-center border-l border-border font-mono font-semibold text-muted-foreground">
              ChatGPT
            </div>
            <div className="p-6 text-center border-l border-border font-mono font-bold text-primary text-xl">
              PromptOS
            </div>
          </div>

          <div className="divide-y divide-border">
            {comparisonData.map((row, i) => (
              <div key={i} className="grid grid-cols-3 hover:bg-white/[0.02] transition-colors">
                <div className="p-6 font-medium text-foreground/80 flex items-center">
                  {row.feature}
                </div>
                <div className="p-6 border-l border-border flex items-center justify-center text-muted-foreground">
                  {row.chatgpt ? (
                    <Check className="w-5 h-5 opacity-50" />
                  ) : (
                    <X className="w-5 h-5 opacity-50" />
                  )}
                </div>
                <div className="p-6 border-l border-border flex items-center justify-center font-medium text-foreground bg-primary/5">
                  {row.promptos}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
