export interface CompareLLMInput {
  prompt: string;
  model: string;
  isFirstModel?: boolean;
  userId?: string | null;
}

export async function compareLLMStream({
  prompt,
  model,
  isFirstModel,
  userId,
}: CompareLLMInput): Promise<ReadableStream> {
  // Logging (Only log once per parallel batch if user is provided)
  if (isFirstModel && userId) {
    try {
      const { logActivityAndCalculateStreak } = await import('@/lib/streaks');
      // Fire and forget
      logActivityAndCalculateStreak(userId, 'llm_compared', { prompt }).catch(console.error);
    } catch (e) {
      console.error('Logging error', e);
    }
  }

  const fineTunedPrompt = `You are an advanced AI assistant with a vast knowledge base, capable of providing precise, relevant, and insightful responses. Based on the following user input, generate a well-structured, clear, and accurate response.

User Input:
"${prompt}"

Instructions:
- Understand the context and intent.
- Provide a direct, clear, and correct answer.
- Add concise context where useful.
- Remain professional and easy to follow.
`;

  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://promptos.in',
          'X-Title': 'PromptOS',
        },
        body: JSON.stringify({
          model: model,
          stream: true,
          messages: [
            { role: 'system', content: fineTunedPrompt },
            { role: 'user', content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`OpenRouter Error for model ${model}:`, response.status, errText);
        controller.enqueue(
          encoder.encode(
            `[Error ${response.status}: Failed to get response from ${model}]\n${errText}\n\n`
          )
        );
        controller.close();
        return;
      }

      if (!response.body) {
        controller.enqueue(encoder.encode(`[Error getting response from ${model}]\n\n`));
        controller.close();
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim();

              if (jsonStr === '[DONE]') continue;

              try {
                const parsed = JSON.parse(jsonStr);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch (err) {
                // Silent catch for partial chunks, very common in SSE
                console.error(err);
              }
            }
          }
        }
      }

      controller.close();
    },
  });
}
