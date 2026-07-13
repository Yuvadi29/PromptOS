import { NextResponse } from 'next/server';

export function successResponse<T>({
  data,
  requestId,
  startedAt,
}: {
  data: T;
  requestId: string;
  startedAt: number;
}) {
  return NextResponse.json({
    success: true,
    requestId,
    data,
    meta: {
      version: 'v1',
      processingTime: (Date.now() - startedAt).toFixed(0) + 'ms',
    },
  });
}
