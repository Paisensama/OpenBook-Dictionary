import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChromaticBackdrop } from '@/components/chromatic-backdrop';
import { ThemeToggleChip } from '@/components/theme-toggle-chip';
import type { AppPalette } from '@/constants/app-theme';
import { useDictionary } from '@/context/dictionary-context';
import { useUITheme } from '@/context/ui-theme-context';
import type { SearchFilters } from '@/types/dictionary';

const FILTER_PARTS: Array<{ label: string; value: SearchFilters['partOfSpeech'] }> = [
  { label: 'All', value: 'all' },
  { label: 'Noun', value: 'noun' },
  { label: 'Verb', value: 'verb' },
  { label: 'Adjective', value: 'adjective' },
  { label: 'Adverb', value: 'adverb' },
];

const EMPTY_FILTERS: SearchFilters = {
  partOfSpeech: 'all',
  startsWith: '',
  endsWith: '',
  minLength: undefined,
  maxLength: undefined,
};

export default function SearchScreen() {
  const { palette } = useUITheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const {
    state,
    search,
    setSearchFilters,
    clearSearchFilters,
    refreshWordOfDay,
    wildcardSearch,
    setWildcardQuery,
    isFavorite,
    toggleFavorite,
  } = useDictionary();

  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [startsWithInput, setStartsWithInput] = useState(state.filters.startsWith ?? '');
  const [endsWithInput, setEndsWithInput] = useState(state.filters.endsWith ?? '');
  const [minLengthInput, setMinLengthInput] = useState(
    state.filters.minLength ? String(state.filters.minLength) : ''
  );
  const [maxLengthInput, setMaxLengthInput] = useState(
    state.filters.maxLength ? String(state.filters.maxLength) : ''
  );
  const styles = useMemo(() => createStyles(palette), [palette]);
  const listBottomInset = useMemo(() => Math.max(tabBarHeight + 10, insets.bottom + 24), [tabBarHeight, insets.bottom]);

  const wildcardMatches = useMemo(
    () => wildcardSearch(state.wildcardQuery).slice(0, 8),
    [state.wildcardQuery, wildcardSearch]
  );

  const recentQueries = useMemo(() => state.history.slice(0, 4), [state.history]);
  const normalizedQuery = query.trim().toLowerCase();
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (state.filters.partOfSpeech !== 'all') {
      count += 1;
    }
    if (state.filters.startsWith) {
      count += 1;
    }
    if (state.filters.endsWith) {
      count += 1;
    }
    if (state.filters.minLength) {
      count += 1;
    }
    if (state.filters.maxLength) {
      count += 1;
    }
    return count;
  }, [state.filters]);
  const suggestions = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    const sorted = [...state.results].sort((a, b) => {
      const aStarts = a.word.startsWith(normalizedQuery);
      const bStarts = b.word.startsWith(normalizedQuery);
      if (aStarts !== bStarts) {
        return aStarts ? -1 : 1;
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
    });

    return sorted.slice(0, 6);
  }, [normalizedQuery, state.results]);

  const detailWord = useMemo(() => {
    if (normalizedQuery) {
      return normalizedQuery;
    }
    if (state.results.length > 0) {
      return state.results[0].word;
    }
    if (state.wordOfDay) {
      return state.wordOfDay;
    }
    return 'algorithm';
  }, [normalizedQuery, state.results, state.wordOfDay]);

  const benchmarkSeed = useMemo(() => {
    const typed = query.trim().toLowerCase();
    if (typed.length >= 1) {
      return typed.slice(0, 4);
    }
    if (state.wordOfDay.length >= 1) {
      return state.wordOfDay.slice(0, 4);
    }
    return 'al';
  }, [query, state.wordOfDay]);

  const onChangeQuery = (value: string) => {
    setQuery(value);
    search(value, state.filters);
  };

  const applyFilters = (filters: SearchFilters) => {
    setSearchFilters(filters);
    search(query, filters);
  };

  const updatePartOfSpeech = (partOfSpeech: SearchFilters['partOfSpeech']) => {
    const next = { ...state.filters, partOfSpeech };
    applyFilters(next);
  };

  const applyFieldFilters = () => {
    const minLength = Number.parseInt(minLengthInput, 10);
    const maxLength = Number.parseInt(maxLengthInput, 10);
    const next: SearchFilters = {
      ...state.filters,
      startsWith: startsWithInput.trim().toLowerCase(),
      endsWith: endsWithInput.trim().toLowerCase(),
      minLength: Number.isFinite(minLength) ? minLength : undefined,
      maxLength: Number.isFinite(maxLength) ? maxLength : undefined,
    };
    applyFilters(next);
  };

  const resetAllFilters = () => {
    setStartsWithInput('');
    setEndsWithInput('');
    setMinLengthInput('');
    setMaxLengthInput('');
    clearSearchFilters();
    search(query, EMPTY_FILTERS);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshWordOfDay();
    if (query.trim().length > 0) {
      search(query, state.filters);
    }
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ChromaticBackdrop palette={palette} />
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 72 : 0}>
        <FlatList
          data={state.results}
          keyExtractor={(item) => item.word}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void onRefresh()}
              tintColor={palette.primary}
              colors={[palette.primary]}
              progressBackgroundColor={palette.surface}
            />
          }
          contentContainerStyle={[styles.list, { paddingBottom: listBottomInset }]}
          scrollIndicatorInsets={{ bottom: listBottomInset }}
          ListHeaderComponent={
            <View style={styles.container}>
            <View style={styles.hero}>
              <View style={styles.heroHeader}>
                <Text allowFontScaling={false} style={styles.kicker}>
                  OPENBOOK
                </Text>
                <ThemeToggleChip />
              </View>
              <Text allowFontScaling={false} style={styles.title}>
                Dictionary Studio
              </Text>
              <Text allowFontScaling={false} style={styles.subtitle}>
                {state.totalWords.toLocaleString()} words loaded • mode: {state.searchMode}
              </Text>
              <Text allowFontScaling={false} style={styles.wordOfDay}>
                Word of the day: {state.wordOfDay || 'loading...'}
              </Text>
            </View>

            <View style={styles.searchCard}>
              <View style={styles.searchHeaderRow}>
                <Text allowFontScaling={false} style={styles.sectionLabel}>
                  Search
                </Text>
                <Pressable style={styles.filterMenuButton} onPress={() => setShowFilters((prev) => !prev)}>
                  <MaterialIcons
                    name={showFilters ? 'filter-alt-off' : 'filter-alt'}
                    size={18}
                    color={palette.text}
                    style={styles.filterMenuIcon}
                  />
                  {activeFiltersCount > 0 ? (
                    <View style={styles.filterCountBubble}>
                      <Text allowFontScaling={false} style={styles.filterCountText}>
                        {activeFiltersCount}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              </View>
              <View style={styles.searchInputRow}>
                <Text allowFontScaling={false} style={styles.searchIcon}>
                  🔎
                </Text>
                <TextInput
                  value={query}
                  onChangeText={onChangeQuery}
                  placeholder="Type a word..."
                  placeholderTextColor={palette.mutedText}
                  autoCapitalize="none"
                  style={styles.searchInput}
                  allowFontScaling={false}
                />
                {query.length > 0 ? (
                  <Pressable
                    style={styles.clearButton}
                    onPress={() => {
                      setQuery('');
                      search('', state.filters);
                    }}>
                    <Text allowFontScaling={false} style={styles.clearButtonText}>
                      Clear
                    </Text>
                  </Pressable>
                ) : null}
              </View>
              {normalizedQuery.length > 0 ? (
                <View style={styles.dropdownCard}>
                  {suggestions.length > 0 ? (
                    suggestions.map((entry) => (
                      <Pressable
                        key={entry.word}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setQuery(entry.word);
                          search(entry.word, state.filters);
                          Keyboard.dismiss();
                          router.push(`/word/${entry.word}`);
                        }}>
                        <Text allowFontScaling={false} style={styles.dropdownWord}>
                          {entry.word}
                        </Text>
                        <Text allowFontScaling={false} style={styles.dropdownPart}>
                          {entry.partOfSpeech}
                        </Text>
                      </Pressable>
                    ))
                  ) : (
                    <Text allowFontScaling={false} style={styles.dropdownEmpty}>
                      No suggestions
                    </Text>
                  )}
                </View>
              ) : null}
              {showFilters ? (
                <View style={styles.dropdownFilters}>
                  <Text allowFontScaling={false} style={styles.helper}>
                    Filter by part of speech, length, and pattern.
                  </Text>
                  <View style={styles.posRow}>
                    {FILTER_PARTS.map((item) => (
                      <Pressable
                        key={item.value}
                        onPress={() => updatePartOfSpeech(item.value)}
                        style={[
                          styles.posChip,
                          state.filters.partOfSpeech === item.value ? styles.posChipActive : null,
                        ]}>
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.posChipText,
                            state.filters.partOfSpeech === item.value ? styles.posChipTextActive : null,
                          ]}>
                          {item.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <View style={styles.filterInputRow}>
                    <TextInput
                      value={startsWithInput}
                      onChangeText={setStartsWithInput}
                      placeholder="Starts with"
                      placeholderTextColor={palette.mutedText}
                      autoCapitalize="none"
                      style={styles.filterInput}
                      allowFontScaling={false}
                    />
                    <TextInput
                      value={endsWithInput}
                      onChangeText={setEndsWithInput}
                      placeholder="Ends with"
                      placeholderTextColor={palette.mutedText}
                      autoCapitalize="none"
                      style={styles.filterInput}
                      allowFontScaling={false}
                    />
                  </View>
                  <View style={styles.filterInputRow}>
                    <TextInput
                      value={minLengthInput}
                      onChangeText={setMinLengthInput}
                      placeholder="Min length"
                      placeholderTextColor={palette.mutedText}
                      keyboardType="number-pad"
                      style={styles.filterInput}
                      allowFontScaling={false}
                    />
                    <TextInput
                      value={maxLengthInput}
                      onChangeText={setMaxLengthInput}
                      placeholder="Max length"
                      placeholderTextColor={palette.mutedText}
                      keyboardType="number-pad"
                      style={styles.filterInput}
                      allowFontScaling={false}
                    />
                  </View>
                  <View style={styles.filterButtonRow}>
                    <Pressable style={styles.filterApplyButton} onPress={applyFieldFilters}>
                      <Text allowFontScaling={false} style={styles.filterApplyButtonText}>
                        Apply Filters
                      </Text>
                    </Pressable>
                    <Pressable style={styles.filterResetButton} onPress={resetAllFilters}>
                      <Text allowFontScaling={false} style={styles.filterResetButtonText}>
                        Reset
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : null}
              <View style={styles.buttonRow}>
                <Pressable
                  style={styles.primaryButton}
                  onPress={() =>
                    router.push({
                      pathname: '/benchmark-modal',
                      params: { q: benchmarkSeed },
                    })
                  }>
                  <Text allowFontScaling={false} numberOfLines={1} style={styles.primaryButtonText}>
                    Benchmark
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.secondaryButton}
                  onPress={() => {
                    router.push(`/word/${detailWord}`);
                  }}>
                  <Text allowFontScaling={false} numberOfLines={1} style={styles.secondaryButtonText}>
                    Word Detail
                  </Text>
                </Pressable>
              </View>
              {recentQueries.length > 0 ? (
                <View style={styles.recentRow}>
                  <Text allowFontScaling={false} style={styles.recentLabel}>
                    Recent:
                  </Text>
                  {recentQueries.map((item) => (
                    <Pressable
                      key={item}
                      style={styles.recentChip}
                      onPress={() => {
                        setQuery(item);
                        search(item, state.filters);
                      }}>
                      <Text allowFontScaling={false} style={styles.recentChipText}>
                        {item}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>

            <View style={styles.wildcardCard}>
              <Text allowFontScaling={false} style={styles.sectionLabel}>
                Wildcard Drill
              </Text>
              <Text allowFontScaling={false} style={styles.helper}>
                Use `_` or `?` for one unknown letter, and `*` for zero or more letters.
              </Text>
              <TextInput
                value={state.wildcardQuery}
                onChangeText={setWildcardQuery}
                placeholder="Try c_t"
                placeholderTextColor={palette.mutedText}
                autoCapitalize="none"
                style={styles.input}
                allowFontScaling={false}
              />
              {wildcardMatches.length > 0 ? (
                <View style={styles.wildcardChipsRow}>
                  {wildcardMatches.map((entry) => (
                    <Pressable
                      key={entry.word}
                      style={styles.wildcardChip}
                      onPress={() => router.push(`/word/${entry.word}`)}>
                      <Text allowFontScaling={false} style={styles.wildcardChipText}>
                        {entry.word}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <Text allowFontScaling={false} style={styles.wildcardResult}>
                  No wildcard matches
                </Text>
              )}
            </View>
            <Text allowFontScaling={false} style={styles.resultsTitle}>
              Results
            </Text>
            </View>
          }
          ListEmptyComponent={
            query.length > 0 ? (
              <Text style={styles.empty}>No results yet. Try another spelling or pull to refresh.</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Pressable style={styles.wordButton} onPress={() => router.push(`/word/${item.word}`)}>
                <Text allowFontScaling={false} style={styles.word}>
                  {item.word}
                </Text>
                <Text allowFontScaling={false} style={styles.definition} numberOfLines={2}>
                  {item.definition}
                </Text>
                {typeof item.score === 'number' ? (
                  <Text allowFontScaling={false} style={styles.badge}>
                    edit distance: {item.score}
                  </Text>
                ) : null}
              </Pressable>
              <Pressable style={styles.favoriteButton} onPress={() => void toggleFavorite(item.word)}>
                <Text style={styles.favoriteText}>{isFavorite(item.word) ? '★' : '☆'}</Text>
              </Pressable>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(palette: AppPalette) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: palette.background },
    keyboardWrap: { flex: 1 },
    container: { paddingHorizontal: 16, paddingTop: 14, gap: 14 },
    heroHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
    },
    hero: {
      backgroundColor: palette.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: 14,
      paddingVertical: 14,
      gap: 7,
      ...cardShadow(palette),
    },
    kicker: { fontSize: 10, fontWeight: '900', letterSpacing: 0.8, color: palette.primary, flex: 1 },
    title: { fontSize: 22, fontWeight: '900', color: palette.text, lineHeight: 27 },
    subtitle: { fontSize: 11, color: palette.mutedText, fontWeight: '700', lineHeight: 16 },
    wordOfDay: { color: palette.accent, fontWeight: '800', fontSize: 13, marginTop: 2 },
    searchCard: {
      backgroundColor: palette.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 12,
      gap: 10,
      ...cardShadow(palette),
    },
    wildcardCard: {
      backgroundColor: palette.accentSoft,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 12,
      gap: 9,
      ...cardShadow(palette),
    },
    searchHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
    },
    filterMenuButton: {
      minWidth: 38,
      height: 34,
      borderRadius: 11,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.elevated,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    filterMenuIcon: {
      opacity: 0.92,
    },
    filterCountBubble: {
      position: 'absolute',
      top: -6,
      right: -6,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      paddingHorizontal: 4,
      backgroundColor: palette.primary,
      borderWidth: 1,
      borderColor: palette.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterCountText: {
      color: palette.primaryText,
      fontSize: 10,
      fontWeight: '900',
    },
    dropdownFilters: {
      borderWidth: 1,
      borderColor: palette.border,
      borderRadius: 12,
      padding: 10,
      gap: 8,
      backgroundColor: palette.elevated,
      marginTop: 2,
    },
    filtersBadge: {
      fontSize: 11,
      color: palette.primary,
      fontWeight: '900',
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.elevated,
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 3,
      overflow: 'hidden',
    },
    posRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    posChip: {
      borderWidth: 1,
      borderColor: palette.border,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: palette.elevated,
    },
    posChipActive: {
      backgroundColor: palette.primary,
      borderColor: palette.primary,
    },
    posChipText: {
      color: palette.text,
      fontWeight: '700',
      fontSize: 11.5,
    },
    posChipTextActive: {
      color: palette.primaryText,
    },
    filterInputRow: {
      flexDirection: 'row',
      gap: 8,
    },
    filterInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: palette.border,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
      backgroundColor: palette.elevated,
      color: palette.text,
      fontSize: 13.5,
    },
    filterButtonRow: {
      flexDirection: 'row',
      gap: 8,
    },
    filterApplyButton: {
      flex: 1,
      borderRadius: 10,
      backgroundColor: palette.primary,
      paddingVertical: 10,
      alignItems: 'center',
    },
    filterApplyButtonText: {
      color: palette.primaryText,
      fontWeight: '900',
      fontSize: 12.5,
    },
    filterResetButton: {
      minWidth: 76,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.surface,
      paddingVertical: 10,
      paddingHorizontal: 12,
      alignItems: 'center',
    },
    filterResetButtonText: {
      color: palette.mutedText,
      fontWeight: '800',
      fontSize: 12,
    },
    sectionLabel: { color: palette.text, fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
    helper: { color: palette.mutedText, fontSize: 11.5, lineHeight: 17 },
    input: {
      borderWidth: 1,
      borderColor: palette.border,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: palette.elevated,
      color: palette.text,
      fontSize: 16,
    },
    searchInputRow: {
      borderWidth: 1,
      borderColor: palette.border,
      borderRadius: 14,
      backgroundColor: palette.elevated,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      minHeight: 48,
      gap: 6,
    },
    searchIcon: { fontSize: 14 },
    searchInput: {
      flex: 1,
      color: palette.text,
      fontSize: 16,
      paddingVertical: 10,
    },
    clearButton: {
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: palette.surface,
      borderWidth: 1,
      borderColor: palette.border,
    },
    clearButtonText: {
      fontSize: 11.5,
      fontWeight: '800',
      color: palette.mutedText,
    },
    buttonRow: { flexDirection: 'row', gap: 8 },
    primaryButton: {
      flex: 1,
      borderRadius: 12,
      backgroundColor: palette.primary,
      paddingVertical: 11,
      alignItems: 'center',
    },
    primaryButtonText: { color: palette.primaryText, fontWeight: '900', fontSize: 14 },
    secondaryButton: {
      flex: 1,
      borderRadius: 12,
      backgroundColor: palette.surface,
      borderWidth: 1,
      borderColor: palette.border,
      paddingVertical: 11,
      alignItems: 'center',
    },
    secondaryButtonText: { color: palette.text, fontWeight: '900', fontSize: 14 },
    dropdownCard: {
      marginTop: 2,
      borderWidth: 1,
      borderColor: palette.border,
      borderRadius: 12,
      backgroundColor: palette.surface,
      overflow: 'hidden',
    },
    dropdownItem: {
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
    },
    dropdownWord: { color: palette.text, fontWeight: '800', fontSize: 14 },
    dropdownPart: { color: palette.mutedText, fontSize: 12, textTransform: 'capitalize' },
    dropdownEmpty: { color: palette.mutedText, paddingHorizontal: 12, paddingVertical: 10, fontSize: 12 },
    recentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
    },
    recentLabel: { color: palette.mutedText, fontWeight: '700' },
    recentChip: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.elevated,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    recentChipText: { color: palette.text, fontWeight: '700' },
    wildcardResult: { color: palette.text, fontWeight: '700', fontSize: 13 },
    wildcardChipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    wildcardChip: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.elevated,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    wildcardChipText: {
      color: palette.text,
      fontWeight: '800',
      fontSize: 12,
    },
    list: { paddingTop: 4, paddingHorizontal: 16 },
    resultsTitle: { color: palette.mutedText, fontWeight: '800', marginTop: 2, marginBottom: 4, fontSize: 12 },
    empty: { marginTop: 8, color: palette.mutedText, paddingHorizontal: 16, fontSize: 12 },
    row: {
      backgroundColor: palette.surface,
      borderRadius: 16,
      padding: 11,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: palette.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      ...cardShadow(palette),
    },
    wordButton: { flex: 1 },
    word: { fontSize: 16, fontWeight: '900', color: palette.text },
    definition: { marginTop: 5, color: palette.mutedText, lineHeight: 17, fontSize: 12.5 },
    badge: {
      marginTop: 8,
      alignSelf: 'flex-start',
      color: palette.primary,
      backgroundColor: palette.elevated,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      overflow: 'hidden',
      fontSize: 12,
      fontWeight: '800',
      borderWidth: 1,
      borderColor: palette.border,
    },
    favoriteButton: {
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 18,
      backgroundColor: palette.elevated,
      borderWidth: 1,
      borderColor: palette.border,
    },
    favoriteText: { fontSize: 19, color: palette.accent },
  });
}

function cardShadow(palette: AppPalette) {
  return Platform.select({
    ios: {
      shadowColor: palette.mode === 'night' ? '#000000' : '#0A1A36',
      shadowOpacity: palette.mode === 'night' ? 0.3 : 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
    android: {
      elevation: palette.mode === 'night' ? 2 : 3,
    },
    default: {
      shadowColor: palette.mode === 'night' ? '#000000' : '#0A1A36',
      shadowOpacity: palette.mode === 'night' ? 0.28 : 0.07,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 7 },
    },
  });
}
