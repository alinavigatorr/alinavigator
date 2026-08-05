export interface CandidateDocument {
    id: string;
    source: 'KEYWORD' | 'VECTOR' | 'RECOMMENDATION';
    rawScore: number;
    metadata: Record<string, any>;
  }
  
  export interface HybridScore {
    documentId: string;
    finalScore: number;
    components: {
      textScore: number;
      vectorScore: number;
      businessBoost: number;
      recommendationWeight: number;
    };
  }
  
  export class RankingOrchestrator {
    public rank(candidates: CandidateDocument[]): HybridScore[] {
      // 1. Group candidates by ID to merge multi-source hits
      const mergedMap = new Map<string, HybridScore>();
  
      for (const doc of candidates) {
        let scoreObj = mergedMap.get(doc.id) || this.createEmptyScore(doc.id);
  
        // 2. Base Normalization (Min-Max or RRF placeholder)
        if (doc.source === 'KEYWORD') scoreObj.components.textScore += doc.rawScore;
        if (doc.source === 'VECTOR') scoreObj.components.vectorScore += doc.rawScore;
        if (doc.source === 'RECOMMENDATION') scoreObj.components.recommendationWeight += 1.5; // Boost if it was also a recommended item
  
        // 3. Apply Phase 2 Business Signals
        const isPopular = doc.metadata.salesCount > 100;
        const daysOld = (new Date().getTime() - new Date(doc.metadata.updatedAt || Date.now()).getTime()) / 86400000;
        
        const popularityBoost = isPopular ? 1.2 : 1.0;
        const freshnessBoost = daysOld < 30 ? 1.1 : 1.0;
        
        scoreObj.components.businessBoost = popularityBoost * freshnessBoost;
  
        mergedMap.set(doc.id, scoreObj);
      }
  
      // 4. Final Calculation
      const finalScores = Array.from(mergedMap.values()).map(score => {
        const baseCombined = (score.components.textScore * 0.4) + (score.components.vectorScore * 0.6);
        score.finalScore = baseCombined * score.components.businessBoost * (score.components.recommendationWeight || 1.0);
        return score;
      });
  
      return finalScores.sort((a, b) => b.finalScore - a.finalScore);
    }
  
    private createEmptyScore(id: string): HybridScore {
      return {
        documentId: id,
        finalScore: 0,
        components: { textScore: 0, vectorScore: 0, businessBoost: 1, recommendationWeight: 1 }
      };
    }
  }