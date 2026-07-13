import { HttpClient } from '../http';
import { EnhanceRequest, EnhanceResponse } from '../types/enhance';

export class EnhanceResource {
  constructor(private http: HttpClient) {}

  async create(request: EnhanceRequest): Promise<EnhanceResponse> {
    return this.http.post('/enhance', request);
  }
}
