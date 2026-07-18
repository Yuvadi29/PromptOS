import { NextRequest } from 'next/server';
import { APIErrorCodes } from '../api/codes';
import { errorResponse } from '../api/errors';
import { rateLimiter } from './rateLimiter';

export async function checkRateLimit(req: NextRequest, requestId: string, identifier: string) {
  const result = await rateLimiter.limit(identifier);

  if (!result.success) {
    return errorResponse({
      requestId,
      status: 429,
      code: APIErrorCodes.RATE_LIMITED,
      message: 'Rate Limit Exceeded',
    });
  }

  return null;
}
