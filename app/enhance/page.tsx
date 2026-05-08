'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Sparkles,
  ArrowRight,
  MessageCircleQuestion,
  Cpu,
  Activity,
  Terminal,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { supabaseAdmin } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { SiOpenai } from 'react-icons/si';
import { RiGeminiFill } from 'react-icons/ri';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

type Phase = 'input' | 'loading-questions' | 'questions' | 'enhancing' | 'result';

const STATUS_MESSAGES = [
  { emoji: '🔍', text: 'Analysing architectural patterns...' },
  { emoji: '🧠', text: 'Synthesizing contextual layers...' },
  { emoji: '✨', text: 'Optimizing linguistic density...' },
  { emoji: '🚀', text: 'Committing to core repository...' },
];

export default function PromptEnhancer() {
  const [response, setResponse] = useState('');
  const [phase, setPhase] = useState<Phase>('input');
  const [questions, setQuestions] = useState<string[]>([]);
  const [statusIndex, setStatusIndex] = useState(0);
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

  useEffect(() => {
    if (phase !== 'enhancing') return;
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [phase]);

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
      handleEnhancePrompt();
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt || prompt.trim() === '') {
      alert('Please enter a prompt first');
      return;
    }

    const cleanedAnswers = answers.filter((a) => a && a.trim() !== '');

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
        setPhase('input');
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
      setResponse(data.formats.markdown || data.formats.raw || '');

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
    handleEnhancePrompt();
  };

  const handleSkipQuestions = () => {
    handleEnhancePrompt();
  };

  useEffect(() => {
    if (response) {
      const timer = setTimeout(async () => {
        try {
          if (!session?.user?.email) return;

          const { data: userData, error } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', session?.user?.email)
            .single();

          if (error || !userData) return;

          await fetch('/api/save-prompt', {
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
    let text = '';
    if (activeTab === 'json') {
      text = JSON.stringify(formats.json, null, 2);
    } else {
      text = formats[activeTab] || response;
    }
    navigator.clipboard.writeText(text);
    toast.success('Copied to Clipboard!!');
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
      }
    } catch (error) {
      console.error('Error Storing Feedback: ', error);
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
      }
    } catch (error) {
      console.error('Error Storing Feedback: ', error);
    }
  };

  const allAnswered = answers.every((a) => a && a.trim().length > 0);

  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden noise-overlay">
      {/* Background elements */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-20 transition-opacity duration-1000"
        >
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black" />
      </div>

      {/* Subtle grid lines */}
      <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none opacity-[0.03]">
        {[...Array(12)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-white"
            style={{ top: `${(100 / 12) * (i + 1)}%`, left: 0, right: 0 }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-white"
            style={{ left: `${(100 / 12) * (i + 1)}%`, top: 0, bottom: 0 }}
          />
        ))}
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-32 lg:py-40">
        {/* Phase: Loading Questions */}
        <AnimatePresence mode="wait">
          {phase === 'loading-questions' && (
            <motion.div
              key="loading-questions"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="min-h-[400px] flex flex-col items-center justify-center gap-12"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center animate-ping" />
                </div>
                <MessageCircleQuestion className="absolute inset-0 m-auto w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="text-center space-y-4">
                <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white">
                  Generating Logical Queries
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  Deconstructing initial input parameters...
                </p>
              </div>
            </motion.div>
          )}

          {/* Phase: Enhancing */}
          {phase === 'enhancing' && (
            <motion.div
              key="enhancing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="min-h-[400px] flex flex-col items-center justify-center gap-12"
            >
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/5 to-transparent animate-spin-slow" />
                <motion.div
                  className="absolute inset-4 rounded-full border border-white/10 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="w-2 h-2 rounded-full bg-white absolute -top-1" />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white">
                    System Processing
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {STATUS_MESSAGES[statusIndex].text}
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  {STATUS_MESSAGES.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-1 rounded-full transition-all duration-500 ${i === statusIndex ? 'bg-white w-4' : 'bg-white/20'}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Interaction Phases */}
          {(phase === 'input' || phase === 'questions' || phase === 'result') && (
            <motion.div
              key="main-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-24"
            >
              {/* Hero Section */}
              <div className="flex flex-col items-start text-left max-w-4xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-px bg-foreground/30" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
                    Architectural Refinement
                  </span>
                </div>
                <h1 className="text-6xl md:text-7xl lg:text-[100px] font-display tracking-tight leading-[0.9] text-foreground mb-8">
                  Prompt Enhancer
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl font-display font-light leading-relaxed">
                  Transform raw concepts into high-density logical instructions. Our multi-phase
                  synthesizer optimizes for structural integrity and model fit.
                </p>
              </div>

              {/* Step Indicators */}
              {phase !== 'result' && (
                <div className="flex items-center gap-8 py-8 border-y border-foreground/5 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'input', label: 'Input Matrix', icon: Terminal },
                    { id: 'questions', label: 'Context Logic', icon: MessageCircleQuestion },
                    { id: 'enhancing', label: 'Synthesis', icon: Cpu },
                  ].map((step, i) => (
                    <div
                      key={step.id}
                      className={cn(
                        'flex items-center gap-3 shrink-0 transition-opacity',
                        phase === step.id ? 'opacity-100' : 'opacity-40'
                      )}
                    >
                      <div className="w-8 h-8 rounded-full border border-foreground/10 flex items-center justify-center font-mono text-[10px]">
                        {i + 1}
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest">
                        {step.label}
                      </span>
                      {i < 2 && <ArrowRight className="w-3 h-3 ml-4 opacity-20" />}
                    </div>
                  ))}
                </div>
              )}

              {/* Content Area */}
              <div className="grid gap-16 lg:grid-cols-12 items-start">
                <div className="lg:col-span-8 space-y-12">
                  {/* ─── INPUT PHASE ──────────────────────────────────── */}
                  {phase === 'input' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group relative"
                    >
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-white/10 to-transparent rounded-2xl" />
                      <div className="relative bg-black border border-foreground/10 rounded-2xl overflow-hidden p-8">
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                            <Terminal className="w-4 h-4 text-muted-foreground" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                              Source Input
                            </span>
                          </div>
                        </div>
                        <form onSubmit={handleGenerateQuestions} className="space-y-8">
                          <Textarea
                            placeholder="Insert base instruction set..."
                            className="min-h-[300px] resize-none bg-transparent border-none focus:ring-0 text-xl font-display font-light text-foreground p-0 placeholder:text-muted-foreground/30"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                          />
                          <div className="flex items-center justify-end pt-8 border-t border-foreground/5">
                            <Button
                              type="submit"
                              disabled={!prompt.trim()}
                              className="rounded-full bg-white text-black hover:bg-white/90 px-12 py-6 font-mono text-[10px] uppercase tracking-widest transition-all duration-500 flex items-center gap-4"
                            >
                              <span>Initialize Enhancement</span>
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  )}

                  {/* ─── QUESTIONS PHASE ──────────────────────────────── */}
                  {phase === 'questions' && (
                    <div className="space-y-8">
                      <div className="p-8 rounded-2xl bg-white/[0.02] border border-foreground/5">
                        <div className="flex items-center gap-3 mb-8">
                          <MessageCircleQuestion className="w-4 h-4 text-muted-foreground" />
                          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                            Contextual Logic Expansion
                          </span>
                        </div>
                        <div className="space-y-12">
                          {questions.map((question, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="space-y-4"
                            >
                              <p className="text-xl font-display font-light text-foreground flex gap-4">
                                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-2">
                                  {String(index + 1).padStart(2, '0')}
                                </span>
                                {question}
                              </p>
                              <Textarea
                                className="w-full bg-white/[0.03] border-none rounded-xl p-4 text-white focus:ring-1 focus:ring-white/20 resize-none transition-all font-display font-light text-lg h-24"
                                placeholder="Specify parameter value..."
                                value={answers[index]}
                                onChange={(e) => {
                                  const newAnswers = [...answers];
                                  newAnswers[index] = e.target.value;
                                  setAnswers(newAnswers);
                                }}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          onClick={handleSubmitAnswers}
                          disabled={!allAnswered}
                          className="flex-1 rounded-full bg-white text-black hover:bg-white/90 py-8 font-mono text-[10px] uppercase tracking-widest transition-all duration-500 disabled:opacity-20"
                        >
                          Execute Synthesis
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={handleSkipQuestions}
                          className="rounded-full border border-white/10 px-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-white transition-all"
                        >
                          Skip Contextual Phase
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* ─── RESULT PHASE ─────────────────────────────────── */}
                  {phase === 'result' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-12"
                    >
                      <div className="group relative">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-white/10 to-transparent rounded-2xl" />
                        <div className="relative bg-black border border-foreground/10 rounded-2xl overflow-hidden">
                          <div className="flex items-center justify-between p-8 border-b border-foreground/5">
                            <div className="flex items-center gap-6">
                              {['raw', 'markdown', 'json'].map(
                                (tab) =>
                                  formats[tab as keyof typeof formats] && (
                                    <button
                                      key={tab}
                                      onClick={() => setActiveTab(tab as any)}
                                      className={cn(
                                        'text-[10px] font-mono uppercase tracking-[0.2em] transition-colors',
                                        activeTab === tab
                                          ? 'text-white'
                                          : 'text-muted-foreground hover:text-white'
                                      )}
                                    >
                                      {tab}
                                    </button>
                                  )
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCopy}
                              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-white"
                            >
                              <Copy className="w-3 h-3 mr-2" />
                              Extract
                            </Button>
                          </div>

                          <div className="p-8 min-h-[400px] overflow-auto custom-scrollbar">
                            {activeTab === 'markdown' ? (
                              <div className="prose prose-invert max-w-none font-display font-light text-xl leading-relaxed text-muted-foreground/90">
                                <ReactMarkdown>{formats.markdown || ''}</ReactMarkdown>
                              </div>
                            ) : (
                              <pre className="text-sm font-mono text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {activeTab === 'json'
                                  ? JSON.stringify(formats.json, null, 2)
                                  : formats.raw}
                              </pre>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Deployment Actions */}
                      <div className="flex flex-wrap gap-4 justify-center">
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleCopy();
                            window.open('https://chat.openai.com/', '_blank');
                          }}
                          className="rounded-full border-foreground/10 bg-white/[0.02] px-8 py-6 font-mono text-[10px] uppercase tracking-widest hover:bg-white/[0.05] transition-all"
                        >
                          <SiOpenai className="mr-3 w-4 h-4" fill="#fff" />
                          Deploy to ChatGPT
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleCopy();
                            window.open('https://gemini.google.com/', '_blank');
                          }}
                          className="rounded-full border-foreground/10 bg-white/[0.02] px-8 py-6 font-mono text-[10px] uppercase tracking-widest hover:bg-white/[0.05] transition-all"
                        >
                          <RiGeminiFill className="mr-3 w-4 h-4" fill="#fff" />
                          Deploy to Gemini
                        </Button>
                      </div>

                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setPhase('input');
                            setPrompt('');
                            setResponse('');
                            setQuestions([]);
                            setAnswers([]);
                            setShowFeedback(false);
                            setFeedbackState(null);
                          }}
                          className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground hover:text-white"
                        >
                          Initialize New Session
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Sidebar: Metadata & Feedback */}
                <div className="lg:col-span-4 space-y-12">
                  <div className="p-8 rounded-2xl bg-white/[0.02] border border-foreground/5 space-y-6">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                        System Metrics
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-foreground/5">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">
                          Stability
                        </span>
                        <span className="text-[10px] font-mono text-green-400">OPTIMAL</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-foreground/5">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">
                          Phase
                        </span>
                        <span className="text-[10px] font-mono text-white uppercase">{phase}</span>
                      </div>
                    </div>
                  </div>

                  {phase === 'result' && showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-8 rounded-2xl bg-white/[0.02] border border-foreground/5 space-y-6"
                    >
                      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground text-center">
                        Did you like it ?
                      </p>
                      <div className="flex justify-center gap-12">
                        <button
                          onClick={handlePositiveFeedback}
                          className={cn(
                            'transition-all hover:scale-110',
                            feedbackState === 'like'
                              ? 'text-white'
                              : 'text-muted-foreground hover:text-white'
                          )}
                        >
                          <ThumbsUpIcon
                            size={24}
                            fill={feedbackState === 'like' ? 'currentColor' : 'none'}
                          />
                        </button>
                        <button
                          onClick={handleNegativeFeedback}
                          className={cn(
                            'transition-all hover:scale-110',
                            feedbackState === 'dislike'
                              ? 'text-white'
                              : 'text-muted-foreground hover:text-white'
                          )}
                        >
                          <ThumbsDownIcon
                            size={24}
                            fill={feedbackState === 'dislike' ? 'currentColor' : 'none'}
                          />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
