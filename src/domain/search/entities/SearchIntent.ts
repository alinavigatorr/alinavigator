export enum SearchIntentType {
    PRODUCT = 'PRODUCT',
    CATEGORY = 'CATEGORY',
    BRAND = 'BRAND',
    ATTRIBUTE = 'ATTRIBUTE',
    NAVIGATION = 'NAVIGATION',
    UNKNOWN = 'UNKNOWN',
    AI_DYNAMIC = 'AI_DYNAMIC' // Placeholder for future LLM intent
  }
  
  export interface SearchIntent {
    type: SearchIntentType;
    confidenceScore: number;
    extractedEntities: {
      brands?: string[];
      categories?: string[];
      attributes?: Record<string, string>;
    };
  }
  
  export interface AnalyzedQuery {
    originalRawTerm: string;
    normalizedTokens: string[];
    correctedTokens: string[];
    expandedSynonyms: string[];
    intent: SearchIntent;
    language: string;
    isFuzzyRequired: boolean;
  }