import crypto from 'crypto';

export function hashAPIKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}
