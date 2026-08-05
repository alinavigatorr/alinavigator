export interface VectorEmbedding {
    vector: number[];
    dimensions: number;
  }
  
  export interface VectorMetadata {
    entityId: string;
    entityType: 'PRODUCT' | 'CATEGORY' | 'BRAND' | 'REVIEW' | 'ARTICLE';
    tags: string[];
    attributes: Record<string, string | number | boolean>;
    timestamp: Date;
  }
  
  export interface VectorDocument {
    id: string; // Unique vector ID
    embedding: VectorEmbedding;
    metadata: VectorMetadata;
    originalContentReference: string; // The text that was embedded
  }
  
  export interface VectorSearchRequest {
    queryVector: VectorEmbedding;
    limit: number;
    minSimilarityScore?: number;
    filterMask?: Record<string, any>; // Metadata filters (e.g., categoryId == X)
  }
  
  export interface VectorSearchResult {
    document: VectorDocument;
    similarityScore: number;
  }