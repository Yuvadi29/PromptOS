export function calculateComplexity(prompt: string) {
  let score = 0;

  //----------------------------------

  const words = prompt.split(/\s+/).length;

  score += Math.min(35, words / 6);

  //----------------------------------

  const checks = [
    'example',

    'json',

    'markdown',

    'step',

    'constraints',

    'output',

    'format',

    'role',

    'context',

    'tone',
  ];

  checks.forEach((keyword) => {
    if (prompt.toLowerCase().includes(keyword)) {
      score += 6;
    }
  });

  //----------------------------------

  return Math.min(Math.round(score), 100);
}
