import { SDKClient } from '../../core/client';

import { APIResponse, ClassifyRequest, ClassifyResponse } from '../../core/types';

export class ClassifyResource {
  constructor(private readonly client: SDKClient) {}

  async create(request: ClassifyRequest): Promise<APIResponse<ClassifyResponse>> {
    return this.client.http.post<APIResponse<ClassifyResponse>>('/prompts/classify', request);
  }
}
