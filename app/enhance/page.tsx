'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Sparkles,
  Zap,
  MessageCircleQuestion,
  Terminal,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { SiOpenai } from 'react-icons/si';
import { RiGeminiFill } from 'react-icons/ri';
import { VersionDiff } from '@/components/ui/VersionDiff';

type Phase = 'input' | 'loading-questions' | 'questions' | 'enhancing' | 'result';

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
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackState, setFeedbackState] = useState<null | 'like' | 'dislike'>(null);
  const [formats, setFormats] = useState<{
    raw?: string;
    markdown?: string;
    json?: any;
  }>({});
  const [activeTab, setActiveTab] = useState<'raw' | 'markdown' | 'json' | 'diff'>('raw');
  const [promptType, setPromptType] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [answers, setAnswers] = useState<any[]>([]);

  useEffect(() => {
    if (phase !== 'enhancing') return;
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [phase]);

  const handleGenerateQuestions = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
      toast.error('Please enter a prompt first');
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
          toast.error('We are having huge traffic currently, please try again after sometime');
        } else {
          toast.error(data.error || 'Enhance failed');
        }
        return;
      }
      setPhase('result');
      setFormats(data.formats);
      setPromptType(data.type);
      setResponse(data.formats.raw || '');
      setFeedbackState(null);

      if (data.type === 'image' || data.type === 'video' || data.type === 'data') {
        setActiveTab('json');
      } else if (data.type === 'content' || data.type === 'marketing') {
        setActiveTab('markdown');
      } else {
        setActiveTab('raw');
      }

      if (data.saved) {
        toast.success('Prompt Saved!!');
      }
    } catch (err) {
      console.error('Enhance error:', err);
      setPhase('input');
      toast.error('Something went wrong');
    }
  };

  const handleSubmitAnswers = () => handleEnhancePrompt();
  const handleSkipQuestions = () => handleEnhancePrompt();

  useEffect(() => {
    if (response) {
      const feedbackTimer = setTimeout(() => setShowFeedback(true), 3000);
      return () => clearTimeout(feedbackTimer);
    } else {
      setShowFeedback(false);
    }
  }, [response]);

  const handleCopy = () => {
    let text = '';
    if (activeTab === 'json') text = JSON.stringify(formats.json, null, 2);
    else text = formats[activeTab as 'raw' | 'markdown'] || '';

    if (text) {
      navigator.clipboard.writeText(text);
      toast.success('Copied to Clipboard!!');
    }
  };

  const handleFeedback = async (isPositive: boolean) => {
    try {
      setFeedbackState(isPositive ? 'like' : 'dislike');
      const storeFeedback = await fetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ response, feedback: isPositive }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (storeFeedback.ok) toast.success('Thank you for your feedback!');
      else toast.error('Feedback can only be given once per prompt.');
    } catch (error) {
      console.error('Error Storing Feedback: ', error);
      toast.error('Something went wrong.');
    }
  };

  const allAnswered = answers.length > 0 && answers.every((a) => a && a.trim().length > 0);

  // Dynamic Explanation based on Type
  const getTypeExplanation = (type: string | null) => {
    switch (type) {
      case 'image':
        return 'We formatted this response optimally for Image Generation models (like Midjourney or DALL-E) to ensure vivid details and styles are prioritized.';
      case 'video':
        return 'We formatted this response optimally for Video Generation models (like Sora or Runway) emphasizing scene descriptions, camera movements, and lighting.';
      case 'data':
      case 'agent':
        return 'We formatted this response as a strict JSON structure to ensure parsability by your backend agents or APIs.';
      case 'content':
      case 'marketing':
        return 'We structured this response in Markdown format, tailored perfectly for drafting blogs, ads, or rich text content with headings and bullet points.';
      default:
        return 'This response was enhanced for clarity, specificity, and constraint management to ensure the best possible output from standard LLMs.';
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background pt-24 px-4 sm:px-6 pb-6 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="w-full max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-8rem)] relative z-10">
        {/* Pipeline Progress Indicator */}
        <div className="flex items-center justify-between mb-8 px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[20px] shadow-lg">
          <div className="flex items-center gap-4 w-full relative">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border -translate-y-1/2 z-0" />

            <div className="flex-1 flex justify-center z-10">
              <div
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-500 ${phase === 'input' ? 'bg-primary/20 text-primary border border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]' : 'bg-card text-foreground border border-border'}`}
              >
                1. Input Prompt
              </div>
            </div>

            <div className="flex-1 flex justify-center z-10">
              <div
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-500 ${['loading-questions', 'questions'].includes(phase) ? 'bg-primary/20 text-primary border border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]' : 'bg-card text-muted-foreground border border-border'}`}
              >
                2. Clarification
              </div>
            </div>

            <div className="flex-1 flex justify-center z-10">
              <div
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-500 ${['enhancing', 'result'].includes(phase) ? 'bg-primary/20 text-primary border border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]' : 'bg-card text-muted-foreground border border-border'}`}
              >
                3. Enhanced Output
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[600px]">
          {/* INPUT & QUESTIONS (Left Column) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* INPUT PANEL */}
            <div
              className={`flex flex-col min-h-[250px] rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-lg transition-all duration-500 ${phase === 'input' ? 'ring-1 ring-primary/50' : ''}`}
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Raw Prompt Input
                </span>
                {phase !== 'input' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPhase('input');
                      setQuestions([]);
                      setFormats({});
                      setResponse('');
                      setFeedbackState(null);
                    }}
                    className="h-7 text-xs px-3"
                  >
                    Edit
                  </Button>
                )}
              </div>
              <div className="flex-1 p-5 relative">
                <textarea
                  className="w-full h-full bg-transparent resize-none outline-none text-foreground leading-relaxed placeholder:text-muted-foreground/40 font-mono text-sm"
                  placeholder="What do you want the AI to do? E.g., 'write an email to client about delay'..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={phase !== 'input'}
                />
              </div>
              {phase === 'input' && (
                <div className="p-4 border-t border-white/10 bg-black/20">
                  <Button
                    onClick={(e) => handleGenerateQuestions(e as any)}
                    disabled={!prompt.trim()}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 rounded-xl cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 mr-2 " /> Enhance Prompt
                  </Button>
                </div>
              )}
            </div>

            {/* CLARIFICATION PANEL */}
            <div
              className={`flex flex-col flex-1 min-h-[300px] rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-lg transition-all duration-500 ${['loading-questions', 'questions'].includes(phase) ? 'ring-1 ring-primary/50' : 'opacity-60'}`}
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <MessageCircleQuestion className="w-4 h-4" /> Context Clarification
                </span>
              </div>
              <div className="flex-1 p-5 overflow-y-auto">
                {phase === 'input' && (
                  <div className="h-full flex items-center justify-center text-muted-foreground/40 text-xs font-mono text-center">
                    Awaiting prompt...
                  </div>
                )}
                {phase === 'loading-questions' && (
                  <div className="h-full flex flex-col items-center justify-center gap-3 text-primary">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="font-mono text-xs animate-pulse">
                      Analyzing intent for questions...
                    </span>
                  </div>
                )}
                {phase === 'questions' && (
                  <div className="space-y-5">
                    {questions.map((q, i) => (
                      <div key={i} className="space-y-2">
                        <label className="text-xs font-medium text-foreground/80 block">{q}</label>
                        <textarea
                          className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none resize-none font-mono"
                          rows={2}
                          placeholder="Type your answer..."
                          value={answers[i]}
                          onChange={(e) => {
                            const newAnswers = [...answers];
                            newAnswers[i] = e.target.value;
                            setAnswers(newAnswers);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {['enhancing', 'result'].includes(phase) && questions.length > 0 && (
                  <div className="space-y-4 opacity-70 pointer-events-none">
                    {questions.map((q, i) => (
                      <div key={i} className="p-3 bg-black/20 rounded-xl border border-white/5">
                        <p className="text-[11px] text-muted-foreground mb-1">{q}</p>
                        <p className="text-sm text-foreground font-mono">
                          {answers[i] || 'Skipped'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {phase === 'questions' && (
                <div className="p-4 border-t border-white/10 bg-black/20 flex gap-2">
                  <Button
                    onClick={handleSubmitAnswers}
                    disabled={!allAnswered}
                    className="flex-1 bg-primary hover:bg-primary/90 rounded-xl font-semibold"
                  >
                    Generate
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSkipQuestions}
                    className="flex-1 rounded-xl"
                  >
                    Skip
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* OUTPUT PANEL (Right Column) */}
          <div
            className={`lg:col-span-7 flex flex-col rounded-[24px] border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-500 ${['enhancing', 'result'].includes(phase) ? 'ring-1 ring-primary/50' : 'opacity-60'}`}
          >
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <Zap className="w-4 h-4" /> Enhanced Output
              </span>
              {phase === 'enhancing' && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Generating
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                </div>
              )}
              {phase === 'result' && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Complete
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 p-5 overflow-y-auto relative flex flex-col">
              {['input', 'loading-questions', 'questions'].includes(phase) && (
                <div className="h-full flex items-center justify-center text-muted-foreground/30 text-sm font-mono text-center">
                  Enhanced output will appear here...
                </div>
              )}

              {phase === 'enhancing' && (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-primary">
                  <div className="w-12 h-12 rounded-full border-t-2 border-primary animate-spin" />
                  <span className="font-mono text-sm animate-pulse">
                    {STATUS_MESSAGES[statusIndex].text}
                  </span>
                </div>
              )}

              {phase === 'result' && (
                <div className="flex-1 flex flex-col h-full space-y-4">
                  {/* Format explanation banner */}
                  {promptType && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg border border-primary/20 bg-primary/10 flex items-start gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-primary font-medium">
                          {getTypeExplanation(promptType)}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Tabs */}
                  <div className="flex flex-wrap gap-2">
                    {formats.raw && (
                      <button
                        onClick={() => setActiveTab('raw')}
                        className={`text-[11px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-full transition-colors ${activeTab === 'raw' ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/5'}`}
                      >
                        Raw
                      </button>
                    )}
                    {formats.markdown && (
                      <button
                        onClick={() => setActiveTab('markdown')}
                        className={`text-[11px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-full transition-colors ${activeTab === 'markdown' ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/5'}`}
                      >
                        Markdown
                      </button>
                    )}
                    {formats.json && (
                      <button
                        onClick={() => setActiveTab('json')}
                        className={`text-[11px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-full transition-colors ${activeTab === 'json' ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/5'}`}
                      >
                        JSON
                      </button>
                    )}
                    <button
                      onClick={() => setActiveTab('diff')}
                      className={`text-[11px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-full transition-colors ${activeTab === 'diff' ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/5'}`}
                    >
                      Diff
                    </button>
                  </div>

                  {/* Editor View */}
                  {activeTab === 'diff' ? (
                    <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl shadow-inner overflow-hidden min-h-[300px]">
                      <VersionDiff oldText={prompt} newText={formats.raw || response || ''} />
                    </div>
                  ) : (
                    <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-5 font-mono text-sm text-foreground overflow-auto whitespace-pre-wrap shadow-inner relative group min-h-[300px]">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={handleCopy}
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10"
                      >
                        <Copy className="w-4 h-4 text-white" />
                      </Button>

                      {activeTab === 'json'
                        ? JSON.stringify(formats.json, null, 2)
                        : formats[activeTab as 'raw' | 'markdown']}
                    </div>
                  )}

                  {/* Feedback Box */}
                  <AnimatePresence>
                    {showFeedback && phase === 'result' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between shadow-lg"
                      >
                        <span className="text-sm font-medium text-muted-foreground">
                          Was this enhanced prompt helpful?
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleFeedback(true)}
                            className={`rounded-lg hover:bg-green-500/20 hover:text-green-400 ${feedbackState === 'like' ? 'text-green-500 bg-green-500/20' : 'text-muted-foreground'}`}
                          >
                            <ThumbsUpIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleFeedback(false)}
                            className={`rounded-lg hover:bg-red-500/20 hover:text-red-400 ${feedbackState === 'dislike' ? 'text-red-500 bg-red-500/20' : 'text-muted-foreground'}`}
                          >
                            <ThumbsDownIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            {phase === 'result' && (
              <div className="p-5 border-t border-white/10 bg-black/20 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => window.open('https://chat.openai.com', '_blank')}
                  className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 rounded-xl font-medium"
                >
                  <SiOpenai className="mr-2" /> Try in ChatGPT
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://gemini.google.com', '_blank')}
                  className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 rounded-xl font-medium text-primary"
                >
                  <RiGeminiFill className="mr-2" /> Try in Gemini
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
