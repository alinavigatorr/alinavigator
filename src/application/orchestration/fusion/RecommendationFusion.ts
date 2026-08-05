import { RecommendationContext, RecommendationType } from '../../../domain/recommendation/entities/RecommendationDomain';
import { IRecommendationProvider } from '../../../domain/recommendation/contracts/IRecommendationProviders';

export class RecommendationFusion {
  constructor(private readonly recommendationProvider: IRecommendationProvider) {}

  public async fetchContextualInjections(queryIntent: any, searchContext: any): Promise<string[]> {
    const recContext: RecommendationContext = {
      userId: searchContext.userId,
      sessionId: searchContext.sessionId,
      limit: 14 // Enforcing exact grid layout constraints for fusion candidates
    };

    let activeTypes: RecommendationType[] = [];

    // Map search intent to recommendation strategies
    if (queryIntent.type === 'CATEGORY') {
      activeTypes = [RecommendationType.POPULAR_IN_CATEGORY, RecommendationType.TRENDING];
    } else if (queryIntent.type === 'PRODUCT') {
      activeTypes = [RecommendationType.SIMILAR_PRODUCTS, RecommendationType.FREQUENTLY_BOUGHT_TOGETHER];
    } else {
      activeTypes = [RecommendationType.PERSONALIZED, RecommendationType.NEW_ARRIVALS];
    }

    const result = await this.recommendationProvider.getRecommendations(recContext, activeTypes);
    return result.recommendedProductIds;
  }
}