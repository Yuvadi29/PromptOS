import { HttpClient } from './http';
import { PromptOSConfig } from './types';

export class SDKClient {
  readonly http: HttpClient;

  constructor(config: PromptOSConfig) {
    this.http = new HttpClient(config);
  }
}
