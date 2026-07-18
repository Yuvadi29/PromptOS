export interface PromptOSConfig {
  apiKey: string;

  /**
   * Defaults to PromptOS Cloud.
   */
  baseUrl?: string;

  /**
   * Request timeout.
   *
   * Default: 30000 ms
   */
  timeout?: number;

  retries?: number;

  retryDelay?: number;
}

export interface APIResponse<T> {
  success: boolean;

  requestId: string;

  data: T;

  meta?: {
    version: string;
    processingTime: number;
  };
}

export interface EnhanceRequest {
  prompt: string;

  answers?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface EnhanceResponse {
  type: string;

  formats: {
    raw: string;
    markdown: string;
    json: unknown;
  };
}

export interface ClassifyRequest {
  prompt: string;
}

export interface ClassifyResponse {
  type: string;
}
