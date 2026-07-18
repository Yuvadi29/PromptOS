import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PromptOS } from '../src';
import { PromptOSError } from '../src/core/errors';

describe('SDK Classify Resource', () => {
  let client: PromptOS;

  beforeEach(() => {
    client = new PromptOS({
      apiKey: 'test_key',
      baseUrl: 'http://localhost:3001/api/v1',
    });
    global.fetch = vi.fn();
  });

  it('should call classify endpoint with proper payload', async () => {
    const mockResponse = { success: true, data: { type: 'chat' } };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify(mockResponse),
    });

    const result = await client.prompts.classify.create({ prompt: 'hello' });
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/v1/prompts/classify',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ prompt: 'hello' }),
        headers: expect.objectContaining({
          Authorization: 'Bearer test_key',
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('should throw PromptOSError on rate limit', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: async () => JSON.stringify({ error: { message: 'Rate Limit Exceeded' } }),
    });

    await expect(client.prompts.classify.create({ prompt: 'hello' })).rejects.toThrowError(
      PromptOSError
    );
  });
});
