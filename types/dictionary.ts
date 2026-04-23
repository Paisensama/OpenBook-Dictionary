export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'interjection'
  | 'other';

export interface DictionaryEntry {
  word: string;
  definition: string;
  partOfSpeech: PartOfSpeech;
  details?: string;
  example?: string;
  usageTip?: string;
  pronunciation?: string;
  syllables?: string[];
}

export interface SearchResult extends DictionaryEntry {
  score?: number;
}

export interface SearchFilters {
  partOfSpeech: PartOfSpeech | 'all';
  minLength?: number;
  maxLength?: number;
  startsWith?: string;
  endsWith?: string;
}
