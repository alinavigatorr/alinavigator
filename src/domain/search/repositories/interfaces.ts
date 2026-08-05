import { SearchDocument, SearchIndexMetadata } from '../entities';

export interface ISearchRepository {
  findDocumentsByIds(ids: string[]): Promise<SearchDocument[]>;
  streamAllDocuments(batchSize: number): AsyncIterable<SearchDocument[]>;
}

export interface IEmbeddingRepository {
  saveEmbedding(documentId: string, vector: number[]): Promise<void>;
  getEmbedding(documentId: string): Promise<number[] | null>;
}

export interface IIndexRepository {
  saveMetadata(metadata: SearchIndexMetadata): Promise<void>;
  getMetadata(indexName: string): Promise<SearchIndexMetadata | null>;
}