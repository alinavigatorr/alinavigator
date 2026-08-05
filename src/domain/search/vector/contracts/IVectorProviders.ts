import { VectorDocument, VectorSearchRequest, VectorSearchResult, VectorEmbedding } from '../entities/VectorDomain';
import { SimilarityMetric } from '../config/VectorConfig';

export interface IVectorDatabaseProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  upsert(documents: VectorDocument[]): Promise<void>;
  delete(ids: string[]): Promise<void>;
  query(request: VectorSearchRequest): Promise<VectorSearchResult[]>;
}

export interface IEmbeddingProvider {
  generate(text: string): Promise<VectorEmbedding>;
  generateBatch(texts: string[]): Promise<VectorEmbedding[]>;
}

export interface IVectorIndexer {
  createIndex(indexName: string, dimensions: number, metric: SimilarityMetric): Promise<void>;
  deleteIndex(indexName: string): Promise<void>;
  rebuildFull(documents: VectorDocument[]): Promise<void>;
  updateIncremental(documents: VectorDocument[]): Promise<void>;
  syncBackground(): Promise<void>;
}

export interface ISimilarityCalculator {
  calculate(vectorA: number[], vectorB: number[], metric: SimilarityMetric): number;
}