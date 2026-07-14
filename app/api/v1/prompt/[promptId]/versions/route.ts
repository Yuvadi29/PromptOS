import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { getPromptVersions, createPromptVersion } from '@/lib/services/prompt.service';

export async function GET(req: NextRequest, props: { params: Promise<{ promptId: string }> }) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const params = await props.params;
    const data = await getPromptVersions(params.promptId);
    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 prompt versions GET error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to fetch prompt versions',
    });
  }
}

export async function POST(req: NextRequest, props: { params: Promise<{ promptId: string }> }) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const params = await props.params;
    const body = await req.json();
    const data = await createPromptVersion(params.promptId, body);
    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 prompt versions POST error:', error);
    return errorResponse({
      requestId,
      status: error.message === 'Content is required' ? 400 : 500,
      code: error.message === 'Content is required' ? 'VALIDATION_ERROR' : 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to create prompt version',
    });
  }
}
