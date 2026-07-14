import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { getDashboardStats } from '@/lib/services/dashboard.service';
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

      if (userData) {
        userId = userData.id;
      }
    }

    if (!userId) {
      return errorResponse({
        requestId,
        status: 401,
        code: 'AUTHENTICATION_ERROR',
        message: 'Unauthorized: Valid testUserEmail is required for testing',
      });
    }

    const data = await getDashboardStats(userId);
    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 Dashboard Stats API error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to fetch dashboard stats',
    });
  }
}
