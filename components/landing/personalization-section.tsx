import { Check } from 'lucide-react';

export default function PersonalizationSection() {
  const features = [
    'Your preferred style',
    'Your preferred format',
    'Your best prompts',
    'Your prompting patterns',
    'Your improvements',
  ];

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              PromptOS Remembers
            </h2>
            <p className="text-lg text-muted-foreground mb-8 font-light">
              It&quot;s not just an application. It&quot;s a personal intelligence layer that adapts
              to how you work, learning from every interaction to make your next prompt better than
              the last.
            </p>

            <ul className="space-y-4">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-4 text-foreground/80 font-medium">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Check className="w-4 h-4" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="border border-border bg-card/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-start gap-4 pb-6 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-secondary flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">AI Coach</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      You consistently write great context, but often miss output formatting. Want
                      to apply a default Markdown template to your next coding prompts?
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Style Detected</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      We&quot;ve updated your baseline model temperature to 0.4 based on your
                      preference for deterministic coding answers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
