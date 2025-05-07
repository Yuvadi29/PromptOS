'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Copy, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import supabase from '@/lib/supabase'

export default function PromptEnhancer() {
  const [input1, setInput1] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const input2Ref = useRef<HTMLTextAreaElement>(null)
  const { data: session } = useSession();
  const [showFeedback, setShowFeedback] = useState(false);

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
      input2Ref.current.style.height = "auto"; // Reset height
      input2Ref.current.style.height = `${input2Ref.current.scrollHeight}px`; // Set to scroll height
      input2Ref.current.style.width = "70rem";
    }
  }, [response])

  useEffect(() => {
    if (response) {
      const timer = setTimeout(async () => {
        try {
          if (!session?.user?.email) {
            console.log('User not authenticated');
            return;
          }

          // Fetch user id from Supabase
          const { data: userData, error } = await supabase
            .from('users')
            .select('id')
            .eq('email', session?.user?.email)
            .single();

          if (error || !userData) {
            console.error('Failed to fetch user ID from Supabase: ', error);
            return;
          }

          console.log('UserID: ', userData.id);

          const res = await fetch('/api/save-prompt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: userData?.id,
              prompt: response,
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


      // Show Feedback after 5 seconds
      const feedbackTimer = setTimeout(() => {
        setShowFeedback(true);
      }, 5000);

      return () => {
        clearTimeout(timer)
        clearTimeout(feedbackTimer);
      }
    }
  }, [response, session, supabase]);

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response)
      toast.success('Copied to Clipboard!!')
    }
  }

  const handlePositiveFeedback = async () => {
    try {
      const storeFeedback = await fetch('/api/positive-feedback', {
        method: 'POST',
        body: JSON.stringify({ response }), // no need to `${response}` because it's already a string
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (storeFeedback.ok) {
        toast.success('Thank you for your feedback!');
      } else {
        toast.error('Failed to store feedback.');
      }
    } catch (error) {
      console.error('Error Storing Feedback: ', error);
      toast.error('Something went wrong.');
    }
  };

  const handleNegativeFeedback = async () => {
    try {
      const storeFeedback = await fetch('/api/negative-feedback', {
        method: 'POST',
        body: JSON.stringify({ response }), // no need to `${response}` because it's already a string
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (storeFeedback.ok) {
        toast.success('Thank you for your feedback!');
      } else {
        toast.error('Failed to store feedback.');
      }
    } catch (error) {
      console.error('Error Storing Feedback: ', error);
      toast.error('Something went wrong.');
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
        </div>

    );
}

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full items-center justify-center bg-white p-6">
        <div className="w-full max-w-4xl rounded-3xl bg-white shadow-xl p-8 space-y-8 text-gray-800 border-2 border-gray-200">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">✨ Prompt Enhancer</h1>
            <p className="text-gray-500 text-sm">Enter your raw prompt and get a refined, model-ready version instantly.</p>
          </div>

          {/* Prompt Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <textarea
              className="w-full bg-gray-100 border border-gray-300 rounded-xl p-4 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
              rows={4}
              placeholder="Write your prompt here..."
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white transition rounded-xl py-3 font-semibold tracking-wide cursor-pointer"
            >
              {isLoading ? 'Enhancing...' : 'Enhance Prompt'}
            </button>
          </motion.form>

          {/* Output */}
          {response.slice(7) && (
            <div className="relative">
              <motion.textarea
                ref={input2Ref}
                value={response}
                disabled
                className="w-full max-w-full bg-gray-100 text-gray-800 p-4 rounded-xl border border-gray-300 focus:outline-none resize-none"
                rows={6}
              />
              <Copy
                onClick={handleCopy}
                className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-black transition"
              />
            </div>
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
                className="flex flex-col items-center space-y-3 bg-gray-100 p-4 rounded-xl border border-gray-200"
              >
                <p className="text-sm text-gray-700">Was this enhancement useful?</p>
                <div className="flex gap-6">
                  <ThumbsUpIcon size={30} className="text-green-400 hover:scale-110 transition cursor-pointer" onClick={handlePositiveFeedback} />
                  <ThumbsDownIcon size={30} className="text-red-400 hover:scale-110 transition cursor-pointer" onClick={handleNegativeFeedback} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loader */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-500 text-center"
            >
              Enhancing your prompt<span className="animate-pulse">...</span>
            </motion.div>
          )}
        </div>
      </div>
    </SidebarProvider>

  )
}
