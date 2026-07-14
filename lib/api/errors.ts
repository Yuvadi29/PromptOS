import { NextResponse } from 'next/server';
import { APIErrorCode } from './codes';

export function errorResponse({
  requestId,
  status,
  code,
  message,
}: {
  requestId: string;
  status: number;
  code: APIErrorCode;
  message: string;
}) {
  return NextResponse.json(
    {
      success: false,
      requestId,
      error: {
        code,
        message,
        status,
      },
    },
    {
      status,
    }
  );
}
