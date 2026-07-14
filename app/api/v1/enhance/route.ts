import { NextRequest } from 'next/server';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { errorResponse } from '@/lib/api/errors';
import { enhancePrompt } from '@/lib/services/enhance.service';
import { authenticateApiKey } from '@/lib/platform/authenticateApiKey';
import { captureTelemetry } from '@/lib/platform/telemetry';

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const auth = await authenticateApiKey(req);
  if (!auth.success) {
    return auth.response;
  }
  const { userId, apiKeyId } = auth.data;

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
      code: 'VALIDATION_ERROR',
      message: 'Invalid request body',
    });
  }

  if (!prompt || typeof prompt !== 'string') {
    return errorResponse({
      requestId,
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Missing prompt parameter',
    });
  }

  try {
    const result = await enhancePrompt({ prompt, answers, userId });
    await captureTelemetry({
      requestId,

      apiKeyId,

      userId,

      endpoint: '/v1/enhance',

      method: 'POST',

      status: 200,

      latency: Date.now() - startedAt,

      ip: req.headers.get('x-forwarded-for') ?? '',

      userAgent: req.headers.get('user-agent') ?? '',
    });
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
