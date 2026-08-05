import { SearchDocument, SearchScore, SearchQuery } from '../../../domain/search/entities';
import { SearchConfiguration } from '../../../domain/search/config/SearchConfig';
import { IRankingProvider } from '../../../domain/search/contracts/providers';

export interface RankingStage {
  apply(doc: SearchDocument, currentScore: SearchScore, context: any): SearchScore;
}

export class KeywordMatchStage implements RankingStage {
  apply(doc: SearchDocument, score: SearchScore, context: any): SearchScore {
    return { ...score, keywordScore: context.baseKeywordMatch || 0 };
  }
}

export class SemanticScoreStage implements RankingStage {
  apply(doc: SearchDocument, score: SearchScore, context: any): SearchScore {
    // در فاز بعدی بر اساس وکتورها محاسبه می‌شود
    return { ...score, semanticScore: context.vectorSimilarity || 0 };
  }
}

export class CategoryBoostStage implements RankingStage {
  apply(doc: SearchDocument, score: SearchScore, context: { config: SearchConfiguration, targetCategory?: string }): SearchScore {
    const boost = doc.metadata.category === context.targetCategory ? context.config.boosts.categoryMatch : 1;
    return { ...score, categoryBoost: boost };
  }
}

export class PopularityBoostStage implements RankingStage {
  apply(doc: SearchDocument, score: SearchScore, context: { config: SearchConfiguration }): SearchScore {
    const isPopular = doc.metadata.salesCount > 100;
    return { ...score, popularityBoost: isPopular ? context.config.boosts.highPopularity : 1 };
  }
}

export class FreshnessBoostStage implements RankingStage {
  apply(doc: SearchDocument, score: SearchScore, context: { config: SearchConfiguration }): SearchScore {
    const daysOld = (new Date().getTime() - new Date(doc.updatedAt).getTime()) / (1000 * 3600 * 24);
    const boost = daysOld < 30 ? context.config.boosts.recentFreshness : 1;
    return { ...score, freshnessBoost: boost };
  }
}

export class RankingPipeline implements IRankingProvider {
  private stages: RankingStage[] = [
    new KeywordMatchStage(),
    new SemanticScoreStage(),
    new CategoryBoostStage(),
    new PopularityBoostStage(),
    new FreshnessBoostStage()
  ];

  rank(query: SearchQuery, documents: SearchDocument[], config: SearchConfiguration): SearchScore[] {
    return documents.map(doc => {
      let score: SearchScore = {
        documentId: doc.id,
        baseScore: 1,
        keywordScore: 0,
        semanticScore: 0,
        categoryBoost: 1,
        popularityBoost: 1,
        freshnessBoost: 1,
        totalScore: 0
      };

      for (const stage of this.stages) {
        score = stage.apply(doc, score, { query, config });
      }

      const weightedBase = 
        (score.keywordScore * config.weights.keywordMatch) + 
        (score.semanticScore * config.weights.semanticMatch);

      score.totalScore = weightedBase * score.categoryBoost * score.popularityBoost * score.freshnessBoost;

      return score;
    });
  }
}