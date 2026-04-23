import type { SearchFilters, SearchResult } from '@/types/dictionary';

export const defaultSearchFilters: SearchFilters = {
  partOfSpeech: 'all',
  startsWith: '',
  endsWith: '',
  minLength: undefined,
  maxLength: undefined,
};

export interface DictionaryState {
  isReady: boolean;
  totalWords: number;
  query: string;
  wildcardQuery: string;
  searchMode: 'prefix' | 'fuzzy' | 'empty';
  results: SearchResult[];
  filters: SearchFilters;
  favorites: string[];
  history: string[];
  wordOfDay: string;
}

export type DictionaryAction =
  | { type: 'SET_READY'; payload: boolean }
  | { type: 'SET_TOTAL_WORDS'; payload: number }
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_WILDCARD_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: SearchFilters }
  | { type: 'SET_RESULTS'; payload: { mode: DictionaryState['searchMode']; results: SearchResult[] } }
  | { type: 'HYDRATE_PERSISTED'; payload: { favorites: string[]; history: string[]; wordOfDay: string } }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'ADD_HISTORY'; payload: string }
  | { type: 'SET_WORD_OF_DAY'; payload: string };

export const initialDictionaryState: DictionaryState = {
  isReady: false,
  totalWords: 0,
  query: '',
  wildcardQuery: 'c_t',
  searchMode: 'empty',
  results: [],
  filters: defaultSearchFilters,
  favorites: [],
  history: [],
  wordOfDay: '',
};

export function dictionaryReducer(
  state: DictionaryState,
  action: DictionaryAction
): DictionaryState {
  switch (action.type) {
    case 'SET_READY':
      return { ...state, isReady: action.payload };
    case 'SET_TOTAL_WORDS':
      return { ...state, totalWords: action.payload };
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_WILDCARD_QUERY':
      return { ...state, wildcardQuery: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_RESULTS':
      return { ...state, searchMode: action.payload.mode, results: action.payload.results };
    case 'HYDRATE_PERSISTED':
      return {
        ...state,
        favorites: action.payload.favorites,
        history: action.payload.history,
        wordOfDay: action.payload.wordOfDay,
      };
    case 'TOGGLE_FAVORITE': {
      const word = action.payload.toLowerCase();
      const exists = state.favorites.includes(word);
      if (exists) {
        return { ...state, favorites: state.favorites.filter((item) => item !== word) };
      }
      return { ...state, favorites: [...state.favorites, word].sort((a, b) => a.localeCompare(b)) };
    }
    case 'ADD_HISTORY': {
      const word = action.payload.toLowerCase();
      const next = [word, ...state.history.filter((item) => item !== word)];
      return { ...state, history: next.slice(0, 25) };
    }
    case 'SET_WORD_OF_DAY':
      return { ...state, wordOfDay: action.payload.toLowerCase() };
    default:
      return state;
  }
}
