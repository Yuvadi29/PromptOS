import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { compareLLMStream } from '@/lib/services/compare-llm.service';

export async function POST(req: NextRequest) {
  const requestId = createRequestId();

  try {
    const { prompt, model, isFirstModel } = await req.json();

    if (!prompt || typeof prompt !== 'string' || !model || typeof model !== 'string') {
      return errorResponse({
        requestId,
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Invalid prompt or model selection',
      });
    }

    // A real v1 API might want to extract the user or validate an API Key here.
    // We pass userId: null for now.
    const stream = await compareLLMStream({ prompt, model, isFirstModel, userId: null });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('v1 Compare LLM API error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to compare LLM',
    });
  }
}
