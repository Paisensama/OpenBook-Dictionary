import { levenshteinDistance } from '@/lib/algorithms/levenshtein';

describe('levenshteinDistance', () => {
  it('returns 0 for equal words', () => {
    expect(levenshteinDistance('trie', 'trie')).toBe(0);
  });

  it('computes classic kitten/sitting distance', () => {
    expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
  });

  it('is case insensitive', () => {
    expect(levenshteinDistance('React', 'react')).toBe(0);
  });
});
