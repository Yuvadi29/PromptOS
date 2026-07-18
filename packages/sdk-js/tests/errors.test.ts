import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PromptOS } from '../src';
import { PromptOSError } from '../src/core/errors';

describe('SDK Error Handling', () => {
  let client: PromptOS;

  beforeEach(() => {
    client = new PromptOS({
      apiKey: 'test_key',
      baseUrl: 'http://test.api',
      retries: 0,
    });
    global.fetch = vi.fn();
  });

  it('should throw PromptOSError with correct status for 401', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ error: { message: 'Unauthorized' } }),
    });

    try {
      await client.prompts.enhance.create({ prompt: 'test' });
      expect.fail('Should have thrown');
    } catch (err: any) {
      expect(err).toBeInstanceOf(PromptOSError);
      expect(err.message).toContain('Unauthorized');
      expect(err.status).toBe(401);
    }
  });
});
