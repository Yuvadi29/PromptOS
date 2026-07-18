import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PromptOS } from '../src';
import { PromptOSError } from '../src/core/errors';

describe('SDK Retries and Timeouts', () => {
  let client: PromptOS;

  beforeEach(() => {
    client = new PromptOS({
      apiKey: 'test_key',
      baseUrl: 'http://test.api',
      retries: 2,
      retryDelay: 10,
      timeout: 100,
    });
    global.fetch = vi.fn();
  });

  it('should retry on failure', async () => {
    let attempts = 0;
    (global.fetch as any).mockImplementation(async () => {
      attempts++;
      if (attempts < 2) {
        throw new Error('Network error');
      }
      return {
        ok: true,
        text: async () => JSON.stringify({ success: true, data: { formats: { raw: 'Enhanced' } } }),
      };
    });

    const result = await client.prompts.enhance.create({ prompt: 'test' });
    expect(result.success).toBe(true);
    expect(attempts).toBe(2);
  });

  it('should throw error if all retries fail', async () => {
    let attempts = 0;
    (global.fetch as any).mockImplementation(async () => {
      attempts++;
      throw new Error('Network error');
    });

    await expect(client.prompts.enhance.create({ prompt: 'test' })).rejects.toThrowError(
      PromptOSError
    );
    expect(attempts).toBe(3); // 1 initial + 2 retries
  });

  it('should timeout if request takes too long', async () => {
    (global.fetch as any).mockImplementation(async (url: string, init: RequestInit) => {
      return new Promise((resolve, reject) => {
        if (init.signal?.aborted) {
          const err = new Error('AbortError');
          err.name = 'AbortError';
          return reject(err);
        }

        const timeoutId = setTimeout(() => {
          resolve({ ok: true, text: async () => '{}' });
        }, 500);

        init.signal?.addEventListener('abort', () => {
          clearTimeout(timeoutId);
          const err = new Error('AbortError');
          err.name = 'AbortError';
          reject(err);
        });
      });
    });

    await expect(client.prompts.enhance.create({ prompt: 'test' })).rejects.toThrow(
      'Request timed out.'
    );
  });
});
