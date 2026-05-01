import { classifyPrompt } from '@/lib/prompt-classifier';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { input } = await req.json();

  if (!input) {
    return NextResponse.json(
      {
        error: 'Missing Input',
      },
      {
        status: 400,
      }
    );
  }

  const result = await classifyPrompt(input);
  return NextResponse.json(result);
}
