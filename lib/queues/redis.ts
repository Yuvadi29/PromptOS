import IORedis from 'ioredis';

export const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
  // Don't retry connecting if Redis is down locally to prevent infinite loops/errors
  retryStrategy: () => null,
});

connection.on('error', (err) => {
  console.warn(
    '[ioredis] Connection failed (Expected if Redis is not running locally):',
    err.message
  );
});
