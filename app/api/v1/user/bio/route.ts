import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { getUserBio, updateUserBio } from '@/lib/services/user.service';
import { supabaseAdmin } from '@/lib/supabase';

async function getUserIdFromEmail(email: string) {
  const { data } = await supabaseAdmin.from('users').select('id').eq('email', email).single();
  return data?.id || null;
}

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

    const userId = await getUserIdFromEmail(testUserEmail);
    if (!userId) {
      return errorResponse({
        requestId,
        status: 404,
        code: 'RESOURCE_NOT_FOUND',
        message: 'User not found',
      });
    }

    const data = await getUserBio(userId);
    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 get bio error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
    });
  }
}

export async function PUT(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const { bio, testUserEmail } = await req.json();
    if (!testUserEmail) {
      return errorResponse({
        requestId,
        status: 401,
        code: 'AUTHENTICATION_ERROR',
        message: 'testUserEmail required',
      });
    }

    const userId = await getUserIdFromEmail(testUserEmail);
    if (!userId) {
      return errorResponse({
        requestId,
        status: 404,
        code: 'RESOURCE_NOT_FOUND',
        message: 'User not found',
      });
    }

    const data = await updateUserBio(userId, bio);
    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 update bio error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
    });
  }
}
