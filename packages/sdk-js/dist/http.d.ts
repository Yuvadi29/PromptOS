import { PromptOSConfig } from './types/client';
export declare class HttpClient {
  private config;
  constructor(config: PromptOSConfig);
  post<T>(path: string, body: unknown): Promise<T>;
}
