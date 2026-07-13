import { NextRequest } from 'next/server';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { errorResponse } from '@/lib/api/errors';
import { enhancePrompt } from '@/lib/services/enhance.service';

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  let prompt = '';
  let answers: any[] = [];

  try {
    const contentType = req.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const body = await req.json();
      prompt = body.prompt || body.input || '';
      answers = body.answers || [];
    } else {
      prompt = await req.text();
    }
  } catch {
    return errorResponse({
      requestId,
      status: 400,
      code: 'BAD_REQUEST',
      message: 'Invalid request body',
    });
  }

  if (!prompt || typeof prompt !== 'string') {
    return errorResponse({
      requestId,
      status: 400,
      code: 'BAD_REQUEST',
      message: 'Missing prompt parameter',
    });
  }

  // In a real v1 SDK API, validate API keys or tokens.
  // const authHeader = req.headers.get('authorization');
  // if (!authHeader || !isValidToken(authHeader)) return errorResponse(...)

  try {
    const result = await enhancePrompt({ prompt, answers, userId: null });
    return successResponse({
      data: result,
      requestId,
      startedAt,
    });
  } catch (error: any) {
    console.error('v1 Enhance API Error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to enhance prompt',
    });
  }
}
