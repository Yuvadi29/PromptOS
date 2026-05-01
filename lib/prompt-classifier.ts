import { callOpenRouterLLM } from './openRouterClient';

export type PromptType =
  | 'code'
  | 'content'
  | 'marketing'
  | 'image'
  | 'video'
  | 'data'
  | 'qa'
  | 'analysis'
  | 'agent'
  | 'chat';

// Rule Based First
export function ruleBasedClassifier(input: string): PromptType | null {
  const text = input.toLowerCase();

  if (text.includes('thumbnail') || text.includes('image') || text.includes('midjourney')) {
    return 'image';
  }

  if (text.includes('video') || text.includes('scene') || text.includes('cinematic')) {
    return 'video';
  }

  if (text.includes('json') || text.includes('api response')) {
    return 'data';
  }

  if (text.includes('code') || text.includes('function') || text.includes('debug')) {
    return 'code';
  }

  if (text.includes('blog') || text.includes('article')) {
    return 'content';
  }

  if (text.includes('marketing') || text.includes('copywriting') || text.includes('ads')) {
    return 'marketing';
  }

  if (text.includes('analyze') || text.includes('breakdown')) {
    return 'analysis';
  }

  if (text.includes('steps') || text.includes('workflow')) {
    return 'agent';
  }

  if (text.includes('?')) {
    return 'qa';
  }

  return null;
}

// LLM Feedback
export async function llmClassifier(input: string): Promise<PromptType> {
  const res = await callOpenRouterLLM({
    prompt:
      `Classify the user input into EXACTLY one of these: code, content, marketing, image, video, data, qa, analysis, agent, chat.Return ONLY the label.` +
      '\n\n' +
      input,
  });

  return res as PromptType;
}

// Final Classifier
export async function classifyPrompt(input: string) {
  const rule = ruleBasedClassifier(input);

  if (rule) {
    return {
      type: rule,
      source: 'rule',
    };
  }

  const llm = await llmClassifier(input);

  return {
    type: llm,
    source: 'llm',
  };
}
