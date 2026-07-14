import { APIErrorCodes } from '@/lib/api/codes';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { authOptions } from '@/lib/auth';
import { generateAPIKey } from '@/lib/auth/generate';
import { hashAPIKey } from '@/lib/auth/hash';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const body = await req.json();
    const name = body?.name?.trim();
    const fallbackEmail = body?.email || body?.testUserEmail;

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || fallbackEmail;

    if (!userEmail) {
      return errorResponse({
        requestId,
        status: 401,
        code: APIErrorCodes.AUTHENTICATION_ERROR,
        message: 'Unauthorized: No session or email provided',
      });
    }

    if (!name) {
      return errorResponse({
        requestId,
        status: 400,
        code: APIErrorCodes.VALIDATION_ERROR,
        message: 'Key name is required',
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
        code: APIErrorCodes.AUTHENTICATION_ERROR,
        message: 'User not found',
      });
    }

    const { key, prefix } = generateAPIKey();
    const hashedKey = hashAPIKey(key);

    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .insert({
        user_id: user?.id,
        name,
        prefix,
        key_hash: hashedKey,
      })
      .select()
      .single();

    if (error) {
      console.error(error);

      return errorResponse({
        requestId,
        status: 500,
        code: APIErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Failed to create API key',
      });
    }

    return successResponse({
      requestId,
      startedAt,
      data: {
        id: data.id,
        name: data.name,
        apiKey: key,
        prefix,
        createdAt: data.created_at,
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
