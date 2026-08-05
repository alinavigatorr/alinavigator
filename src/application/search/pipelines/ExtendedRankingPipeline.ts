import { SearchDocument, SearchScore } from '../../../domain/search/entities';
import { RankingStage } from './RankingPipeline'; // Inherits from Phase 1

export class TextRelevanceStage implements RankingStage {
  apply(doc: SearchDocument, score: SearchScore, context: any): SearchScore {
    // Boost if match is in Title (higher weight) vs Description
    return { ...score, keywordScore: score.keywordScore * 1.5 }; 
  }
}

export class InventoryAvailabilityStage implements RankingStage {
  apply(doc: SearchDocument, score: SearchScore, context: any): SearchScore {
    const isOutOfStock = doc.metadata.stock <= 0;
    // Severely penalize out of stock, but do not remove entirely
    const penalty = isOutOfStock ? 0.1 : 1.0; 
    return { ...score, totalScore: score.totalScore * penalty };
  }
}

export class BusinessBoostStage implements RankingStage {
  apply(doc: SearchDocument, score: SearchScore, context: any): SearchScore {
    // Placeholder for Promoted/Sponsored products or High Margin items
    const isPromoted = doc.metadata.isSponsored === true;
    return { ...score, totalScore: score.totalScore * (isPromoted ? 1.2 : 1.0) };
  }
}

export class ConversionSignalStage implements RankingStage {
  apply(doc: SearchDocument, score: SearchScore, context: any): SearchScore {
    // ML placeholder: Historical conversion rate for this specific query
    const conversionRate = doc.metadata.historicalQueryConversion || 0.01;
    return { ...score, totalScore: score.totalScore + (conversionRate * 10) };
  }
}