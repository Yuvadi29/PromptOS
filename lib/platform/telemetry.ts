import { supabaseAdmin } from '@/lib/supabase';

export interface TelemetryEvent {
  requestId: string;

  apiKeyId?: string;

  userId?: string;

  endpoint: string;

  method: string;

  status: number;

  latency: number;

  ip?: string;

  userAgent?: string;
}

export async function captureTelemetry(event: TelemetryEvent) {
  try {
    await supabaseAdmin.from('api_request_logs').insert({
      request_id: event.requestId,

      api_key_id: event.apiKeyId,

      user_id: event.userId,

      endpoint: event.endpoint,

      method: event.method,

      status: event.status,

      latency_ms: event.latency,

      ip: event.ip,

      user_agent: event.userAgent,
    });
  } catch (err) {
    console.error('Telemetry Error', err);
  }
}
