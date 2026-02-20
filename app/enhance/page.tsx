'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Copy, ThumbsDownIcon, ThumbsUpIcon, Sparkles, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { supabaseAdmin } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button'
import { SiOpenai } from "react-icons/si";
import { RiGeminiFill } from "react-icons/ri";

export default function PromptEnhancer() {
  const [input1, setInput1] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const input2Ref = useRef<HTMLTextAreaElement>(null)
  const { data: session } = useSession();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackState, setFeedbackState] = useState<null | 'like' | 'dislike'>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResponse('')
    setIsLoading(true)

    const res = await fetch('/api/enhance', {
      method: 'POST',
      body: JSON.stringify({ prompt: `${input1}` }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.body) return

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      setResponse((prev) => prev + chunk.replace(/^data: /gm, ''))
    }

    setIsLoading(false)
  }

  useEffect(() => {
    if (input2Ref.current) {
      input2Ref.current.style.height = "auto";
      input2Ref.current.style.height = `${input2Ref.current.scrollHeight}px`;
    }
  }, [response])

  useEffect(() => {
    if (response) {
      const timer = setTimeout(async () => {
        try {
          if (!session?.user?.email) {
            toast.info('User not authenticated');
            return;
          }

          const { data: userData, error } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', session?.user?.email)
            .single();

          if (error || !userData) {
            console.error('Failed to fetch user ID from Supabase: ', error);
            return;
          }

          const res = await fetch('/api/save-prompt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: userData?.id,
              prompt: response,
              originalPrompt: input1
            }),
          });

          if (res.ok) {
            toast.success('Prompt Saved!!');
          } else {
            toast.warning('Failed to Save Prompt')
          }
        } catch (error) {
          console.error('Error Saving the prompt: ', error);
        }
      }, 3000);

      const feedbackTimer = setTimeout(() => {
        setShowFeedback(true);
      }, 5000);

      return () => {
        clearTimeout(timer)
        clearTimeout(feedbackTimer);
      }
    }
  }, [response, session, input1]);

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response)
      toast.success('Copied to Clipboard!!')
    }
  }

  const handlePositiveFeedback = async () => {
    try {
      setFeedbackState('like');
      const storeFeedback = await fetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ response, feedback: true }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (storeFeedback.ok) {
        toast.success('Thank you for your feedback!');
      } else {
        toast.error('Feedback can only be given once per prompt.');
      }
    } catch (error) {
      console.error('Error Storing Feedback: ', error);
      toast.error('Something went wrong.');
    }
  };

  const handleNegativeFeedback = async () => {
    try {
      setFeedbackState('dislike');

      const storeFeedback = await fetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ response, feedback: false }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (storeFeedback.ok) {
        toast.success('Thank you for your feedback!');
      } else {
        toast.error('Feedback can only be given once per prompt.');
      }
    } catch (error) {
      console.error('Error Storing Feedback: ', error);
      toast.error('Something went wrong.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-zinc-800 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-zinc-400 animate-pulse">Enhancing your prompt...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-6 relative">
        <div className="w-full max-w-4xl space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-300">AI-Powered Enhancement</span>
            </div>
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Prompt Enhancer
              </span>
            </h1>
            <p className="text-zinc-400">Transform your prompts into powerful, model-ready instructions</p>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-900/50 border border-zinc-800 p-8 space-y-6"
          >
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Your Prompt</label>
                <textarea
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:outline-none resize-none transition-all"
                  rows={4}
                  placeholder="Enter your prompt here..."
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !input1.trim()}
                className="w-full group relative px-8 py-6 text-lg font-semibold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 transition-all duration-300 shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/60"
              >
                <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                {isLoading ? 'Enhancing...' : 'Enhance Prompt'}
              </Button>
            </form>

            {/* Output */}
            {response.slice(7) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-300">Enhanced Prompt</label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-white"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>

                <div
                  ref={input2Ref as unknown as React.RefObject<HTMLDivElement>}
                  className="w-full bg-zinc-800/50 text-white p-6 rounded-xl border border-zinc-700 prose prose-invert max-w-none"
                >
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 justify-center pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleCopy();
                      toast.success("Prompt copied! Opening ChatGPT...");
                      window.open("https://chat.openai.com/chat", "_blank");
                    }}
                    className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-white"
                  >
                    <SiOpenai className="mr-2" fill='#0BA37F' />
                    Open in ChatGPT
                  </Button>

                  <svg width="0" height="0">
                    <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop stopColor="#AF78B2" offset="0%" />
                      <stop stopColor="#D96E6A" offset="100%" />
                    </linearGradient>
                  </svg>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleCopy();
                      toast.success("Prompt copied! Opening Gemini...");
                      window.open("https://gemini.google.com/app", "_blank");
                    }}
                    className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-white"
                  >
                    <RiGeminiFill className="mr-2" style={{ fill: "url(#gemini-gradient)" }} size={18} />
                    Open in Gemini
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center space-y-3 bg-zinc-800/50 p-6 rounded-xl border border-zinc-700"
                >
                  <p className="text-sm text-zinc-300">Was this enhancement helpful?</p>
                  <div className="flex gap-6">
                    <ThumbsUpIcon
                      size={30}
                      className={`${feedbackState === 'like' ? "text-green-400" : "text-zinc-500"} hover:text-green-400 hover:scale-110 transition cursor-pointer`}
                      onClick={handlePositiveFeedback}
                      fill={feedbackState === 'like' ? 'currentColor' : 'none'}
                    />
                    <ThumbsDownIcon
                      size={30}
                      className={`${feedbackState === 'dislike' ? "text-red-400" : "text-zinc-500"} hover:text-red-400 hover:scale-110 transition cursor-pointer`}
                      onClick={handleNegativeFeedback}
                      fill={feedbackState === 'dislike' ? 'currentColor' : 'none'}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  )
}
