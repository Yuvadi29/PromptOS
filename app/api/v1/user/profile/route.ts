import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { updateUserProfile } from '@/lib/services/user.service';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const body = await req.json();
    const { testUserEmail, ...profileData } = body;

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

    const data = await updateUserProfile(userData.id, profileData);
    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 user profile error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to update user profile',
    });
  }
}
