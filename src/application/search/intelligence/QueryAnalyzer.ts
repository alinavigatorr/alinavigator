import { IQueryAnalyzer, ISynonymProvider, ISpellCorrectionProvider } from '../../../domain/search/contracts/intelligence';
import { AnalyzedQuery, SearchIntent, SearchIntentType } from '../../../domain/search/entities/SearchIntent';

export class QueryAnalyzer implements IQueryAnalyzer {
  constructor(
    private readonly spellChecker: ISpellCorrectionProvider,
    private readonly synonymEngine: ISynonymProvider
  ) {}

  public async analyze(rawQuery: string): Promise<AnalyzedQuery> {
    const language = this.detectLanguage(rawQuery);
    const normalizedText = rawQuery.trim().toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '');
    let tokens = normalizedText.split(/\s+/);
    
    tokens = this.removeStopWords(tokens);
    
    // Typo Correction (maintaining original intent)
    const correctedTokens = await this.spellChecker.detectTypos(tokens);
    
    // Synonym Expansion
    let expandedSynonyms: string[] = [];
    for (const token of correctedTokens) {
      const syns = await this.synonymEngine.getSynonyms(token);
      expandedSynonyms.push(...syns);
    }

    const intent = this.detectIntent(correctedTokens);

    return {
      originalRawTerm: rawQuery,
      normalizedTokens: tokens,
      correctedTokens,
      expandedSynonyms: Array.from(new Set(expandedSynonyms)),
      intent,
      language,
      isFuzzyRequired: rawQuery !== correctedTokens.join(' ')
    };
  }

  public detectLanguage(text: string): string {
    // Placeholder for lightweight language detection (e.g., franc, cld3)
    return 'fa'; 
  }

  public removeStopWords(tokens: string[]): string[] {
    const stopWords = new Set(['از', 'به', 'در', 'با', 'برای', 'the', 'in', 'for', 'a', 'an']);
    return tokens.filter(token => !stopWords.has(token));
  }

  private detectIntent(tokens: string[]): SearchIntent {
    // Basic heuristic intent detection (to be replaced by AI)
    let type = SearchIntentType.UNKNOWN;
    let confidence = 0.5;

    // Example logic: if token matches known categories in cache
    if (tokens.includes('موبایل') || tokens.includes('لپتاپ')) {
      type = SearchIntentType.CATEGORY;
      confidence = 0.8;
    }

    return {
      type,
      confidenceScore: confidence,
      extractedEntities: {}
    };
  }
}