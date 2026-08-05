import { ISearchProvider } from '../../../domain/search/contracts/providers';
import { IVectorDatabaseProvider } from '../../../domain/search/vector/contracts/IVectorProviders';
import { CandidateDocument } from '../ranking/RankingOrchestrator';

export class HybridSearchCoordinator {
  constructor(
    private readonly keywordProvider: ISearchProvider,
    private readonly vectorProvider: IVectorDatabaseProvider
  ) {}

  public async fetchCandidates(normalizedQuery: string, vector: number[] | null, filters: any): Promise<CandidateDocument[]> {
    const candidates: CandidateDocument[] = [];

    // Parallel execution for Keyword and Vector (if applicable)
    const keywordPromise = this.keywordProvider.searchByKeyword(normalizedQuery, filters);
    
    // Placeholder for Vector Search (executes only if AI models are active in config)
    const vectorPromise = vector 
      ? this.vectorProvider.query({ queryVector: { vector, dimensions: vector.length }, limit: 50 })
      : Promise.resolve([]);

    const [keywordResults, vectorResults] = await Promise.all([keywordPromise, vectorPromise]);

    keywordResults.forEach(doc => {
      candidates.push({ id: doc.id, source: 'KEYWORD', rawScore: 1, metadata: doc.metadata }); // Score requires TF-IDF calculation
    });

    vectorResults.forEach(res => {
      candidates.push({ id: res.document.id, source: 'VECTOR', rawScore: res.similarityScore, metadata: res.document.metadata });
    });

    return candidates;
  }
}