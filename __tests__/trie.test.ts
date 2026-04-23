import { Trie } from '@/lib/algorithms/trie';
import type { DictionaryEntry } from '@/types/dictionary';

const baseEntries: DictionaryEntry[] = [
  { word: 'cat', definition: 'cat', partOfSpeech: 'noun' },
  { word: 'cot', definition: 'cot', partOfSpeech: 'noun' },
  { word: 'cut', definition: 'cut', partOfSpeech: 'verb' },
  { word: 'code', definition: 'code', partOfSpeech: 'noun' },
];

function buildTrie(): Trie {
  const trie = new Trie();
  for (const entry of baseEntries) {
    trie.insert(entry.word, entry);
  }
  return trie;
}

describe('Trie', () => {
  it('finds exact words after insert', () => {
    const trie = buildTrie();
    expect(trie.search('cat')?.word).toBe('cat');
    expect(trie.search('missing')).toBeNull();
  });

  it('returns autocomplete results by prefix with limit', () => {
    const trie = buildTrie();
    const results = trie.autocomplete('c', 2);
    expect(results).toHaveLength(2);
    expect(results[0].word).toBe('cat');
  });

  it('supports wildcard pattern search', () => {
    const trie = buildTrie();
    const words = trie.wildcardSearch('c_t').map((entry) => entry.word);
    expect(words).toEqual(['cat', 'cot', 'cut']);
  });

  it('supports question-mark wildcard alias', () => {
    const trie = buildTrie();
    const words = trie.wildcardSearch('c?t').map((entry) => entry.word);
    expect(words).toEqual(['cat', 'cot', 'cut']);
  });

  it('supports star wildcard for flexible length', () => {
    const trie = buildTrie();
    const words = trie.wildcardSearch('c*e').map((entry) => entry.word);
    expect(words).toEqual(['code']);
  });

  it('ignores whitespace in wildcard pattern', () => {
    const trie = buildTrie();
    const words = trie.wildcardSearch(' c _ t ').map((entry) => entry.word);
    expect(words).toEqual(['cat', 'cot', 'cut']);
  });
});
