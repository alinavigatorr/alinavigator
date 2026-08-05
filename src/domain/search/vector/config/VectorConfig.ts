export enum SimilarityMetric {
    COSINE = 'COSINE',
    DOT_PRODUCT = 'DOT_PRODUCT',
    EUCLIDEAN = 'EUCLIDEAN'
  }
  
  export interface VectorConfiguration {
    embeddingDimensions: number; // e.g., 1536 for OpenAI ada-002, 768 for mpnet
    similarityMetric: SimilarityMetric;
    maxResults: number;
    similarityThreshold: number; // e.g., 0.75
    hybridSearch: {
      vectorWeight: number;  // e.g., 0.6
      keywordWeight: number; // e.g., 0.4
      fusionStrategy: 'RRF' | 'CONVEX_COMBINATION';
    };
    providerSelection: {
      database: 'PGVECTOR' | 'QDRANT' | 'PINECONE' | 'WEAVIATE' | 'MILVUS' | 'CHROMADB' | 'MOCK';
      embeddingModel: 'OPENAI' | 'GEMINI' | 'OLLAMA' | 'MOCK';
    };
  }