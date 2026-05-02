'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Sparkles,
  Zap,
  ArrowRight,
  MessageCircleQuestion,
  SkipForward,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { supabaseAdmin } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { SiOpenai } from 'react-icons/si';
import { RiGeminiFill } from 'react-icons/ri';

type Phase = 'input' | 'loading-questions' | 'questions' | 'enhancing' | 'result';

// interface QAPair {
//   question: string;
//   answer: string;
// }

const STATUS_MESSAGES = [
  { emoji: '🔍', text: 'Analysing your answers...' },
  { emoji: '🧠', text: 'Understanding the context...' },
  { emoji: '✨', text: 'Curating the best prompt for you...' },
  { emoji: '🚀', text: 'Almost there, polishing your prompt...' },
];

export default function PromptEnhancer() {
  const [response, setResponse] = useState('');
  const [phase, setPhase] = useState<Phase>('input');
  const [questions, setQuestions] = useState<string[]>([]);
  const [statusIndex, setStatusIndex] = useState(0);
  const input2Ref = useRef<HTMLTextAreaElement>(null);
  const { data: session } = useSession();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackState, setFeedbackState] = useState<null | 'like' | 'dislike'>(null);
  const [formats, setFormats] = useState<{
    raw?: string;
    markdown?: string;
    json?: any;
  }>({});
  const [activeTab, setActiveTab] = useState<'raw' | 'markdown' | 'json'>('raw');
  const [, setPromptType] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [answers, setAnswers] = useState<any[]>([]);

  // Cycle through status messages during enhancing phase
  useEffect(() => {
    if (phase !== 'enhancing') return;
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [phase]);

  // Generate questions from the user's prompt
  const handleGenerateQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setPhase('loading-questions');

    try {
      const res = await fetch('/api/enhance/questions', {
        method: 'POST',
        body: JSON.stringify({ prompt: prompt }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to generate questions');

      const data = await res.json();
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(''));
      setPhase('questions');
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate questions. Enhancing directly...');
      // Fallback: enhance directly without questions
      handleEnhancePrompt();
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt || prompt.trim() === '') {
      alert('Please enter a prompt first');
      return;
    }

    const cleanedAnswers = answers.filter((a) => a.answer && a.answer.trim() !== '');

    try {
      setPhase('enhancing');
      const res = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          answers: cleanedAnswers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPhase('input'); // Reset to input phase so they can try again
        if (res.status === 400) {
          toast.error(
            'We are having huge traffic currently on the site, please try again after sometime'
          );
        } else {
          toast.error(data.error || 'Enhance failed');
        }
        return;
      }
      setPhase('result');
      setFormats(data.formats);
      setPromptType(data.type);

      // Smart default tab
      if (data.type === 'image' || data.type === 'video' || data.type === 'data') {
        setActiveTab('json');
      } else if (data.type === 'content' || data.type === 'marketing') {
        setActiveTab('markdown');
      } else {
        setActiveTab('raw');
      }
    } catch (err) {
      console.error('Enhance error:', err);
      setPhase('input');
      toast.error('Something went wrong');
    }
  };

  const handleSubmitAnswers = () => {
    // const qaPairs: QAPair[] = questions.map((q, i) => ({
    //   question: q,
    //   answer: answers[i] || '',
    // }));

    handleEnhancePrompt();
  };

  // Skip questions and enhance directly
  const handleSkipQuestions = () => {
    handleEnhancePrompt();
  };

  useEffect(() => {
    if (input2Ref.current) {
      input2Ref.current.style.height = 'auto';
      input2Ref.current.style.height = `${input2Ref.current.scrollHeight}px`;
    }
  }, [response]);

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
              originalPrompt: prompt,
            }),
          });

          if (res.ok) {
            toast.success('Prompt Saved!!');
          } else {
            toast.warning('Failed to Save Prompt');
          }
        } catch (error) {
          console.error('Error Saving the prompt: ', error);
        }
      }, 3000);

      const feedbackTimer = setTimeout(() => {
        setShowFeedback(true);
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearTimeout(feedbackTimer);
      };
    }
  }, [response, session, prompt]);

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      toast.success('Copied to Clipboard!!');
    }
  };

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

  const allAnswered = answers.every((a) => a.trim().length > 0);

  // ─── LOADING QUESTIONS PHASE ──────────────────────────────────
  if (phase === 'loading-questions') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-5"
        >
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 opacity-20 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 opacity-30 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <MessageCircleQuestion className="w-8 h-8 text-orange-400" />
            </div>
          </div>
          <p className="text-zinc-300 text-lg font-medium animate-pulse">
            Generating questions to understand your needs...
          </p>
          <p className="text-zinc-500 text-sm">This will help create a much better prompt</p>
        </motion.div>
      </div>
    );
  }

  // ─── ENHANCING PHASE ──────────────────────────────────────────
  if (phase === 'enhancing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-6 max-w-md">
          {/* Animated orb */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 opacity-20 animate-ping" />
            <div className="absolute inset-1 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 opacity-30 animate-pulse" />
            <motion.div
              className="absolute inset-3 rounded-full bg-gradient-to-br from-orange-500 to-amber-500"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Cycling status messages */}
          <AnimatePresence mode="wait">
            <motion.div
              key={statusIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-2"
            >
              <p className="text-2xl">{STATUS_MESSAGES[statusIndex].emoji}</p>
              <p className="text-lg font-medium text-zinc-200">
                {STATUS_MESSAGES[statusIndex].text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex gap-2 mt-4">
            {STATUS_MESSAGES.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  i === statusIndex
                    ? 'bg-orange-400 scale-125'
                    : i < statusIndex
                      ? 'bg-orange-400/50'
                      : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
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
            <p className="text-zinc-400">
              {phase === 'input' &&
                'Transform your prompts into powerful, model-ready instructions'}
              {phase === 'questions' &&
                'Answer these questions so we can craft the perfect prompt for you'}
              {phase === 'result' && "Here's your enhanced prompt"}
            </p>
          </motion.div>

          {/* Step Indicator */}
          {phase !== 'result' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-3"
            >
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  phase === 'input'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    : 'bg-zinc-800/50 text-zinc-500 border border-zinc-700/50'
                }`}
              >
                {phase !== 'input' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
                    1
                  </span>
                )}
                Enter Prompt
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  phase === 'questions'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    : 'bg-zinc-800/50 text-zinc-500 border border-zinc-700/50'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-zinc-600 text-white text-[10px] flex items-center justify-center font-bold">
                  2
                </span>
                Answer Questions
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-800/50 text-zinc-500 border border-zinc-700/50">
                <span className="w-4 h-4 rounded-full bg-zinc-600 text-white text-[10px] flex items-center justify-center font-bold">
                  3
                </span>
                Enhanced Prompt
              </div>
            </motion.div>
          )}

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-900/50 border border-zinc-800 p-8 space-y-6"
          >
            {/* ─── INPUT PHASE ──────────────────────────────────── */}
            {phase === 'input' && (
              <form onSubmit={handleGenerateQuestions} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Your Prompt</label>
                  <textarea
                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:outline-none resize-none transition-all"
                    rows={4}
                    placeholder="Enter your prompt here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="w-full group relative px-8 py-6 text-lg font-semibold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 transition-all duration-300 shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/60"
                >
                  <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Enhance Prompt
                </Button>
              </form>
            )}

            {/* ─── QUESTIONS PHASE ──────────────────────────────── */}
            {phase === 'questions' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 pb-2 border-b border-zinc-800">
                  <MessageCircleQuestion className="w-5 h-5 text-orange-400" />
                  <h2 className="text-lg font-semibold text-zinc-200">
                    Help us understand your needs
                  </h2>
                </div>

                {questions.map((question, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <label className="flex items-start gap-3 text-sm font-medium text-zinc-300">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold mt-0.5">
                        {index + 1}
                      </span>
                      {question}
                    </label>
                    <textarea
                      className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 pl-12 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:outline-none resize-none transition-all text-sm"
                      rows={2}
                      placeholder="Type your answer..."
                      value={answers[index]}
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[index] = e.target.value;
                        setAnswers(newAnswers);
                      }}
                    />
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3 pt-4"
                >
                  <Button
                    onClick={handleSubmitAnswers}
                    disabled={!allAnswered}
                    className="flex-1 group relative px-8 py-6 text-lg font-semibold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 transition-all duration-300 shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/60 disabled:opacity-50 disabled:shadow-none"
                  >
                    <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Generate Enhanced Prompt
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleSkipQuestions}
                    className="px-6 py-6 text-sm font-medium bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-all"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Skip Questions
                  </Button>
                </motion.div>

                {!allAnswered && (
                  <p className="text-xs text-zinc-500 text-center">
                    Answer all questions to generate the best possible prompt, or skip to enhance
                    directly
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2 mb-4">
              {formats.raw && (
                <button
                  onClick={() => setActiveTab('raw')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    activeTab === 'raw' ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  Raw
                </button>
              )}

              {formats.markdown && (
                <button
                  onClick={() => setActiveTab('markdown')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    activeTab === 'markdown'
                      ? 'bg-orange-500 text-black'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  Markdown
                </button>
              )}

              {formats.json && (
                <button
                  onClick={() => setActiveTab('json')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    activeTab === 'json' ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  JSON
                </button>
              )}
            </div>
            {/* ─── RESULT PHASE ─────────────────────────────────── */}
            {phase === 'result' && (
              <>
                {/* {response.slice(7) && ( */}
                {formats.raw && (
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
                    <div className="relative bg-[#0B0F17] border border-[#1E2633] rounded-lg p-4 text-sm overflow-auto max-h-[400px]">
                      <button
                        onClick={() => {
                          let text = '';

                          if (activeTab === 'json') {
                            text = JSON.stringify(formats.json, null, 2);
                          } else {
                            text = formats[activeTab] || '';
                          }

                          navigator.clipboard.writeText(text);
                        }}
                        className="absolute top-3 right-3 text-xs px-2 py-1 rounded bg-[#1A2230] hover:bg-[#2A3240]"
                      >
                        Copy
                      </button>

                      <pre className="whitespace-pre-wrap text-orange-200 text-xs">
                        {activeTab === 'json'
                          ? JSON.stringify(formats.json, null, 2)
                          : formats[activeTab]}
                      </pre>
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
                          toast.success('Prompt copied! Opening ChatGPT...');
                          window.open('https://chat.openai.com/chat', '_blank');
                        }}
                        className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-white"
                      >
                        <SiOpenai className="mr-2" fill="#0BA37F" />
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
                          toast.success('Prompt copied! Opening Gemini...');
                          window.open('https://gemini.google.com/app', '_blank');
                        }}
                        className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-white"
                      >
                        <RiGeminiFill
                          className="mr-2"
                          style={{ fill: 'url(#gemini-gradient)' }}
                          size={18}
                        />
                        Open in Gemini
                      </Button>
                    </div>

                    {/* Start Over */}
                    <div className="flex justify-center pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPhase('input');
                          setPrompt('');
                          setResponse('');
                          setQuestions([]);
                          setAnswers(['', '', '', '', '']);
                          setShowFeedback(false);
                          setFeedbackState(null);
                        }}
                        className="text-zinc-500 hover:text-zinc-300"
                      >
                        ← Enhance another prompt
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
                          className={`${feedbackState === 'like' ? 'text-green-400' : 'text-zinc-500'} hover:text-green-400 hover:scale-110 transition cursor-pointer`}
                          onClick={handlePositiveFeedback}
                          fill={feedbackState === 'like' ? 'currentColor' : 'none'}
                        />
                        <ThumbsDownIcon
                          size={30}
                          className={`${feedbackState === 'dislike' ? 'text-red-400' : 'text-zinc-500'} hover:text-red-400 hover:scale-110 transition cursor-pointer`}
                          onClick={handleNegativeFeedback}
                          fill={feedbackState === 'dislike' ? 'currentColor' : 'none'}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
