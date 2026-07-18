import { PromptOSConfig } from './types';
import { DEFAULT_CONFIG } from './config';
import { PromptOSError } from './errors';
import { retry } from './retry';

export class HttpClient {
  private readonly apiKey: string;
  private readonly baseURL: string;
  private readonly timeout: number;
  private readonly retries: number;
  private readonly retryDelay: number;

  constructor(config: PromptOSConfig) {
    this.apiKey = config.apiKey;

    this.baseURL = config.baseUrl ?? DEFAULT_CONFIG.BASE_URL;

    this.timeout = config.timeout ?? DEFAULT_CONFIG.TIMEOUT;

    this.retries = config.retries ?? DEFAULT_CONFIG.RETRIES;

    this.retryDelay = config.retryDelay ?? DEFAULT_CONFIG.RETRY_DELAY;
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, this.timeout);

    try {
      return await retry(
        async () => {
          const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',

            headers: {
              Authorization: `Bearer ${this.apiKey}`,

              'Content-Type': 'application/json',
            },

            body: JSON.stringify(body),

            signal: controller.signal,
          });
          const text = await response.text();
          let json: any;
          try {
            json = JSON.parse(text);
          } catch {
            // Ignore JSON parse error, we'll handle non-ok responses below
          }

          if (!response.ok) {
            throw new PromptOSError(
              json?.error?.message ?? `API Error: ${response.status} ${response.statusText}`,
              response.status
            );
          }

          if (!json) {
            throw new PromptOSError('Invalid JSON response from server');
          }

          return json;
        },
        {
          retries: this.retries,

          delay: this.retryDelay,
        }
      );
    } catch (err) {
      if (err instanceof PromptOSError) {
        throw err;
      }

      if (err instanceof Error && err.name === 'AbortError') {
        throw new PromptOSError('Request timed out.');
      }

      throw new PromptOSError('Network request failed.');
    } finally {
      clearTimeout(timeout);
    }
  }
}
