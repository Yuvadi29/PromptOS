import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { submitAnonymousFeedback } from '@/lib/services/anonymous-feedback.service';

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const { response } = await req.json();

    if (!response || typeof response !== 'string') {
      return errorResponse({
        requestId,
        status: 400,
        code: 'BAD_REQUEST',
        message: 'Invalid response string',
      });
    }

    const result = await submitAnonymousFeedback({ response, feedback: false });

    return successResponse({
      data: result,
      requestId,
      startedAt,
    });
  } catch (error: any) {
    console.error('v1 Negative Feedback API error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to submit feedback',
    });
  }
}
