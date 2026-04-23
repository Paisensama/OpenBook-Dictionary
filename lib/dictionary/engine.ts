import { levenshteinDistance } from '@/lib/algorithms/levenshtein';
import { Trie } from '@/lib/algorithms/trie';
import type { DictionaryEntry, SearchFilters, SearchResult } from '@/types/dictionary';

export interface SearchResponse {
  mode: 'prefix' | 'fuzzy' | 'empty';
  results: SearchResult[];
}

export interface BenchmarkResult {
  trieMs: number;
  naiveMs: number;
  trieCount: number;
  naiveCount: number;
}

const EMPTY_FILTERS: SearchFilters = {
  partOfSpeech: 'all',
  minLength: undefined,
  maxLength: undefined,
  startsWith: '',
  endsWith: '',
};

function nowMs(): number {
  if (typeof globalThis.performance !== 'undefined' && typeof globalThis.performance.now === 'function') {
    return globalThis.performance.now();
  }
  return Date.now();
}

export class DictionaryEngine {
  private readonly entries: DictionaryEntry[];

  private readonly trie: Trie;

  constructor(entries: DictionaryEntry[]) {
    this.entries = entries.map((entry) => ({
      ...entry,
      word: entry.word.toLowerCase(),
    }));

    this.trie = new Trie();
    for (const entry of this.entries) {
      this.trie.insert(entry.word, entry);
    }
  }

  get totalWords(): number {
    return this.entries.length;
  }

  getEntry(word: string): DictionaryEntry | null {
    return this.trie.search(word.toLowerCase().trim());
  }

  search(query: string, limit = 20, filters: SearchFilters = EMPTY_FILTERS): SearchResponse {
    const normalized = query.toLowerCase().trim();
    const normalizedFilters = this.normalizeFilters(filters);
    const hasFilters = this.hasActiveFilters(normalizedFilters);

    if (!normalized) {
      if (!hasFilters) {
        return { mode: 'empty', results: [] };
      }
      const filtered = this.applyFilters(this.entries, normalizedFilters).slice(0, limit);
      return { mode: filtered.length > 0 ? 'prefix' : 'empty', results: filtered };
    }

    const prefix = this.applyFilters(this.trie.autocomplete(normalized, Math.max(100, limit * 6)), normalizedFilters);
    if (prefix.length > 0) {
      return { mode: 'prefix', results: prefix.slice(0, limit) };
    }

    if (normalized.length < 2) {
      return { mode: 'empty', results: [] };
    }

    const fuzzy = this.applyFilters(this.fuzzySearch(normalized, Math.max(80, limit * 4)), normalizedFilters);
    return { mode: 'fuzzy', results: fuzzy.slice(0, limit) };
  }

  relatedWords(word: string, limit = 8): DictionaryEntry[] {
    const normalized = word.toLowerCase().trim();
    const source = this.getEntry(normalized);
    if (!source) {
      return [];
    }

    const seen = new Set<string>([normalized]);
    const related: DictionaryEntry[] = [];

    const pushUnique = (entries: DictionaryEntry[]) => {
      for (const entry of entries) {
        if (related.length >= limit) {
          return;
        }
        if (!seen.has(entry.word)) {
          seen.add(entry.word);
          related.push(entry);
        }
      }
    };

    const prefixSeed = normalized.slice(0, Math.min(3, normalized.length));
    pushUnique(this.trie.autocomplete(prefixSeed, limit * 4));

    const fuzzy = this.fuzzySearch(normalized, limit * 4).filter((entry) => entry.word !== normalized);
    pushUnique(fuzzy);

    const samePart = this.entries
      .filter((entry) => entry.word !== normalized && entry.partOfSpeech === source.partOfSpeech)
      .slice(0, limit * 3);
    pushUnique(samePart);

    return related.slice(0, limit);
  }

  wildcardSearch(pattern: string, limit = 20): DictionaryEntry[] {
    return this.trie.wildcardSearch(pattern, '_', limit);
  }

  benchmark(prefix: string, limit = 50): BenchmarkResult {
    const normalized = prefix.toLowerCase().trim();
    const trieStart = nowMs();
    const trieResults = this.trie.autocomplete(normalized, limit);
    const trieMs = nowMs() - trieStart;

    const naiveStart = nowMs();
    const naiveResults = this.entries
      .filter((entry) => entry.word.startsWith(normalized))
      .sort((a, b) => a.word.localeCompare(b.word))
      .slice(0, limit);
    const naiveMs = nowMs() - naiveStart;

    return {
      trieMs,
      naiveMs,
      trieCount: trieResults.length,
      naiveCount: naiveResults.length,
    };
  }

  private fuzzySearch(query: string, limit: number): SearchResult[] {
    const maxDistance = query.length <= 6 ? 2 : 3;
    const candidates: SearchResult[] = [];

    for (const entry of this.entries) {
      if (entry.word[0] !== query[0]) {
        continue;
      }

      if (Math.abs(entry.word.length - query.length) > maxDistance) {
        continue;
      }

      const distance = levenshteinDistance(query, entry.word);
      if (distance <= maxDistance) {
        candidates.push({
          ...entry,
          score: distance,
        });
      }
    }

    return candidates
      .sort((a, b) => {
        if ((a.score ?? 0) !== (b.score ?? 0)) {
          return (a.score ?? 0) - (b.score ?? 0);
        }
        if (a.partOfSpeech !== b.partOfSpeech) {
          if (a.partOfSpeech === 'other') {
            return 1;
          }
          if (b.partOfSpeech === 'other') {
            return -1;
          }
        }
        return a.word.localeCompare(b.word);
      })
      .slice(0, limit);
  }

  private normalizeFilters(filters: SearchFilters): SearchFilters {
    const minLength = typeof filters.minLength === 'number' && Number.isFinite(filters.minLength)
      ? Math.max(1, Math.floor(filters.minLength))
      : undefined;
    const maxLength = typeof filters.maxLength === 'number' && Number.isFinite(filters.maxLength)
      ? Math.max(1, Math.floor(filters.maxLength))
      : undefined;

    return {
      partOfSpeech: filters.partOfSpeech ?? 'all',
      startsWith: (filters.startsWith ?? '').toLowerCase().trim(),
      endsWith: (filters.endsWith ?? '').toLowerCase().trim(),
      minLength,
      maxLength,
    };
  }

  private hasActiveFilters(filters: SearchFilters): boolean {
    return Boolean(
      (filters.partOfSpeech && filters.partOfSpeech !== 'all') ||
        filters.startsWith ||
        filters.endsWith ||
        filters.minLength ||
        filters.maxLength
    );
  }

  private applyFilters(entries: DictionaryEntry[], filters: SearchFilters): DictionaryEntry[] {
    return entries.filter((entry) => {
      if (filters.partOfSpeech && filters.partOfSpeech !== 'all' && entry.partOfSpeech !== filters.partOfSpeech) {
        return false;
      }
      if (filters.startsWith && !entry.word.startsWith(filters.startsWith)) {
        return false;
      }
      if (filters.endsWith && !entry.word.endsWith(filters.endsWith)) {
        return false;
      }
      if (filters.minLength && entry.word.length < filters.minLength) {
        return false;
      }
      if (filters.maxLength && entry.word.length > filters.maxLength) {
        return false;
      }
      return true;
    });
  }
}
