import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { createPrompt, getPrompts } from '@/lib/services/prompt-library.service';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const data = await getPrompts();
    return successResponse({ data, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 Prompt Library GET error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to fetch prompts',
    });
  }
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const { title, description, promptText, niche, testUserEmail } = await req.json();

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
        message: 'Unauthorized: Valid testUserEmail is required for testing',
      });
    }

    const result = await createPrompt({ userId, title, description, promptText, niche });
    return successResponse({ data: result, requestId, startedAt });
  } catch (error: any) {
    console.error('v1 Prompt Library POST error:', error);
    return errorResponse({
      requestId,
      status: error.message === 'Missing Data' ? 400 : 500,
      code: error.message === 'Missing Data' ? 'BAD_REQUEST' : 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to create prompt',
    });
  }
}
