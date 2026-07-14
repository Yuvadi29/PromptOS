import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { getUserProfileStats } from '@/lib/services/user.service';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const testUserEmail = req.nextUrl.searchParams.get('testUserEmail');

    if (!testUserEmail) {
      return errorResponse({
        requestId,
        status: 401,
        code: 'AUTHENTICATION_ERROR',
        message: 'testUserEmail required',
      });
    }

    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', testUserEmail)
      .single();

    if (!userData?.id) {
      return errorResponse({
        requestId,
        status: 404,
        code: 'RESOURCE_NOT_FOUND',
        message: 'User not found',
      });
    }

    const data = await getUserProfileStats(userData.id);
    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 user profile-stats error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to fetch user profile stats',
    });
  }
}
