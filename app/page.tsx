'use client';

import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Zap,
  Code,
  FileText,
  MessageSquare,
  ImageIcon,
  BookOpen,
  Users,
  GitBranch,
  BarChart3,
  Terminal,
  Braces,
  // Database,
  Cpu,
  Database,
} from "lucide-react"
import Link from "next/link"
import FeatureCard from "@/components/feature-card"
import UseCaseCard from "@/components/use-case-card"
import MetricCard from "@/components/metric-card"
import HeroAnimation from "@/components/hero-animation"
import CodeWindow from "@/components/code-window"
import TerminalWindow from "@/components/terminal-window"
import ScrollAnimation from "@/components/scroll-animation"
import GradientText from "@/components/gradient-text"
import { AuthButton } from "@/components/AuthButton"
import { useEffect } from "react"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"

export default function Home() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (error === 'unauthorized') {
      toast.info('Please sign in first!!');
    }
  }, [error]);


  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 bg-[size:30px_30px]"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-green-400"></div>
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-12 relative z-10">
          <div className="flex flex-col justify-center space-y-4 md:space-y-6 flex-1">
            <div className="inline-block px-3 py-1 rounded-full text-white text-md font-medium mb-2">
              Introducing PromptOS
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              The Intelligent <GradientText>Prompt Operating System</GradientText>
            </h1>
            <p className="max-w-[600px] text-gray-400 md:text-xl">
              Enhance, learn from, and personalize prompts across multiple domains with our LLM-agnostic platform
              powered by Gemini.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={'/dashboard'}>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-8 py-6 text-lg border-0 cursor-pointer">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div className="border-white text-whitetext-lg">
                <AuthButton />
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <HeroAnimation />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            className="relative block w-full h-[50px] md:h-[100px]"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-white"
            ></path>
          </svg>
        </div>
      </section>

      {/* Code Example Section */}
      {/* <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <ScrollAnimation>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="inline-block px-3 py-1 rounded-full bg-black/10 text-black text-sm font-medium mb-4">
                  Developer-Friendly
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                  Powerful <span className="text-purple-600">API</span> for Prompt Enhancement
                </h2>
                <p className="text-gray-500 mb-6">
                  PromptOS provides a simple yet powerful API to enhance your prompts programmatically. Integrate with
                  your existing workflows and applications.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-black text-white hover:bg-gray-800">
                    View Documentation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                <CodeWindow
                  title="prompt-enhancer.js"
                  code={`// Import the PromptOS SDK
import { PromptOS } from 'promptos';

// Initialize with your API key
const promptos = new PromptOS('YOUR_API_KEY');

async function enhancePrompt() {
  // Original prompt
  const originalPrompt = 
    "Write code for a React component";
  
  // Enhance the prompt
  const enhanced = await promptos.enhance(
    originalPrompt, 
    { 
      domain: 'code',
      specificity: 'high',
      context: 'web development'
    }
  );
  
  console.log(enhanced.prompt);
  // "Create a reusable React functional 
  // component that displays a responsive 
  // card with title, description, and image. 
  // Include proper TypeScript typing and 
  // implement error handling for missing props."
}`}
                />
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section> */}

      {/* Terminal Example Section */}
      {/* <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <ScrollAnimation>
            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="flex-1">
                <div className="inline-block px-3 py-1 rounded-full bg-black/10 text-black text-sm font-medium mb-4">
                  CLI Tools
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                  Command Line <span className="text-blue-500">Interface</span> for Rapid Workflow
                </h2>
                <p className="text-gray-500 mb-6">
                  Use our powerful CLI to enhance prompts directly from your terminal. Perfect for developers and power
                  users who want to integrate PromptOS into their existing workflows.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-blue-500 text-white hover:bg-blue-600">
                    Install CLI
                    <Terminal className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                <TerminalWindow
                  commands={[
                    { prompt: "$", command: "npm install -g promptos-cli" },
                    { prompt: "$", command: "promptos login" },
                    { output: "Logged in successfully as developer@example.com" },
                    { prompt: "$", command: 'promptos enhance "Create a landing page"' },
                    { output: "Enhancing prompt..." },
                    {
                      output: "Enhanced prompt:",
                      success: true,
                      multiline: [
                        "Design a responsive landing page with:",
                        "- Hero section with clear value proposition",
                        "- Feature highlights with icons and descriptions",
                        "- Testimonial section for social proof",
                        "- Call-to-action optimized for conversion",
                        "- Mobile-first approach with accessibility considerations",
                      ],
                    },
                    { prompt: "$", command: "" },
                  ]}
                />
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section> */}

      {/* Phase 1 Features */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <ScrollAnimation>
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm font-medium">
                Phase 1 - MVP
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Core <GradientText>Features</GradientText>
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl">
                Our MVP delivers essential functionality to enhance your prompt engineering workflow.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Zap className="h-10 w-10" />}
                title="Prompt Enhancer"
                description="User inputs a prompt → Enhanced by Gemini → Before/After shown"
                accentColor="purple"
              />
              <FeatureCard
                icon={<MessageSquare className="h-10 w-10" />}
                title="LLM Output Comparison"
                description="Toggle outputs from GPT-4, Claude, Gemini"
                accentColor="blue"
              />
              <FeatureCard
                icon={<BarChart3 className="h-10 w-10" />}
                title="Prompt Scoring"
                description="Predict Prompt Effectiveness (Clarity, Specificity, Model Compatibility)"
                accentColor="green"
              />
              <FeatureCard
                icon={<Users className="h-10 w-10" />}
                title="Feedback Collector"
                description="Thumbs up/down + comments + save to profile"
                accentColor="orange"
              />
              <FeatureCard
                icon={<FileText className="h-10 w-10" />}
                title="Prompt Library"
                description="Save enhanced prompts by category (e.g code, image, case study)"
                accentColor="purple"
              />
              <FeatureCard
                icon={<Code className="h-10 w-10" />}
                title="User Profile + Memory"
                description="Personalized prompt tuning based on usage & feedback (Coming Soon...)"
                accentColor="blue"
              />
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Phase 2 Features */}
      <section className="w-full py-12 md:py-24 bg-gray-50 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-400 to-orange-500"></div>
        <div className="container px-4 md:px-6 mx-auto">
          <ScrollAnimation>
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white text-sm font-medium">
                Phase 2 - Power Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Advanced <GradientText colors="from-blue-500 via-green-400 to-orange-500">Capabilities</GradientText>
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl">
                Our roadmap includes powerful features to take your prompt engineering to the next level.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Braces className="h-10 w-10" />}
                title="Prompt-to-Agent"
                description="Turn repeated prompt patterns into custom 'Prompt Agents'"
                accentColor="blue"
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10" />}
                title="Feedback Learning Loop"
                description="Fine-tune Gemini on user feedback & new improved prompts"
                accentColor="green"
              />
              <FeatureCard
                icon={<GitBranch className="h-10 w-10" />}
                title="Prompt Versioning"
                description="Track how a prompt evolves with edits, feedback, and output quality"
                accentColor="orange"
              />
              <FeatureCard
                icon={<Users className="h-10 w-10" />}
                title="Prompt Collaboration"
                description="Share Prompt Packs / Agents with teams or public"
                accentColor="purple"
              />
              <FeatureCard
                icon={<Cpu className="h-10 w-10" />}
                title="Auto-Prompt Selector"
                description="Based on input intent → auto-picks best model + template"
                accentColor="blue"
              />
              <FeatureCard
                icon={<BarChart3 className="h-10 w-10" />}
                title="Analytics Dashboard"
                description="Visualize prompt usage, effectiveness, feedback scores"
                accentColor="green"
              />
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Use Cases */}
      {/* <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <ScrollAnimation>
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm font-medium">
                Target Use Cases
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Optimize Prompts <GradientText>Across Domains</GradientText>
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl">
                PromptOS enhances your workflow across multiple use cases and domains.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UseCaseCard
                icon={<Code className="h-8 w-8 text-purple-600" />}
                title="Code Review & Refactoring"
                description="Detect bad code prompts → rewrite for clarity, ask better questions"
              />
              <UseCaseCard
                icon={<FileText className="h-8 w-8 text-blue-500" />}
                title="Case Study Generation"
                description="Create structured case study templates with dynamic input"
              />
              <UseCaseCard
                icon={<MessageSquare className="h-8 w-8 text-green-500" />}
                title="Marketing Copy / SEO"
                description="Enhance prompts for tone, keyword focus, emotional appeal"
              />
              <UseCaseCard
                icon={<ImageIcon className="h-8 w-8 text-orange-500" />}
                title="Image Prompting"
                description="Reframe vague prompts into vivid visual descriptions for DALL·E, Midjourney"
              />
              <UseCaseCard
                icon={<BookOpen className="h-8 w-8 text-purple-600" />}
                title="Study / Learning Prompts"
                description="Build Socratic-style queries, flashcards, and concept chains"
              />
            </div>
          </ScrollAnimation>
        </div>
      </section> */}

      {/* System Architecture */}
      <section className="w-full py-12 md:py-24 bg-black text-white relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 bg-[size:30px_30px]"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></div>
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <ScrollAnimation>
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white text-sm font-medium">
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                System <GradientText colors="from-green-400 via-blue-500 to-purple-600">Architecture</GradientText>
              </h2>
              <p className="max-w-[700px] text-gray-400 md:text-xl">
                PromptOS is built on a robust architecture designed for continuous learning and improvement.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="gradient-border bg-white/5 p-6">
                <div className="flex items-center mb-4">
                  <Database className="h-6 w-6 text-green-400 mr-2" />
                  <h3 className="text-xl font-bold">Prompt-Output Pairs</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-green-400">•</div>
                    <span>Original → Enhanced Prompt</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-green-400">•</div>
                    <span>Prompt → Expected Output (optional)</span>
                  </li>
                </ul>
              </div>
              <div className="gradient-border bg-white/5 p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-blue-500 mr-2" />
                  <h3 className="text-xl font-bold">Feedback Dataset</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-blue-500">•</div>
                    <span>Prompt + Response + User Rating + Comments</span>
                  </li>
                </ul>
              </div>
              <div className="gradient-border bg-white/5 p-6">
                <div className="flex items-center mb-4">
                  <Code className="h-6 w-6 text-purple-600 mr-2" />
                  <h3 className="text-xl font-bold">Use-Case Context</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-purple-600">•</div>
                    <span>Domain tags (e.g. code, design, marketing)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-purple-600">•</div>
                    <span>User profile features (experience level, preference style)</span>
                  </li>
                </ul>
              </div>
              <div className="gradient-border bg-white/5 p-6">
                <div className="flex items-center mb-4">
                  <Cpu className="h-6 w-6 text-orange-500 mr-2" />
                  <h3 className="text-xl font-bold">RLHF / RLAIF Loop</h3>
                </div>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-orange-500">•</div>
                    <span>Fine-tune on user-preferred enhancements</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-orange-500">•</div>
                    <span>Optionally retrain daily/weekly on top-rated data</span>
                  </li>
                </ul>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Metrics */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <ScrollAnimation>
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm font-medium">
                Success Metrics
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Measuring <GradientText>Impact</GradientText>
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl">
                We track these key metrics to ensure PromptOS delivers real value.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Prompt Improvement Score"
                description="% increase in prompt clarity/specificity"
                icon={<BarChart3 className="h-6 w-6 text-purple-600" />}
              />
              <MetricCard
                title="Feedback Positivity Rate"
                description="Measure user satisfaction per enhancement"
                icon={<Users className="h-6 w-6 text-blue-500" />}
              />
              {/* <MetricCard
                title="Prompt Reuse Frequency"
                description="Indicates perceived value"
                icon={<GitBranch className="h-6 w-6 text-green-500" />}
              /> */}
              {/* <MetricCard
                title="Time-to-Insight"
                description="Time saved compared to manual prompt crafting"
                icon={<Zap className="h-6 w-6 text-orange-500" />}
              /> */}
              <MetricCard
                title="Output Quality Score"
                description="(Optional, rated by model or human)"
                icon={<FileText className="h-6 w-6 text-purple-600" />}
              />
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 md:py-24 bg-black text-white relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 bg-[size:30px_30px]"></div>
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <ScrollAnimation>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to <GradientText>Supercharge</GradientText> Your Prompts?
              </h2>
              <p className="max-w-[600px] text-gray-400 md:text-xl">
                Join PromptOS today and transform how you interact with AI models.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-8 py-6 text-lg border-0 cursor-pointer">
                  Start Now!!!
                </Button>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold">PromptOS</span>
            </div>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
                Contact
              </Link>
            </div>
            <div className="text-gray-500 text-sm">© 2025 PromptOS. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
