import { Ratelimit } from '@upstash/ratelimit';
import { cache } from './cache';

export const rateLimiter = new Ratelimit({
  redis: cache,

  limiter: Ratelimit.slidingWindow(100, '1 m'),

  analytics: true,
});
