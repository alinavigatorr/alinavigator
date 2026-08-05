export interface SearchConfiguration {
    weights: {
      keywordMatch: number;
      semanticMatch: number;
    };
    boosts: {
      categoryMatch: number;
      highPopularity: number;
      recentFreshness: number;
    };
    rankingStrategy: 'KEYWORD_ONLY' | 'SEMANTIC_ONLY' | 'HYBRID';
    cacheTTLSeconds: number;
    maxResultsLimit: number;
  }