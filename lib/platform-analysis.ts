export interface PlatformMetric {
  id: string;
  name: string;
  inputCost: number; // cost per 1M tokens
  outputCost: number;
  savings: string;
  optimizedCost: string;
}

export async function getPlatformAnalysis(
  rawPrompt: string,
  optimizedPrompt: string
): Promise<PlatformMetric[]> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models');
    const { data: models } = await response.json();

    // Key models to compare
    const targetModels = [
      'openai/gpt-4o',
      'anthropic/claude-3.5-sonnet',
      'google/gemini-pro-1.5',
      'meta-llama/llama-3-70b-instruct',
    ];

    const rawTokens = rawPrompt.length / 4; // Rough estimate
    const optimizedTokens = optimizedPrompt.length / 4;

    return targetModels
      .map((modelId) => {
        const model = models.find((m: any) => m.id === modelId);
        if (!model) return null;

        const inputPrice = parseFloat(model.pricing.prompt) * 1000000;
        const outputPrice = parseFloat(model.pricing.completion) * 1000000;

        const rawCost = (rawTokens / 1000000) * inputPrice;
        const optimizedCost = (optimizedTokens / 1000000) * inputPrice;
        const savings = rawCost - optimizedCost;

        return {
          id: model.id,
          name: model.name || model.id.split('/')[1],
          inputCost: inputPrice,
          outputCost: outputPrice,
          savings: `$${savings.toFixed(4)}`,
          optimizedCost: `$${optimizedCost.toFixed(4)}`,
        };
      })
      .filter(Boolean) as PlatformMetric[];
  } catch (error) {
    console.error('Error fetching platform analysis:', error);
    return [];
  }
}
