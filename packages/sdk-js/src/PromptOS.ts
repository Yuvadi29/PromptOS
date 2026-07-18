import { SDKClient } from './core/client';
import { PromptOSConfig } from './core/types';

import { PromptResource } from './resources/prompts';

export class PromptOS {
  readonly prompts: PromptResource;

  constructor(config: PromptOSConfig) {
    const client = new SDKClient(config);

    this.prompts = new PromptResource(client);
  }
}
