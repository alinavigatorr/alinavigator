import { SearchQuery, SearchResult } from '../../../domain/search/entities';
import { RecommendationType } from '../../../domain/recommendation/entities/RecommendationDomain';
import { AnalyzedQuery } from '../../../domain/search/entities/SearchIntent';

export interface SearchContext {
  userId?: string;
  sessionId: string;
  deviceType: 'DESKTOP' | 'MOBILE' | 'TABLET';
  region: string;
  language: string;
  currentCategoryId?: string;
}

export interface OrchestrationRequest {
  rawQuery: string;
  context: SearchContext;
  filters?: Record<string, any>;
  page: number;
  limit: number; // Strictly mapped to 14 by default for UI grid requirements
}

export enum OrchestrationEventType {
  STARTED = 'AI_SEARCH_STARTED',
  FINISHED = 'AI_SEARCH_FINISHED',
  RANKING_COMPLETED = 'RANKING_COMPLETED',
  RECOMMENDATION_MERGED = 'RECOMMENDATION_MERGED',
  ERROR = 'AI_SEARCH_ERROR'
}

export interface OrchestrationEvent {
  eventType: OrchestrationEventType;
  traceId: string;
  durationMs: number;
  metadata: Record<string, any>;
}