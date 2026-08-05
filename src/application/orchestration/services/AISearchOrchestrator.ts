import { OrchestrationRequest, OrchestrationEvent, OrchestrationEventType } from '../entities/OrchestrationDomain';
import { IQueryAnalyzer } from '../../../domain/search/contracts/intelligence';
import { HybridSearchCoordinator } from './HybridSearchCoordinator';
import { RecommendationFusion } from '../fusion/RecommendationFusion';
import { RankingOrchestrator, CandidateDocument } from '../ranking/RankingOrchestrator';

export class AISearchOrchestrator {
  constructor(
    private readonly queryAnalyzer: IQueryAnalyzer,
    private readonly searchCoordinator: HybridSearchCoordinator,
    private readonly recommendationFusion: RecommendationFusion,
    private readonly rankingOrchestrator: RankingOrchestrator,
    private readonly eventBus: any // Placeholder for event emitter/logger
  ) {}

  public async execute(request: OrchestrationRequest): Promise<any> {
    const traceId = crypto.randomUUID();
    const startTime = performance.now();

    try {
      this.emitEvent({ eventType: OrchestrationEventType.STARTED, traceId, durationMs: 0, metadata: { query: request.rawQuery } });

      // 1. Intelligence Layer: Understand the query
      const analyzedQuery = await this.queryAnalyzer.analyze(request.rawQuery);

      // 2. Parallel Retrieval Pipeline
      // Vector array is currently null, waiting for Phase 6 (Model Integration)
      const vectorData = null; 
      
      const [searchCandidates, recommendationIds] = await Promise.all([
        this.searchCoordinator.fetchCandidates(analyzedQuery.correctedTokens.join(' '), vectorData, request.filters),
        this.recommendationFusion.fetchContextualInjections(analyzedQuery.intent, request.context)
      ]);

      // Map recommendations to Candidate format for merging
      const recCandidates: CandidateDocument[] = recommendationIds.map(id => ({
        id, source: 'RECOMMENDATION', rawScore: 1, metadata: {} 
      }));

      const allCandidates = [...searchCandidates, ...recCandidates];

      // 3. Ranking Orchestration
      const rankedScores = this.rankingOrchestrator.rank(allCandidates);
      this.emitEvent({ eventType: OrchestrationEventType.RANKING_COMPLETED, traceId, durationMs: performance.now() - startTime, metadata: { count: rankedScores.length } });

      // 4. Truncation and Formatting
      // Enforce the strict UI constraint of exactly 14 visible cells max per pagination
      const safeLimit = request.limit === 14 ? 14 : Math.min(request.limit, 14);
      const startIndex = (request.page - 1) * safeLimit;
      const paginatedResults = rankedScores.slice(startIndex, startIndex + safeLimit);

      const durationMs = performance.now() - startTime;
      this.emitEvent({ eventType: OrchestrationEventType.FINISHED, traceId, durationMs, metadata: { page: request.page } });

      return {
        traceId,
        queryData: analyzedQuery,
        results: paginatedResults,
        totalMatches: rankedScores.length,
        processingTimeMs: durationMs
      };

    } catch (error) {
      this.emitEvent({ eventType: OrchestrationEventType.ERROR, traceId, durationMs: performance.now() - startTime, metadata: { error: String(error) } });
      throw error;
    }
  }

  private emitEvent(event: OrchestrationEvent): void {
    // Analytics & Observability Hook
    if (this.eventBus && typeof this.eventBus.emit === 'function') {
      this.eventBus.emit('SearchEvent', event);
    }
  }
}