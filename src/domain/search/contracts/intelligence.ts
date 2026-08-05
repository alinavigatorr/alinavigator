import { AnalyzedQuery } from '../entities/SearchIntent';

export interface IQueryAnalyzer {
  analyze(rawQuery: string): Promise<AnalyzedQuery>;
  detectLanguage(text: string): string;
  removeStopWords(tokens: string[]): string[];
}

export interface ISynonymProvider {
  getSynonyms(term: string): Promise<string[]>;
  getCategoryAliases(category: string): Promise<string[]>;
  getBrandAliases(brand: string): Promise<string[]>;
}

export interface ISpellCorrectionProvider {
  detectTypos(tokens: string[]): Promise<string[]>;
  suggestCorrections(term: string): Promise<string[]>;
}

export interface ISearchCacheStrategy {
  generateQueryKey(analyzedQuery: AnalyzedQuery, filters: any): string;
  get(key: string): Promise<any | null>;
  set(key: string, data: any, ttlSeconds: number): Promise<void>;
  invalidateByEntity(entityId: string): Promise<void>;
}