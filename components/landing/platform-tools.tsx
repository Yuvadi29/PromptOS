import { Sparkles, Scale, Percent, Bookmark } from 'lucide-react';
import { SiOpenai, SiGoogle } from 'react-icons/si';

export default function PlatformTools() {
  return (
    <section id="platform-tools" className="py-24 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 mb-6">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">
              Platform Tools
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6">
            Everything you need to master prompting.
          </h2>
          <p className="text-muted-foreground text-lg">
            No more guess work. A unified suite of intelligence tools designed to refine, validate,
            and scale your AI workflows.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {/* Card 1: Prompt Enhancer (Large - 3 cols) */}
          <div className="md:col-span-3 group relative border border-white/10 bg-white/5 backdrop-blur-xl rounded-[24px] p-8 flex flex-col justify-between hover:bg-white/10 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 text-primary mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Prompt Enhancer</h3>
              <p className="text-muted-foreground text-base mb-8 max-w-sm">
                Transforms simple, vague ideas into precise, structured instructions utilizing
                optimized templates and user-specific context.
              </p>
            </div>

            {/* Visual Preview */}
            <div className="relative z-10 border border-white/10 rounded-2xl bg-black/50 p-5 font-mono text-xs leading-relaxed select-none overflow-hidden h-40 flex flex-col justify-between shadow-2xl">
              <div className="text-muted-foreground/60 flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
                  System Status: Enhancing
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              </div>
              <div className="flex-1 py-4 flex gap-4 items-start">
                <div className="flex-1 bg-white/5 p-3 rounded-lg border border-white/5 text-muted-foreground/80 truncate">
                  &quot;write an email to client about delay&quot;
                </div>
                <div className="text-primary font-bold animate-pulse pt-2">→</div>
                <div className="flex-1 bg-primary/10 p-3 rounded-lg border border-primary/20 text-white overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                  <span className="text-primary font-semibold"># Role</span>: Professional Account
                  Lead...
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: LLM Comparison (Large - 3 cols) */}
          <div className="md:col-span-3 group relative border border-white/10 bg-white/5 backdrop-blur-xl rounded-[24px] p-8 flex flex-col justify-between hover:bg-white/10 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 text-blue-400 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">LLM Output Comparison</h3>
              <p className="text-muted-foreground text-base mb-8 max-w-sm">
                Simultaneously test prompts across three models side-by-side. Spot differences,
                track formatting, and cherry-pick response styles.
              </p>
            </div>

            {/* Visual Preview */}
            <div className="relative z-10 grid grid-cols-3 gap-3 h-40">
              <div className="border border-white/10 bg-black/50 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <SiOpenai className="h-4 w-4 text-emerald-400" />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    GPT-4o
                  </span>
                </div>
                <div className="flex-1 py-2 space-y-2 mt-2">
                  <div className="h-1.5 bg-white/10 rounded-full w-full" />
                  <div className="h-1.5 bg-white/10 rounded-full w-[85%]" />
                  <div className="h-1.5 bg-white/10 rounded-full w-[90%]" />
                </div>
              </div>
              <div className="border border-white/10 bg-black/50 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <SiGoogle className="h-4 w-4 text-blue-400" />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Gemini
                  </span>
                </div>
                <div className="flex-1 py-2 space-y-2 mt-2">
                  <div className="h-1.5 bg-white/10 rounded-full w-[90%]" />
                  <div className="h-1.5 bg-white/10 rounded-full w-[75%]" />
                  <div className="h-1.5 bg-white/10 rounded-full w-[80%]" />
                </div>
              </div>
              <div className="border border-primary/30 bg-primary/10 rounded-2xl p-4 flex flex-col justify-between shadow-[0_0_20px_rgba(59,130,246,0.15)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
                <div className="relative flex items-center gap-2 border-b border-primary/20 pb-2">
                  <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    Claude 3.5
                  </span>
                </div>
                <div className="relative flex-1 py-2 space-y-2 mt-2">
                  <div className="h-1.5 bg-primary/40 rounded-full w-full" />
                  <div className="h-1.5 bg-primary/40 rounded-full w-[95%]" />
                  <div className="h-1.5 bg-primary/40 rounded-full w-[85%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Prompt Scoring (Small - 2 cols) */}
          <div className="md:col-span-2 group relative border border-white/10 bg-white/5 backdrop-blur-xl rounded-[24px] p-8 flex flex-col justify-between hover:bg-white/10 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 text-purple-400 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Percent className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real-time Scoring</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Receive instant qualitative scores on clarity, constraints, structure, and
                readability context.
              </p>
            </div>

            {/* Visual Preview */}
            <div className="relative z-10 border border-white/10 rounded-2xl bg-black/50 p-5 flex flex-col items-center justify-center gap-4 h-32 shadow-lg">
              <div className="flex items-center justify-between w-full">
                <div className="relative flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-white/5"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-primary"
                      fill="transparent"
                      strokeDasharray="163"
                      strokeDashoffset="16"
                    />
                  </svg>
                  <span className="absolute text-sm font-bold text-white">9.2</span>
                </div>
                <div className="space-y-2 text-[10px] text-muted-foreground font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />{' '}
                    Clarity: Exceptional
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />{' '}
                    Specificity: Good
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />{' '}
                    Length: Optimal
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Prompt Library (Small - 4 cols) */}
          <div className="md:col-span-4 group relative border border-white/10 bg-white/5 backdrop-blur-xl rounded-[24px] p-8 flex flex-col justify-between hover:bg-white/10 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 text-emerald-400 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Bookmark className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Centralized Prompt Library</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-lg">
                Organize, tag, search, and retrieve all your successfully enhanced prompts in a
                secure storage vault.
              </p>
            </div>

            {/* Visual Preview */}
            <div className="relative z-10 border border-white/10 rounded-2xl bg-black/50 p-4 h-32 overflow-hidden flex flex-col gap-3 shadow-lg">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="h-7 bg-white/5 rounded-lg w-32 text-[10px] flex items-center px-3 font-medium border border-white/10 text-muted-foreground">
                  🔍 Search library...
                </div>
                <div className="h-7 bg-primary/20 text-primary rounded-lg px-3 text-[10px] flex items-center font-bold border border-primary/30">
                  Marketing
                </div>
                <div className="h-7 bg-white/5 rounded-lg px-3 text-[10px] flex items-center text-muted-foreground font-medium border border-white/10">
                  Coding
                </div>
              </div>
              <div className="flex gap-3 h-full">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] flex flex-col justify-center">
                  <div className="font-bold text-white mb-1">Copywriting Refiner</div>
                  <div className="text-muted-foreground line-clamp-1">
                    Act as a professional copywriter and rewrite the...
                  </div>
                </div>
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] flex flex-col justify-center">
                  <div className="font-bold text-white mb-1">SQL Generator</div>
                  <div className="text-muted-foreground line-clamp-1">
                    Convert natural language descriptions into highly...
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
