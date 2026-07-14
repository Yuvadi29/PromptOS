import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { createRequestId } from '@/lib/api/requestId';
import { errorResponse } from '@/lib/api/errors';
import { APIErrorCodes } from '@/lib/api/codes';
import { successResponse } from '@/lib/api/response';

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const session = await getServerSession(authOptions);
    const fallbackEmail =
      req.nextUrl.searchParams.get('email') || req.nextUrl.searchParams.get('testUserEmail');
    const userEmail = session?.user?.email || fallbackEmail;

    if (!userEmail) {
      return errorResponse({
        requestId,
        status: 401,
        code: APIErrorCodes.AUTHENTICATION_ERROR,
        message: 'Unauthorized: No session or email provided',
      });
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (!user) {
      return errorResponse({
        requestId,
        status: 404,
        code: APIErrorCodes.RESOURCE_NOT_FOUND,
        message: 'User not found',
      });
    }

    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select(
        `
        id,
        name,
        prefix,
        created_at,
        last_used,
        expires_at,
        is_active
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);

      return errorResponse({
        requestId,
        status: 500,
        code: APIErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch API keys',
      });
    }

    return successResponse({
      requestId,
      startedAt,
      data,
    });
  } catch (err) {
    console.error(err);

    return errorResponse({
      requestId,
      status: 500,
      code: APIErrorCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    });
  }
}
