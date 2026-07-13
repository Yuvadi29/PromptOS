import { defaultConfig } from './config';
import { HttpClient } from './http';
import { EnhanceResource } from './resources/enhance';
import { PromptOSConfig } from './types/client';

export class PromptOS {
  public enhance: EnhanceResource;
  constructor(config: PromptOSConfig) {
    const merged = {
      ...defaultConfig,
      ...config,
    };

    const http = new HttpClient(merged);
    this.enhance = new EnhanceResource(http);
  }
}
