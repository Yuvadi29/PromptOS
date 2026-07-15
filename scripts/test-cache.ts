import { cache } from '@/lib/platform/cache';

async function main() {
  await cache.set('hello', 'PromptOS');

  const value = await cache.get('hello');

  await cache.set('test', '123', {
    ex: 10,
  });

  return value;
}

main();
