import { PromptType } from './prompt-classifier';

// Raw
export function formatRaw(text: string) {
  return text.trim();
}

// Markdown
export function formatMarkdown(text: string, type: PromptType) {
  if (type === 'content' || type === 'marketing') {
    return text; //Already markdown
  }

  return `### Enhanced Prompt\n\n${text}`;
}

// JSON for image, video and data
export function formatJSON(text: string, type: PromptType) {
  if (!['image', 'video', 'data', 'agent'].includes(type)) {
    return null;
  }

  const lines = text.split('\n').filter(Boolean);

  const obj: Record<string, string> = {};

  for (const line of lines) {
    const [key, ...rest] = line.split(':');
    if (!key || rest.length === 0) continue;

    obj[key.trim().toLowerCase().replace(/\s+/g, '_')] = rest.join(':').trim();
  }

  return obj;
}

// Main Formatter
export function buildFormats(text: string, type: PromptType) {
  return {
    raw: formatRaw(text),
    markdown: formatMarkdown(text, type),
    json: formatJSON(text, type),
  };
}
