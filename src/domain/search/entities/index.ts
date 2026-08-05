export interface SearchQuery {
    rawTerm: string;
    normalizedTerm: string;
    filters?: Record<string, string | string[]>;
    pagination: {
      page: number;
      limit: number;
    };
  }
  
  export interface SearchDocument {
    id: string;
    type: 'PRODUCT' | 'CATEGORY' | 'CONTENT';
    title: string;
    description: string;
    metadata: Record<string, any>;
    embeddingVector?: number[]; // در فاز بعدی برای هوش مصنوعی پر می‌شود
    updatedAt: Date;
  }
  
  export interface SearchScore {
    documentId: string;
    baseScore: number;
    keywordScore: number;
    semanticScore: number; // جایگاه رزرو شده برای جستجوی معنایی
    categoryBoost: number;
    popularityBoost: number;
    freshnessBoost: number;
    totalScore: number;
  }
  
  export interface SearchResult {
    query: SearchQuery;
    documents: Array<{
      document: SearchDocument;
      score: SearchScore;
    }>;
    totalMatches: number;
    processingTimeMs: number;
  }
  
  export interface SearchIndexMetadata {
    indexName: string;
    documentCount: number;
    lastRebuiltAt: Date;
    status: 'READY' | 'REBUILDING' | 'ERROR';
    provider: string;
  }