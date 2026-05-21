import OpenAI from 'openai';

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
});

export const generatePrompt = async (input: string) => {
  const completion = await openrouter.chat.completions.create({
    model: 'google/gemma-4-31b-it:free',
    messages: [{ role: 'user', content: input }],
  });

  return completion.choices[0]?.message?.content ?? '';
};
