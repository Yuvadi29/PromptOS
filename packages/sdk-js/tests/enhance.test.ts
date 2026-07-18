import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PromptOS } from '../src';
import { PromptOSError } from '../src/core/errors';

describe('SDK Enhance Resource', () => {
  let client: PromptOS;

  beforeEach(() => {
    client = new PromptOS({
      apiKey: 'test_key',
      baseUrl: 'http://localhost:3001/api/v1',
    });
    global.fetch = vi.fn();
  });

  it('should call enhance endpoint with proper payload', async () => {
    const mockResponse = { success: true, data: { formats: { raw: 'Enhanced' } } };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify(mockResponse),
    });

    const result = await client.prompts.enhance.create({ prompt: 'test' });
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/v1/prompts/enhance',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ prompt: 'test' }),
        headers: expect.objectContaining({
          Authorization: 'Bearer test_key',
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('should throw PromptOSError on API failure', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => JSON.stringify({ error: { message: 'Invalid API Key' } }),
    });

    await expect(client.prompts.enhance.create({ prompt: 'test' })).rejects.toThrowError(
      PromptOSError
    );
  });
});
