import { SDKClient } from '../../core/client';

import { APIResponse, EnhanceRequest, EnhanceResponse } from '../../core/types';

export class EnhanceResource {
  constructor(private readonly client: SDKClient) {}

  async create(request: EnhanceRequest): Promise<APIResponse<EnhanceResponse>> {
    return this.client.http.post<APIResponse<EnhanceResponse>>('/prompts/enhance', request);
  }
}
