export function calculateClarity(prompt: string) {
  let score = 5;

  if (prompt.length > 100) score++;

  if (prompt.includes('Output')) score++;

  if (prompt.includes('Requirements')) score++;

  if (prompt.includes('Constraints')) score++;

  return Math.min(score, 10);
}

export function calculateSpecificity(prompt: string) {
  let score = 4;

  if (prompt.includes('JSON')) score += 2;

  if (prompt.includes('Markdown')) score += 2;

  if (prompt.includes('Example')) score += 2;

  return Math.min(score, 10);
}

export function calculateStructure(prompt: string) {
  const headings = (prompt.match(/\n/g) || []).length;

  return Math.min(10, 4 + headings);
}

export function detectOutputFormat(prompt: string) {
  const p = prompt.toLowerCase();

  if (p.includes('json')) return 'json';

  if (p.includes('markdown')) return 'markdown';

  if (p.includes('table')) return 'table';

  return 'text';
}

export function extractTags(prompt: string) {
  const tags = [];

  const p = prompt.toLowerCase();

  if (p.includes('react')) tags.push('react');

  if (p.includes('next')) tags.push('nextjs');

  if (p.includes('marketing')) tags.push('marketing');

  if (p.includes('youtube')) tags.push('youtube');

  if (p.includes('blog')) tags.push('blog');

  return tags;
}
