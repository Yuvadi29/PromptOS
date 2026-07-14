import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { votePrompt } from '@/lib/services/prompt.service';

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const { promptId, type } = await req.json();

    const data = await votePrompt(promptId, type);
    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 vote-prompt error:', error);
    return errorResponse({
      requestId,
      status: error.message === 'Invalid data' ? 400 : 500,
      code: error.message === 'Invalid data' ? 'VALIDATION_ERROR' : 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to vote on prompt',
    });
  }
}
