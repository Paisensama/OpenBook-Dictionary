import { DictionaryEngine } from '@/lib/dictionary/engine';
import type { DictionaryEntry } from '@/types/dictionary';

const entries: DictionaryEntry[] = [
  { word: 'cat', definition: 'cat', partOfSpeech: 'noun' },
  { word: 'cot', definition: 'cot', partOfSpeech: 'noun' },
  { word: 'cut', definition: 'cut', partOfSpeech: 'verb' },
  { word: 'trie', definition: 'trie', partOfSpeech: 'noun' },
  { word: 'tree', definition: 'tree', partOfSpeech: 'noun' },
];

describe('DictionaryEngine', () => {
  it('uses fuzzy mode for misspelled words', () => {
    const engine = new DictionaryEngine(entries);
    const response = engine.search('ct', 5);
    expect(response.mode).toBe('fuzzy');
    expect(response.results.some((entry) => entry.word === 'cat')).toBe(true);
  });

  it('returns benchmark metrics', () => {
    const engine = new DictionaryEngine(entries);
    const result = engine.benchmark('tr', 5);
    expect(result.trieCount).toBe(result.naiveCount);
    expect(result.trieMs).toBeGreaterThanOrEqual(0);
    expect(result.naiveMs).toBeGreaterThanOrEqual(0);
  });

  it('applies advanced filters when searching', () => {
    const engine = new DictionaryEngine(entries);
    const response = engine.search('', 10, {
      partOfSpeech: 'noun',
      startsWith: 'c',
      minLength: 3,
    });

    expect(response.results.length).toBeGreaterThan(0);
    expect(response.results.every((item) => item.partOfSpeech === 'noun')).toBe(true);
    expect(response.results.every((item) => item.word.startsWith('c'))).toBe(true);
    expect(response.results.every((item) => item.word.length >= 3)).toBe(true);
  });

  it('returns related words excluding the source word', () => {
    const engine = new DictionaryEngine(entries);
    const related = engine.relatedWords('trie', 5);

    expect(related.length).toBeGreaterThan(0);
    expect(related.some((item) => item.word === 'trie')).toBe(false);
  });
});
