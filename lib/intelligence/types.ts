export interface PromptIntelligence {
  promptType: string;

  detectedIntent: string;

  outputFormat: string;

  complexityScore: number;

  clarityScore: number;

  specificityScore: number;

  structureScore: number;

  personalizationTags: string[];
}

export interface UserPreferences {
  preferredPromptTypes: string[];

  preferredOutputFormats: string[];

  verbosity: string;

  tone: string;

  averagePromptLength: number;

  favoriteModel: string;

  topCategories: string[];
}
