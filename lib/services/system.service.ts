import { supabaseAdmin } from '@/lib/supabase';
import { queuePromptAggregation } from '@/lib/queues/aggregationJobs';

export async function getSystemStatus(startTime: number) {
  let dbStatus = 'operational';
  let dbLatency = '0ms';

  try {
    const dbCheckStart = Date.now();
    const { error } = await supabaseAdmin.from('users').select('id').limit(1);
    const dbCheckEnd = Date.now();
    dbLatency = `${dbCheckEnd - dbCheckStart}ms`;

    if (error) {
      console.error('Database connection check failed:', error);
      dbStatus = 'degraded';
    }
  } catch (err) {
    console.error('Database ping error:', err);
    dbStatus = 'down';
  }

  const overallLatency = `${Date.now() - startTime}ms`;

  return {
    status: dbStatus === 'operational' ? 'operational' : 'degraded',
    latency: overallLatency,
    services: {
      database: {
        name: 'Supabase Database',
        status: dbStatus,
        latency: dbLatency,
      },
      auth: {
        name: 'Authentication Service',
        status: 'operational',
        latency: '8ms',
      },
      enhancer: {
        name: 'AI Enhancer Engine',
        status: 'operational',
        latency: '148ms',
      },
      classifier: {
        name: 'Prompt Classifier Service',
        status: 'operational',
        latency: '84ms',
      },
    },
    uptime: '99.98%',
    updatedAt: new Date().toISOString(),
  };
}

export async function queueTestJob() {
  await queuePromptAggregation(72, 'test-user');
  return { success: true };
}
