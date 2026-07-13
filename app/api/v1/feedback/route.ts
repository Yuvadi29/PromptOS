import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/errors';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { submitFeedback } from '@/lib/services/feedback.service';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  try {
    const { response, feedback, testUserEmail } = await req.json();

    if (typeof feedback !== 'boolean' || !response || typeof response !== 'string') {
      return errorResponse({
        requestId,
        status: 400,
        code: 'BAD_REQUEST',
        message: 'Invalid response or feedback type',
      });
    }

    // For testing purposes via Postman before implementing API Keys, we will allow passing `testUserEmail` to simulate the user.
    let userId: string | null = null;
    if (testUserEmail) {
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', testUserEmail)
        .single();

      if (!userError && userData) {
        userId = userData.id;
      }
    }

    if (!userId) {
      return errorResponse({
        requestId,
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'Unauthorized: Valid testUserEmail is required for testing',
      });
    }

    const result = await submitFeedback({ userId, response, feedback });

    return successResponse({
      data: result,
      requestId,
      startedAt,
    });
  } catch (error: any) {
    console.error('v1 Feedback API error:', error);

    if (error.message === 'Feedback already submitted') {
      return errorResponse({
        requestId,
        status: 409,
        code: 'CONFLICT',
        message: error.message,
      });
    }

    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to submit feedback',
    });
  }
}
