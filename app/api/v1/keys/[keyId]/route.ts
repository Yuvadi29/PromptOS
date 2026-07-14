import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createRequestId } from '@/lib/api/requestId';
import { errorResponse } from '@/lib/api/errors';
import { APIErrorCodes } from '@/lib/api/codes';
import { successResponse } from '@/lib/api/response';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ keyId: string }> }) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const { keyId } = await params;

    const user = await getCurrentUser(req);

    if (!user) {
      return errorResponse({
        requestId,
        status: 401,
        code: APIErrorCodes.AUTHENTICATION_ERROR,
        message: 'Unauthorized',
      });
    }

    const { error } = await supabaseAdmin
      .from('api_keys')
      .update({
        is_active: false,
      })
      .eq('id', keyId)
      .eq('user_id', user.id);

    if (error) {
      return errorResponse({
        requestId,
        status: 500,
        code: APIErrorCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }

    return successResponse({
      requestId,
      startedAt,
      data: {
        revoked: true,
      },
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
