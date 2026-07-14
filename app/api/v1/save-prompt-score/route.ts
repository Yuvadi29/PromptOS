import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { savePromptScore } from '@/lib/services/prompt.service';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const body = await req.json();
    const { testUserEmail, ...scoreData } = body;

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
        message: 'Unauthorized: testUserEmail is required',
      });
    }

    const data = await savePromptScore(userId, scoreData);
    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 save-prompt-score error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to save prompt score',
    });
  }
}
