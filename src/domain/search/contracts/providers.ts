import { SearchQuery, SearchDocument, SearchScore, SearchConfiguration } from '../entities';

export interface IEmbeddingProvider {
  embedText(text: string): Promise<number[]>;
  embedProduct(productData: Record<string, any>): Promise<number[]>;
  embedCategory(categoryData: Record<string, any>): Promise<number[]>;
}

export interface ISearchProvider {
  searchByKeyword(query: string, filters?: any): Promise<SearchDocument[]>;
  searchByVector(vector: number[], limit: number, filters?: any): Promise<SearchDocument[]>;
}

export interface ISearchIndexer {
  createIndex(name: string): Promise<void>;
  updateDocument(doc: SearchDocument): Promise<void>;
  deleteDocument(id: string): Promise<void>;
  rebuildIndex(documents: SearchDocument[]): Promise<void>;
  incrementalUpdate(documents: SearchDocument[]): Promise<void>;
}

export interface IRankingProvider {
  rank(
    query: SearchQuery, 
    documents: SearchDocument[], 
    config: SearchConfiguration
  ): SearchScore[];
}