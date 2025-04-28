'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Copy, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import supabase from '@/lib/supabase'
import { useUser } from '@/context/UserContext'

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


  return (
    <SidebarProvider>
      <div className="flex w-screen min-h-screen bg-gray-50">
        {/* Main Content */}
        <div className="flex flex-1 items-center justify-center w-screen">
          <div className="w-full max-w-4xl flex flex-col items-center text-center space-y-10 border-2 border-amber-500 mb-[40rem]">
            {/* Title */}
            <div className='space-y-2 border-2 border-blue-500'>
              <h2 className="text-5xl font-bold text-gray-800">Prompt Enhancer</h2>
              <h3 className="text-xl text-gray-500">
                Just enter your prompts and let AI enhance them for you.
              </h3>
            </div>
            {/* Prompt Inputs */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col md:flex-row gap-6 items-center border-2 border-red-500"
            >
              {/* Input 1 */}
              <textarea
                className="w-full md:w-2/3 p-4 border border-gray-300 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                placeholder="Enter your prompt here..."
              />

              {/* Enhance Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white font-semibold px-8 py-4 rounded-2xl hover:bg-gray-900 transition cursor-pointer"
              >
                {isLoading ? 'Enhancig....' : 'Enhance'}
              </button>
            </motion.form>

            {/* Response Section */}
            {response.slice(7) && (
              <div className="relative">
                <motion.textarea
                  ref={input2Ref}
                  className="w-full p-4 border border-gray-300 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-black resize-none overflow-y-hidden"
                  value={response}
                  placeholder="Enhanced prompt will appear here..."
                  disabled
                  rows={6}
                />
                <Copy
                  onClick={handleCopy}
                  className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-black"
                />
              </div>
            )}

            {/* Feedback Section */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                key="feedback"
                initial={{opacity:0, scale: 0.8}}
                animate={{opacity:1, scale:1}}
                exit={{opacity: 0}}
                transition={{duration: 0.5}}
                className='w-full flex flex-col items-center gap-4 p-6 bg-white border border-gray-200 rounded-2xl shadow-lg mt-4'
                >
                    <h2 className=' text-lg text-gray-700'>Are you happy with the response given by AI?</h2>
                    <div className="flex gap-8">

                    <ThumbsUpIcon style={{ color: 'green' }} size={36} onClick={handlePositiveFeedback} className='hover:scale-110 transition cursor-pointer'/>
                    <ThumbsDownIcon style={{ color: 'red' }} size={36} onClick={handleNegativeFeedback} className='hover:scale-110 transition cursor-pointer'/>
                    </div>

                </motion.div>
              )}
            </AnimatePresence>


            {/* Loading Animation */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-gray-500 text-sm mt-4"
                >
                  Enhancing prompts <span className="animate-pulse">...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
