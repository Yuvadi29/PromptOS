import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { getBookmarks, toggleBookmark } from '@/lib/services/prompt-library.service';
import { supabaseAdmin } from '@/lib/supabase';

async function getUserIdForTesting(req: NextRequest): Promise<string | null> {
  const testUserEmail = req.nextUrl.searchParams.get('testUserEmail');
  if (!testUserEmail) return null;

  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', testUserEmail)
    .single();

  return userData?.id || null;
}

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const userId = await getUserIdForTesting(req);
    if (!userId) {
      return errorResponse({
        requestId,
        status: 401,
        code: 'AUTHENTICATION_ERROR',
        message: 'Unauthorized: Valid testUserEmail query parameter is required for testing',
      });
    }

    const populated = req.nextUrl.searchParams.get('populated') === 'true';
    const data = await getBookmarks({ userId, populated });

    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 Bookmarks GET error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to fetch bookmarks',
    });
  }
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const { promptId, testUserEmail } = await req.json();

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
        code: 'AUTHENTICATION_ERROR',
        message: 'Unauthorized: Valid testUserEmail is required for testing',
      });
    }

    const result = await toggleBookmark({ userId, promptId });
    return successResponse({ data: result, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 Bookmarks POST error:', error);
    return errorResponse({
      requestId,
      status: error.message === 'Missing promptId' ? 400 : 500,
      code: error.message === 'Missing promptId' ? 'VALIDATION_ERROR' : 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to toggle bookmark',
    });
  }
}
