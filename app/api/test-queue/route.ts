import { NextResponse } from 'next/server';
import { queuePromptAggregation } from '@/lib/queues/aggregationJobs';

export async function GET() {
  await queuePromptAggregation(72, 'test-user');

  return NextResponse.json({
    success: true,
  });
}
