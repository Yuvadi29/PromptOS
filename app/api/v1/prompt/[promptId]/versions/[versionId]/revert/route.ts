import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { revertPromptVersion } from '@/lib/services/prompt.service';

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ promptId: string; versionId: string }> }
) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const params = await props.params;
    const data = await revertPromptVersion(params.promptId, params.versionId);
    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 revert prompt version error:', error);
    return errorResponse({
      requestId,
      status: error.message.includes('not found') ? 404 : 500,
      code: error.message.includes('not found') ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to revert prompt version',
    });
  }
}
