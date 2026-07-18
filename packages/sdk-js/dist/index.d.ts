interface PromptOSConfig {
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
interface APIResponse<T> {
  success: boolean;
  requestId: string;
  data: T;
  meta?: {
    version: string;
    processingTime: number;
  };
}
interface EnhanceRequest {
  prompt: string;
  answers?: Array<{
    question: string;
    answer: string;
  }>;
}
interface EnhanceResponse {
  type: string;
  formats: {
    raw: string;
    markdown: string;
    json: unknown;
  };
}
interface ClassifyRequest {
  prompt: string;
}
interface ClassifyResponse {
  type: string;
}

declare class HttpClient {
  private readonly apiKey;
  private readonly baseURL;
  private readonly timeout;
  private readonly retries;
  private readonly retryDelay;
  constructor(config: PromptOSConfig);
  post<T>(endpoint: string, body: unknown): Promise<T>;
}

declare class SDKClient {
  readonly http: HttpClient;
  constructor(config: PromptOSConfig);
}

declare class EnhanceResource {
  private readonly client;
  constructor(client: SDKClient);
  create(request: EnhanceRequest): Promise<APIResponse<EnhanceResponse>>;
}

declare class ClassifyResource {
  private readonly client;
  constructor(client: SDKClient);
  create(request: ClassifyRequest): Promise<APIResponse<ClassifyResponse>>;
}

declare class PromptResource {
  readonly enhance: EnhanceResource;
  readonly classify: ClassifyResource;
  constructor(client: SDKClient);
}

declare class PromptOS {
  readonly prompts: PromptResource;
  constructor(config: PromptOSConfig);
}

declare class PromptOSError extends Error {
  status?: number | undefined;
  constructor(message?: string, status?: number | undefined);
}
declare class AuthenticationError extends PromptOSError {}
declare class ValidationError extends PromptOSError {}
declare class RateLimitError extends PromptOSError {}
declare class TimeoutError extends PromptOSError {}
declare class ServerError extends PromptOSError {}
declare class NetworkError extends PromptOSError {}

export {
  type APIResponse,
  AuthenticationError,
  type ClassifyRequest,
  type ClassifyResponse,
  type EnhanceRequest,
  type EnhanceResponse,
  NetworkError,
  PromptOS,
  type PromptOSConfig,
  PromptOSError,
  RateLimitError,
  ServerError,
  TimeoutError,
  ValidationError,
};
