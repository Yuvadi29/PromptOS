import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { Sparkles, Brain, Layers3, ArrowRight } from "lucide-react";
import FeatureCard from '@/components/FeatureCard';


const page = () => {
  return (
    <main className='min-h-screen flex flex-col'>
      {/* Hero */}
      <section className='py-20 text-center bg-gradient-to-b from-white to-gray-100'>
        <h1 className='text-4xl sm:text-6xl font-bold text-gray-900'>
          SuperCharge your Prompts ⚡️
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
          Boost clarity, compare LLMs,and build smarter AI workflows with PromptOS.
        </p>
        <div className="mt-8">
          <Link href={'/dashboard'}>
            <Button size={"lg"} className='text-base'>
              Start Enhancing Prompts <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className='py-16 bg-white'>
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <FeatureCard
            icon={<Sparkles className='mx-auto text-indigo-500' size={32} />}
            title='Prompt Enhancer'
            desc='Rewrite and optimize prompts for better results using Gemini.'
          />
          <FeatureCard
            icon={<Layers3 className="mx-auto text-pink-500" size={32} />}
            title="LLM Comparison"
            desc="Compare outputs from GPT-4, Claude, and Gemini side-by-side."
          />
          <FeatureCard
            icon={<Brain className="mx-auto text-blue-500" size={32} />}
            title="Prompt Scoring"
            desc="Rate prompts based on clarity, specificity, and effectiveness."
          />
        </div>
      </section>

      {/* CTA */}
      <section className='py-20 bg-gray-100 text-center'>
        <h2 className="text-3xl font-semibold">Your new AI Prompt OS awaits.</h2>
        <p className="mt-2 text-gray-600">Sign In and Start your Prompt Journey</p>
        <div className="mt-6">
          <Link href={'/dashboard'}>
            <Button variant={"outline"}>Try PromptOS</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='py-6 border-t text-center text-sm text-gray-500'>
      © 2025 PromptOS • <Link href="https://github.com/Yuvadi29/PromptOS">GitHub</Link>
      </footer>
    </main>
  )
}

export default page