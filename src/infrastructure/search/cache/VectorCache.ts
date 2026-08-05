import { VectorEmbedding } from '../../../domain/search/vector/entities/VectorDomain';

export interface IVectorCache {
  // Caches the actual string -> vector translation to save API calls to embedding providers
  getEmbedding(textHash: string): Promise<VectorEmbedding | null>;
  setEmbedding(textHash: string, embedding: VectorEmbedding): Promise<void>;

  // Caches the search results for a specific vector query
  getSearchResults(vectorHash: string, filters: any): Promise<any | null>;
  setSearchResults(vectorHash: string, filters: any, results: any, ttl: number): Promise<void>;

  // Invalidation hook
  invalidateEntityVectors(entityId: string): Promise<void>;
}