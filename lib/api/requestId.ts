import { randomUUID } from 'crypto';

export function createRequestId() {
  return `req_${randomUUID().replace(/-/g, '')}`;
}
