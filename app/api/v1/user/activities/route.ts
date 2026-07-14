import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { getUserActivities } from '@/lib/services/user.service';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const testUserEmail = req.nextUrl.searchParams.get('testUserEmail');

    let userId: string | null = null;
    if (testUserEmail) {
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', testUserEmail)
        .single();
      if (userData) userId = userData.id;
    }

    if (!userId) {
      return errorResponse({
        requestId,
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'Unauthorized: Valid testUserEmail is required for testing',
      });
    }

    const data = await getUserActivities(userId);
    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 user activities error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to fetch user activities',
    });
  }
}
