import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createRequestId } from '../api/requestId';
import { errorResponse } from '../api/errors';
import { APIErrorCodes } from '../api/codes';
import { hashAPIKey } from '../auth/hash';

export interface AuthenticatedApiUser {
  userId: string;
  apiKeyId: string;
}

export async function authenticateApiKey(req: NextRequest): Promise<
  | {
      success: true;
      data: AuthenticatedApiUser;
    }
  | {
      success: false;
      response: Response;
    }
> {
  const requestId = createRequestId();

  const authHeader = req.headers.get('authorization');

  if (!authHeader) {
    return {
      success: false,
      response: errorResponse({
        requestId,
        status: 401,
        code: APIErrorCodes.AUTHENTICATION_ERROR,
        message: 'Missing Authorization header',
      }),
    };
  }

  if (!authHeader.startsWith('Bearer ')) {
    return {
      success: false,
      response: errorResponse({
        requestId,
        status: 401,
        code: APIErrorCodes.AUTHENTICATION_ERROR,
        message: 'Invalid Authorization header',
      }),
    };
  }

  const apiKey = authHeader.replace('Bearer ', '').trim();

  const hashed = await hashAPIKey(apiKey);

  const { data, error } = await supabaseAdmin
    .from('api_keys')
    .select(
      `
        id,
        user_id,
        is_active,
        expires_at
      `
    )
    .eq('key_hash', hashed)
    .single();

  if (error || !data) {
    return {
      success: false,
      response: errorResponse({
        requestId,
        status: 401,
        code: APIErrorCodes.INVALID_API_KEY,
        message: 'Invalid API Key',
      }),
    };
  }

  if (!data.is_active) {
    return {
      success: false,
      response: errorResponse({
        requestId,
        status: 401,
        code: APIErrorCodes.API_KEY_REVOKED,
        message: 'API Key has been revoked',
      }),
    };
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return {
      success: false,
      response: errorResponse({
        requestId,
        status: 401,
        code: APIErrorCodes.API_KEY_EXPIRED,
        message: 'API Key expired',
      }),
    };
  }

  await supabaseAdmin
    .from('api_keys')
    .update({
      last_used: new Date().toISOString(),
    })
    .eq('id', data.id);

  return {
    success: true,
    data: {
      userId: data.user_id,
      apiKeyId: data.id,
    },
  };
}
