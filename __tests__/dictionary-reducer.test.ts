import {
  dictionaryReducer,
  initialDictionaryState,
  type DictionaryState,
} from '@/store/dictionary-reducer';

function withState(patch: Partial<DictionaryState>): DictionaryState {
  return { ...initialDictionaryState, ...patch };
}

describe('dictionaryReducer', () => {
  it('toggles favorite membership', () => {
    const first = dictionaryReducer(withState({ favorites: [] }), {
      type: 'TOGGLE_FAVORITE',
      payload: 'trie',
    });
    expect(first.favorites).toEqual(['trie']);

    const second = dictionaryReducer(first, {
      type: 'TOGGLE_FAVORITE',
      payload: 'trie',
    });
    expect(second.favorites).toEqual([]);
  });

  it('adds recent word to history and deduplicates', () => {
    const first = dictionaryReducer(withState({ history: ['cat', 'code'] }), {
      type: 'ADD_HISTORY',
      payload: 'cat',
    });
    expect(first.history).toEqual(['cat', 'code']);

    const second = dictionaryReducer(first, {
      type: 'ADD_HISTORY',
      payload: 'trie',
    });
    expect(second.history[0]).toBe('trie');
  });
});
