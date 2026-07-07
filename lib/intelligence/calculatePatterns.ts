export interface Suggestion {
  observation: string;
  advice: string;
}

export function generateUserSuggestions(prompts: any[], intelligenceData: any[]): Suggestion[] {
  const suggestions: Suggestion[] = [];

  if (!intelligenceData || intelligenceData.length === 0) {
    return [
      {
        observation: "You haven't written any prompts yet.",
        advice: 'Start by creating your first prompt in the library to get personalized insights.',
      },
    ];
  }

  // Calculate averages and top types
  const typeCounts: Record<string, number> = {};
  let totalComplexity = 0;
  let totalClarity = 0;
  let totalLength = 0;

  intelligenceData.forEach((intel) => {
    // Type frequency
    if (intel.prompt_type) {
      typeCounts[intel.prompt_type] = (typeCounts[intel.prompt_type] || 0) + 1;
    }

    // Sums for averages
    totalComplexity += intel.complexity_score || 0;
    totalClarity += intel.clarity_score || 0;
  });

  prompts.forEach((prompt) => {
    totalLength += prompt.prompt_value?.length || 0;
  });

  const avgComplexity = totalComplexity / intelligenceData.length;
  const avgClarity = totalClarity / intelligenceData.length;
  const avgLength = totalLength / (prompts.length || 1);

  // Pattern 1: Find the most common prompt type
  const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
  if (topType && topType[1] >= Math.max(2, intelligenceData.length * 0.3)) {
    const typeName = topType[0].toLowerCase();
    let advice = 'Try specifying the output format or adding examples to improve results.';
    if (typeName.includes('code') || typeName.includes('programming')) {
      advice = 'Try specifying Markdown output with clear language constraints.';
    } else if (typeName.includes('creative') || typeName.includes('writing')) {
      advice = 'Try setting a specific tone of voice and defining the target audience.';
    }

    suggestions.push({
      observation: `You mostly write ${typeName} prompts.`,
      advice,
    });
  }

  // Pattern 2: Prompt length / Complexity
  if (avgLength > 300 || avgComplexity > 7) {
    suggestions.push({
      observation: 'Your prompts are quite detailed and long.',
      advice:
        'Consider adding examples (few-shot prompting) to reduce hallucination and improve structure.',
    });
  } else if (avgLength < 50) {
    suggestions.push({
      observation: 'Your prompts are very brief.',
      advice: "Adding more context and constraints can significantly improve the AI's response.",
    });
  }

  // Pattern 3: Clarity
  if (avgClarity < 6) {
    suggestions.push({
      observation: 'Your prompts might be slightly ambiguous.',
      advice:
        "Try using clear section headers (like 'Context', 'Task', 'Format') to structure your instructions better.",
    });
  } else if (suggestions.length < 2 && avgClarity > 8) {
    suggestions.push({
      observation: 'Your prompts are highly clear and structured.',
      advice:
        'Keep up the great work! You could experiment with chain-of-thought prompting for more complex tasks.',
    });
  }

  // Ensure we return at most 2 suggestions (to fit the UI nicely)
  return suggestions.slice(0, 2);
}
