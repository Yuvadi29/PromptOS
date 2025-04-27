'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SidebarProvider } from '@/components/ui/sidebar'
import SideBar from '@/components/SideBar'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

export default function PromptEnhancer() {
  const [input1, setInput1] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const input2Ref = useRef<HTMLTextAreaElement>(null)

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

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response)
      toast.success('Copied to Clipboard!!')
    }
  }

  return (
    <SidebarProvider>
      <div className="border border-red-400">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 bg-white">
          <SideBar />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 items-center justify-center p-4 border-2 border-green-600 w-screen">
          <div className="w-full max-w-4xl space-y-8 flex flex-col items-center text-center">
            {/* Title */}
            <div>
              <h2 className="text-4xl font-bold mb-2">Prompt Enhancer</h2>
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
              className="w-full flex flex-col md:flex-row gap-4 items-center justify-center"
            >
              {/* Input 1 */}
              <textarea
                className="w-full md:w-1/2 p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black overflow-y-auto"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                placeholder="Enter your prompt here..."
              />

              {/* Enhance Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition md:ml-4 cursor-pointer"
              >
                Enhance
              </button>
            </motion.form>

            {/* Response Section */}
            {response && (
              <div className="relative">
                <motion.textarea
                  ref={input2Ref}
                  className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  value={response}
                  placeholder="Enhanced prompt will appear here..."
                  disabled
                />
                <Copy
                  onClick={handleCopy}
                  className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-black"
                />
              </div>
            )}


            {/* Loading Animation */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-gray-500 text-sm"
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
