import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { getPublicActivities } from '@/lib/services/user.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const data = await getPublicActivities();
    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 public activities error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to fetch public activities',
    });
  }
}
