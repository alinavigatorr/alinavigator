import { IRecommendationStrategy, IRecommendationRanker, IRecommendationRepository } from '../../../domain/recommendation/contracts/IRecommendationProviders';
import { RecommendationContext, RecommendationResult, RecommendationType } from '../../../domain/recommendation/entities/RecommendationDomain';
import { IBusinessRule, InStockRule, ProductVisibilityRule } from '../rules/BusinessRules';

export class RecommendationPipeline {
  private rules: IBusinessRule[] = [
    new InStockRule(),
    new ProductVisibilityRule()
  ];

  constructor(
    private readonly strategies: IRecommendationStrategy[],
    private readonly ranker: IRecommendationRanker,
    private readonly repository: IRecommendationRepository
  ) {}

  public async execute(context: RecommendationContext, requestedTypes: RecommendationType[]): Promise<RecommendationResult> {
    // Enforce UI constraints (Exact 14-cell grid requirement)
    const normalizedContext = { ...context, limit: context.limit || 14 };

    // 1. Candidate Retrieval (Parallel strategy execution)
    const activeStrategies = this.strategies.filter(s => requestedTypes.includes(s.getType()));
    const candidateArrays = await Promise.all(activeStrategies.map(s => s.retrieveCandidates(normalizedContext)));
    
    // Deduplicate candidates
    let uniqueCandidates = Array.from(new Set(candidateArrays.flat()));

    if (uniqueCandidates.length === 0) {
      return this.emptyResult(normalizedContext);
    }

    // 2. Fetch Metadata for Filtering
    const metadataMap = await this.repository.getProductMetadata(uniqueCandidates);

    // 3. Business Rule Filtering
    for (const rule of this.rules) {
      uniqueCandidates = rule.filter(uniqueCandidates, metadataMap);
    }

    // 4. Ranking
    const rankedScores = await this.ranker.rank(uniqueCandidates, normalizedContext);

    // Sort by final score descending
    rankedScores.sort((a, b) => b.finalScore - a.finalScore);

    // 5. Diversity Adjustment & Truncation (Placeholder for brand/category spread logic)
    const diversifiedIds = this.applyDiversity(rankedScores.map(s => s.productId), metadataMap);
    
    // Strictly slice to UI required limit
    const finalIds = diversifiedIds.slice(0, normalizedContext.limit);

    return {
      context: normalizedContext,
      recommendedProductIds: finalIds,
      type: requestedTypes[0], // Primary type
      reasons: {}, // Hydrated based on strategy logic
      generatedAt: new Date()
    };
  }

  private applyDiversity(sortedIds: string[], metadataMap: Record<string, any>): string[] {
    // Future AI step: Ensure not all top 14 items share the exact same category
    return sortedIds;
  }

  private emptyResult(context: RecommendationContext): RecommendationResult {
    return {
      context,
      recommendedProductIds: [],
      type: RecommendationType.SIMILAR_PRODUCTS,
      reasons: {},
      generatedAt: new Date()
    };
  }
}