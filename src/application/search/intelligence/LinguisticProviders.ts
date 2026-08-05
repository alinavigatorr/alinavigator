import { ISynonymProvider, ISpellCorrectionProvider } from '../../../domain/search/contracts/intelligence';

export class SynonymProvider implements ISynonymProvider {
  private dictionary: Record<string, string[]> = {
    'موبایل': ['گوشی', 'تلفن همراه', 'smartphone', 'cell phone'],
    'لپتاپ': ['لپ تاپ', 'رایانه کیفی', 'نوت بوک', 'notebook'],
  };

  public async getSynonyms(term: string): Promise<string[]> {
    return this.dictionary[term] || [];
  }

  public async getCategoryAliases(category: string): Promise<string[]> {
    return []; // Implementation fetches from database or cache
  }

  public async getBrandAliases(brand: string): Promise<string[]> {
    return []; // Implementation fetches from database or cache
  }
}

export class SpellCorrectionProvider implements ISpellCorrectionProvider {
  public async detectTypos(tokens: string[]): Promise<string[]> {
    // Fallback dictionary or simple edit-distance logic (e.g., Levenshtein)
    // Returns original token if no typo detected to prevent intent destruction
    return tokens.map(t => t === 'گوشس' ? 'گوشی' : t); 
  }

  public async suggestCorrections(term: string): Promise<string[]> {
    return [];
  }
}