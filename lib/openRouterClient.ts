export async function callOpenRouterLLM({
    prompt,
    model = "deepseek/deepseek-r1-0528:free",
    temperature = 0.7,
    stream = false,
}: {
    prompt: string;
    model?: string;
    temperature?: number;
    stream?: boolean;
}) {
    const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
                "HTTP-Referer": "https://promptos.in", // Your public site
                "X-Title": "PromptOS LLM Comparison",
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                stream
            })
        },
    );
    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error('Response body is not readable');
    }
    const decoder = new TextDecoder();
    let buffer = '';
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            // Append new chunk to buffer
            buffer += decoder.decode(value, { stream: true });
            // Process complete lines from buffer
            while (true) {
                const lineEnd = buffer.indexOf('\n');
                if (lineEnd === -1) break;
                const line = buffer.slice(0, lineEnd).trim();
                buffer = buffer.slice(lineEnd + 1);
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') break;
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0].delta.content;
                        if (content) {
                            console.log(content);
                        }
                    } catch (e) {
                        // Ignore invalid JSON
                    }
                }
            }
        }
    } finally {
        reader.cancel();
    }

}
