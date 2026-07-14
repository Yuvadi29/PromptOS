import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { embedPrompt } from '@/lib/services/prompt.service';

export async function POST(req: NextRequest, props: { params: Promise<{ promptId: string }> }) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const params = await props.params;
    const data = await embedPrompt(params.promptId);
    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 embed-prompt error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to embed prompt',
    });
  }
}
