import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { classifyPrompt } from '@/lib/services/prompt.service';

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const { input } = await req.json();
    if (!input) {
      return errorResponse({
        requestId,
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Missing Input',
      });
    }

    const data = await classifyPrompt(input);
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
