import { SDKClient } from '../../core/client';

import { EnhanceResource } from './enhance';
import { ClassifyResource } from './classify';

export class PromptResource {
  readonly enhance: EnhanceResource;

  readonly classify: ClassifyResource;

  constructor(client: SDKClient) {
    this.enhance = new EnhanceResource(client);

    this.classify = new ClassifyResource(client);
  }
}
