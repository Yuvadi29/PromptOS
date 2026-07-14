import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { scorePrompt } from '@/lib/services/prompt.service';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const body = await req.json();
    const { prompt, testUserEmail } = body;

    let userId: string | undefined = undefined;
    if (testUserEmail) {
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', testUserEmail)
        .single();
      if (userData) userId = userData.id;
    }

    if (!prompt) {
      return errorResponse({
        requestId,
        status: 400,
        code: 'BAD_REQUEST',
        message: 'Prompt is required',
      });
    }

    const data = await scorePrompt(prompt, userId);
    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 score-prompt error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to score prompt',
    });
  }
}
