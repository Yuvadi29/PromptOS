export default function EvolutionTimeline() {
  const versions = [
    { version: 'Version 1', score: 6.1, active: false },
    { version: 'Version 2', score: 8.2, active: false },
    { version: 'Version 3', score: 9.3, active: false },
    { version: 'Current', score: 9.8, active: true },
  ];

  return (
    <section className="py-32 bg-card">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Prompt Evolution
          </h2>
          <p className="text-muted-foreground text-lg">
            Track every change. Measure every improvement.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-border md:-translate-x-1/2" />

          <div className="space-y-12">
            {versions.map((item, i) => (
              <div
                key={i}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Node */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full border-2 border-background bg-card -translate-x-1/2 flex items-center justify-center z-10">
                  <div
                    className={`w-2 h-2 rounded-full ${item.active ? 'bg-primary animate-pulse-glow' : 'bg-muted-foreground'}`}
                  />
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2 pl-16 md:pl-0 flex md:block">
                  <div
                    className={`w-full max-w-sm p-6 rounded-xl border transition-all ${item.active ? 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/5' : 'border-border bg-background'}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
                        {item.version}
                      </span>
                      <span
                        className={`font-mono font-bold text-lg ${item.active ? 'text-primary' : 'text-foreground'}`}
                      >
                        {item.score}
                      </span>
                    </div>
                    {item.active && (
                      <div className="mt-4 pt-4 border-t border-primary/20">
                        <span className="text-xs text-primary font-mono bg-primary/10 px-2 py-1 rounded">
                          Optimized for reasoning
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Spacer for alternate sides on desktop */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
