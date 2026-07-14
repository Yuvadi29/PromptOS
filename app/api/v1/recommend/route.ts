import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { recommendPrompts } from '@/lib/services/prompt.service';

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const body = await req.json();
    const data = await recommendPrompts(body);
    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 recommend error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to get recommendations',
    });
  }
}
