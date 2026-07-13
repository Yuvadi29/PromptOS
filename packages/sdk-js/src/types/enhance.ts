export interface EnhanceRequest {
  prompt: string;
  answers?: {
    question: string;
    answer: string;
  }[];
}

export interface EnhanceResponse {
  type: string;
  formats: {
    raw?: string;
    markdown?: string;
    json?: unknown;
  };
}
