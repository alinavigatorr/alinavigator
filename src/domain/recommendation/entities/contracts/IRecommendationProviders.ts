import { RecommendationContext, RecommendationResult, RecommendationType, RecommendationScore } from '../entities/RecommendationDomain';

export interface IRecommendationStrategy {
  getType(): RecommendationType;
  retrieveCandidates(context: RecommendationContext): Promise<string[]>;
}

export interface IRecommendationRanker {
  rank(candidateIds: string[], context: RecommendationContext): Promise<RecommendationScore[]>;
}

export interface IRecommendationProvider {
  getRecommendations(context: RecommendationContext, types: RecommendationType[]): Promise<RecommendationResult>;
}

export interface IRecommendationRepository {
  getProductMetadata(productIds: string[]): Promise<Record<string, any>>;
  getUserAffinity(userId: string): Promise<Record<string, number>>;
}

export interface IRecommendationCacheRepository {
  get(key: string): Promise<RecommendationResult | null>;
  set(key: string, result: RecommendationResult, ttlSeconds: number): Promise<void>;
  invalidateForProduct(productId: string): Promise<void>;
}