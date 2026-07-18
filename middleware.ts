import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey } from '@/lib/platform/authenticateApiKey';
import { rateLimiter } from '@/lib/platform/rateLimiter';
import { errorResponse } from '@/lib/api/errors';
import { APIErrorCodes } from '@/lib/api/codes';
import { createRequestId } from '@/lib/api/requestId';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/v1/')) {
    const auth = await authenticateApiKey(request);
    if (!auth.success) return auth.response;

    const { userId, apiKeyId } = auth.data;
    const limitResult = await rateLimiter.limit(apiKeyId);

    const requestId = createRequestId();

    if (!limitResult.success) {
      const resp = errorResponse({
        requestId,
        status: 429,
        code: APIErrorCodes.RATE_LIMITED,
        message: 'Rate Limit Exceeded',
      });
      resp.headers.set('X-RateLimit-Limit', limitResult.limit.toString());
      resp.headers.set('X-RateLimit-Remaining', limitResult.remaining.toString());
      resp.headers.set('X-RateLimit-Reset', limitResult.reset.toString());
      return resp;
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-api-user-id', userId);
    requestHeaders.set('x-api-key-id', apiKeyId);
    requestHeaders.set('x-request-id', requestId);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    response.headers.set('X-RateLimit-Limit', limitResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', limitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', limitResult.reset.toString());

    return response;
  }

  // Protect /admin/dashboard and all /api/admin/* routes (except login/logout)
  const isAdminDashboard = pathname.startsWith('/admin/dashboard');
  const isAdminApi =
    pathname.startsWith('/api/admin') &&
    !pathname.startsWith('/api/admin/login') &&
    !pathname.startsWith('/api/admin/logout');

  if (isAdminDashboard || isAdminApi) {
    const token = request.cookies.get('admin_session')?.value;

    if (!token) {
      if (isAdminDashboard) {
        // Redirect to admin login page
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      // For API routes, return 401
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token structure and expiry (lightweight check in edge runtime)
    try {
      const [payloadB64] = token.split('.');
      if (!payloadB64) throw new Error('Invalid token');

      const payload = JSON.parse(atob(payloadB64));
      if (payload.role !== 'admin' || Date.now() > payload.exp) {
        throw new Error('Token expired or invalid role');
      }
    } catch {
      // Clear the invalid cookie and redirect/reject
      if (isAdminDashboard) {
        const response = NextResponse.redirect(new URL('/admin', request.url));
        response.cookies.set('admin_session', '', { path: '/', maxAge: 0 });
        return response;
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/api/admin/:path*', '/api/v1/:path*'],
};
