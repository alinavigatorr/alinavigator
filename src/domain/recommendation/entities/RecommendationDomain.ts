export enum RecommendationType {
    SIMILAR_PRODUCTS = 'SIMILAR_PRODUCTS',
    FREQUENTLY_BOUGHT_TOGETHER = 'FREQUENTLY_BOUGHT_TOGETHER',
    TRENDING = 'TRENDING',
    RECENTLY_VIEWED = 'RECENTLY_VIEWED',
    POPULAR_IN_CATEGORY = 'POPULAR_IN_CATEGORY',
    NEW_ARRIVALS = 'NEW_ARRIVALS',
    PERSONALIZED = 'PERSONALIZED',
    CROSS_SELL = 'CROSS_SELL',
    UP_SELL = 'UP_SELL',
    AI_GENERATED = 'AI_GENERATED'
  }
  
  export interface RecommendationContext {
    userId?: string;
    sessionId: string;
    currentProductId?: string;
    currentCategoryId?: string;
    cartProductIds?: string[];
    limit: number; // Default strictly set to 14 for layout grid compliance
  }
  
  export interface RecommendationSignal {
    popularityScore: number;
    purchaseCount: number;
    viewCount: number;
    categoryAffinity: number;
    brandAffinity: number;
    freshnessScore: number;
    priceRangeMatch: number;
  }
  
  export interface RecommendationReason {
    code: string;
    message: string; // e.g., "Because you viewed Product X"
  }
  
  export interface RecommendationScore {
    productId: string;
    baseScore: number;
    businessBoost: number;
    aiScore: number; // Placeholder for Phase 5 ML integration
    finalScore: number;
    signals: RecommendationSignal;
  }
  
  export interface RecommendationResult {
    context: RecommendationContext;
    recommendedProductIds: string[];
    type: RecommendationType;
    reasons: Record<string, RecommendationReason>; // productId -> Reason
    generatedAt: Date;
  }