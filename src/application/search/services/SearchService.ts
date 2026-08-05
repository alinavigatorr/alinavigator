import { SearchQuery, SearchResult, SearchDocument } from '../../../domain/search/entities';
import { SearchConfiguration } from '../../../domain/search/config/SearchConfig';
import { IEmbeddingProvider, ISearchProvider, IRankingProvider } from '../../../domain/search/contracts/providers';

export class SearchService {
  constructor(
    private readonly searchProvider: ISearchProvider,
    private readonly embeddingProvider: IEmbeddingProvider,
    private readonly rankingProvider: IRankingProvider,
    private readonly searchConfig: SearchConfiguration
  ) {}

  public async executeSearch(rawTerm: string, filters: Record<string, any> = {}, page = 1, limit = 20): Promise<SearchResult> {
    const startTime = performance.now();
    
    // ۱. نرمال‌سازی ورودی کاربر
    const query: SearchQuery = this.normalizeQuery(rawTerm, filters, page, limit);

    let retrievedDocs: SearchDocument[] = [];

    // ۲. انتخاب استراتژی (معنایی یا کلمه‌ای)
    if (this.searchConfig.rankingStrategy === 'HYBRID' || this.searchConfig.rankingStrategy === 'SEMANTIC_ONLY') {
      console.warn("Semantic search requested but models not yet active. Falling back to keyword.");
    } 
    
    if (this.searchConfig.rankingStrategy === 'KEYWORD_ONLY' || retrievedDocs.length === 0) {
      retrievedDocs = await this.searchProvider.searchByKeyword(query.normalizedTerm, query.filters);
    }

    // ۳. ارسال به پایپ‌لاین رتبه‌بندی
    const scoredDocuments = this.rankingProvider.rank(query, retrievedDocs, this.searchConfig);

    // ۴. مرتب‌سازی نهایی و صفحه‌بندی
    const sortedResults = scoredDocuments
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice((page - 1) * limit, page * limit)
      .map(score => ({
        document: retrievedDocs.find(d => d.id === score.documentId)!,
        score
      }));

    return {
      query,
      documents: sortedResults,
      totalMatches: retrievedDocs.length,
      processingTimeMs: performance.now() - startTime
    };
  }

  private normalizeQuery(term: string, filters: any, page: number, limit: number): SearchQuery {
    return {
      rawTerm: term,
      normalizedTerm: term.trim().toLowerCase().replace(/[^a-z0-9 ]/g, ''),
      filters,
      pagination: { 
        page: Math.max(1, page), 
        limit: Math.min(limit, this.searchConfig.maxResultsLimit) 
      }
    };
  }
}