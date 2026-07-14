import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { getSystemStatus } from '@/lib/services/system.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const data = await getSystemStatus(startedAt);
    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 status error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to fetch system status',
    });
  }
}
