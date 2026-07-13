import { NextRequest } from 'next/server';
import { createRequestId } from '@/lib/api/requestId';
import { successResponse } from '@/lib/api/response';
import { errorResponse } from '@/lib/api/errors';
import { generateQuestions } from '@/lib/services/questions.service';

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = createRequestId();

  let promptText = '';
  try {
    const body = await req.json();
    promptText = body.prompt || '';
  } catch {
    return errorResponse({
      requestId,
      status: 400,
      code: 'BAD_REQUEST',
      message: 'Invalid request body',
    });
  }

  if (!promptText || typeof promptText !== 'string') {
    return errorResponse({
      requestId,
      status: 400,
      code: 'BAD_REQUEST',
      message: 'Missing prompt parameter',
    });
  }

  try {
    const questions = await generateQuestions({ promptText });
    return successResponse({
      data: { questions },
      requestId,
      startedAt,
    });
  } catch (error: any) {
    console.error('v1 Questions API Error:', error);
    return errorResponse({
      requestId,
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to generate questions',
    });
  }
}
