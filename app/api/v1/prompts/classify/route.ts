import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { classifyPrompt } from '@/lib/services/prompt.service';
import { captureTelemetry } from '@/lib/platform/telemetry';

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const userId = req.headers.get('x-api-user-id');
  const apiKeyId = req.headers.get('x-api-key-id');

  if (!userId || !apiKeyId) {
    return errorResponse({
      requestId: createRequestId(),
      status: 401,
      code: 'AUTHENTICATION_ERROR',
      message: 'Missing authentication headers from middleware',
    });
  }

  const requestId = req.headers.get('x-request-id') || createRequestId();

  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return errorResponse({
        requestId,
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Missing Input',
      });
    }

    const data = await classifyPrompt(prompt);
    await captureTelemetry({
      requestId,

      apiKeyId,

      userId,

      endpoint: '/v1/prompts/classify',

      method: 'POST',

      status: 200,

      latency: Date.now() - startedAt,

      ip: req.headers.get('x-forwarded-for') ?? '',

      userAgent: req.headers.get('user-agent') ?? '',
    });
    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 classify-prompt error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to classify prompt',
    });
  }
}
