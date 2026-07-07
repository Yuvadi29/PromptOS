import { connection as redis } from '@/lib/queues/redis';

/**
 * Wraps a Supabase query with Redis caching.
 * @param key The Redis cache key
 * @param ttlSeconds Time-to-live in seconds (default: 3600 / 1 hour)
 * @param dbQueryFn The fallback asynchronous function to fetch data from Supabase
 */
export async function getCachedData<T>(
  key: string,
  ttlSeconds: number = 3600,
  dbQueryFn: () => Promise<T>
): Promise<T> {
  try {
    // 1. Read from Redis Cache
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (error) {
    console.error(`Redis cache read failed for key "${key}":`, error);
  }

  // 2. Cache Miss: Query Supabase
  const data = await dbQueryFn();

  // 3. Write back to Redis asynchronously
  if (data !== null && data !== undefined) {
    redis.set(key, JSON.stringify(data), 'EX', ttlSeconds).catch((err) => {
      console.error(`Redis cache write failed for key "${key}":`, err);
    });
  }

  return data;
}

/**
 * Invalidates a Redis cache key (used on Database write/update).
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error(`Redis key deletion failed for key "${key}":`, error);
  }
}
