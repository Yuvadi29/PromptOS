import { HttpClient } from '../http';
import { EnhanceRequest, EnhanceResponse } from '../types/enhance';
export declare class EnhanceResource {
  private http;
  constructor(http: HttpClient);
  create(request: EnhanceRequest): Promise<EnhanceResponse>;
}
