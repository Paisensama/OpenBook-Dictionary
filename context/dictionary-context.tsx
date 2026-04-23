import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';

import { fetchDictionaryApiEntry } from '@/lib/api/dictionary-api';
import { buildCorpus } from '@/lib/dictionary/corpus';
import { type BenchmarkResult, DictionaryEngine } from '@/lib/dictionary/engine';
import { readStringArray, StorageKeys, writeStringArray } from '@/lib/storage/persistence';
import { safeGetItem, safeSetItem } from '@/lib/storage/safe-storage';
import {
  defaultSearchFilters,
  dictionaryReducer,
  initialDictionaryState,
  type DictionaryState,
} from '@/store/dictionary-reducer';
import type { DictionaryEntry, SearchFilters, SearchResult } from '@/types/dictionary';

interface DictionaryContextValue {
  state: DictionaryState;
  search: (query: string, filters?: SearchFilters) => void;
  setSearchFilters: (filters: SearchFilters) => void;
  clearSearchFilters: () => void;
  refreshWordOfDay: () => Promise<void>;
  setWildcardQuery: (pattern: string) => void;
  wildcardSearch: (pattern: string) => DictionaryEntry[];
  getEntry: (word: string) => DictionaryEntry | null;
  hydrateOnlineEntry: (word: string) => Promise<void>;
  getRelatedWords: (word: string, limit?: number) => DictionaryEntry[];
  toggleFavorite: (word: string) => void;
  openWord: (word: string) => void;
  isFavorite: (word: string) => boolean;
  getFavoritesEntries: () => DictionaryEntry[];
  getHistoryEntries: () => DictionaryEntry[];
  runBenchmark: (prefix: string) => BenchmarkResult;
}

const DictionaryContext = createContext<DictionaryContextValue | null>(null);

function computeWordOfDay(entries: DictionaryEntry[], seedDateIso: string): string {
  if (entries.length === 0) {
    return 'algorithm';
  }
  const day = Number(seedDateIso.replaceAll('-', ''));
  const index = day % entries.length;
  return entries[index]?.word ?? 'algorithm';
}

export function DictionaryProvider({ children }: { children: React.ReactNode }) {
  const entries = useMemo(() => buildCorpus(60_000), []);
  const engine = useMemo(() => new DictionaryEngine(entries), [entries]);
  const [state, dispatch] = useReducer(dictionaryReducer, initialDictionaryState);
  const [onlineEntries, setOnlineEntries] = useState<Record<string, DictionaryEntry>>({});
  const onlineInFlight = useRef<Map<string, Promise<void>>>(new Map());

  useEffect(() => {
    dispatch({ type: 'SET_TOTAL_WORDS', payload: engine.totalWords });
  }, [engine.totalWords]);

  useEffect(() => {
    const loadPersisted = async () => {
      const [favorites, history, savedDate, savedWord] = await Promise.all([
        readStringArray(StorageKeys.favorites),
        readStringArray(StorageKeys.history),
        safeGetItem(StorageKeys.wordOfDayDate),
        safeGetItem(StorageKeys.wordOfDayWord),
      ]);

      const today = new Date().toISOString().slice(0, 10);
      let wordOfDay = savedWord ?? '';

      if (!savedWord || savedDate !== today) {
        wordOfDay = computeWordOfDay(entries, today);
        await Promise.all([
          safeSetItem(StorageKeys.wordOfDayDate, today),
          safeSetItem(StorageKeys.wordOfDayWord, wordOfDay),
        ]);
      }

      dispatch({
        type: 'HYDRATE_PERSISTED',
        payload: { favorites, history, wordOfDay },
      });
      dispatch({ type: 'SET_READY', payload: true });
    };

    void loadPersisted();
  }, [engine, entries]);

  useEffect(() => {
    if (!state.isReady) {
      return;
    }
    void writeStringArray(StorageKeys.favorites, state.favorites);
  }, [state.favorites, state.isReady]);

  useEffect(() => {
    if (!state.isReady) {
      return;
    }
    void writeStringArray(StorageKeys.history, state.history);
  }, [state.history, state.isReady]);

  const search = useCallback(
    (query: string, filters?: SearchFilters) => {
      const effectiveFilters = filters ?? state.filters;
      dispatch({ type: 'SET_QUERY', payload: query });
      const response = engine.search(query, 25, effectiveFilters);
      dispatch({
        type: 'SET_RESULTS',
        payload: {
          mode: response.mode,
          results: response.results as SearchResult[],
        },
      });
    },
    [engine, state.filters]
  );

  const setSearchFilters = useCallback((filters: SearchFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const clearSearchFilters = useCallback(() => {
    dispatch({ type: 'SET_FILTERS', payload: defaultSearchFilters });
  }, []);

  const refreshWordOfDay = useCallback(async () => {
    if (entries.length === 0) {
      return;
    }
    const index = Date.now() % entries.length;
    const nextWord = entries[index]?.word ?? 'algorithm';
    const today = new Date().toISOString().slice(0, 10);
    dispatch({ type: 'SET_WORD_OF_DAY', payload: nextWord });
    await Promise.all([
      safeSetItem(StorageKeys.wordOfDayDate, today),
      safeSetItem(StorageKeys.wordOfDayWord, nextWord),
    ]);
  }, [entries]);

  const setWildcardQuery = useCallback((pattern: string) => {
    dispatch({ type: 'SET_WILDCARD_QUERY', payload: pattern });
  }, []);

  const wildcardSearch = useCallback((pattern: string) => engine.wildcardSearch(pattern, 25), [engine]);
  const getEntry = useCallback(
    (word: string) => {
      const normalized = word.toLowerCase().trim();
      return onlineEntries[normalized] ?? engine.getEntry(normalized);
    },
    [engine, onlineEntries]
  );
  const hydrateOnlineEntry = useCallback(async (word: string) => {
    const normalized = word.toLowerCase().trim();
    if (!normalized || onlineEntries[normalized]) {
      return;
    }
    const existingTask = onlineInFlight.current.get(normalized);
    if (existingTask) {
      await existingTask;
      return;
    }

    const task = (async () => {
      const onlineEntry = await fetchDictionaryApiEntry(normalized);
      if (onlineEntry) {
        setOnlineEntries((prev) => {
          if (prev[normalized]) {
            return prev;
          }
          return { ...prev, [normalized]: onlineEntry };
        });
      }
    })();

    onlineInFlight.current.set(normalized, task);
    try {
      await task;
    } finally {
      onlineInFlight.current.delete(normalized);
    }
  }, [onlineEntries]);
  const getRelatedWords = useCallback((word: string, limit = 8) => engine.relatedWords(word, limit), [engine]);
  const toggleFavorite = useCallback((word: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: word });
  }, []);
  const openWord = useCallback((word: string) => {
    dispatch({ type: 'ADD_HISTORY', payload: word });
  }, []);
  const isFavorite = useCallback(
    (word: string) => state.favorites.includes(word.toLowerCase()),
    [state.favorites]
  );
  const getFavoritesEntries = useCallback(
    () =>
      state.favorites
        .map((word) => engine.getEntry(word))
        .filter((entry): entry is DictionaryEntry => Boolean(entry)),
    [engine, state.favorites]
  );
  const getHistoryEntries = useCallback(
    () =>
      state.history
        .map((word) => engine.getEntry(word))
        .filter((entry): entry is DictionaryEntry => Boolean(entry)),
    [engine, state.history]
  );
  const runBenchmark = useCallback((prefix: string) => engine.benchmark(prefix, 100), [engine]);

  const value: DictionaryContextValue = useMemo(
    () => ({
      state,
      search,
      setSearchFilters,
      clearSearchFilters,
      refreshWordOfDay,
      setWildcardQuery,
      wildcardSearch,
      getEntry,
      hydrateOnlineEntry,
      getRelatedWords,
      toggleFavorite,
      openWord,
      isFavorite,
      getFavoritesEntries,
      getHistoryEntries,
      runBenchmark,
    }),
    [
      state,
      search,
      setSearchFilters,
      clearSearchFilters,
      refreshWordOfDay,
      setWildcardQuery,
      wildcardSearch,
      getEntry,
      hydrateOnlineEntry,
      getRelatedWords,
      toggleFavorite,
      openWord,
      isFavorite,
      getFavoritesEntries,
      getHistoryEntries,
      runBenchmark,
    ]
  );

  return <DictionaryContext.Provider value={value}>{children}</DictionaryContext.Provider>;
}

export function useDictionary(): DictionaryContextValue {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error('useDictionary must be used inside DictionaryProvider');
  }
  return context;
}
