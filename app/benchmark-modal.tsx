import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChromaticBackdrop } from '@/components/chromatic-backdrop';
import { ThemeToggleChip } from '@/components/theme-toggle-chip';
import type { AppPalette } from '@/constants/app-theme';
import { useDictionary } from '@/context/dictionary-context';
import { useUITheme } from '@/context/ui-theme-context';

const QUICK_PREFIXES = ['a', 'ca', 'do', 'th', 'wa', 'tr'];

export default function BenchmarkModal() {
  const { palette } = useUITheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const params = useLocalSearchParams<{ q?: string }>();
  const { runBenchmark, state } = useDictionary();

  const initialQuery = useMemo(() => {
    const param = (params.q ?? '').toLowerCase().trim();
    if (param.length > 0) {
      return param.slice(0, 5);
    }
    if (state.wordOfDay.length > 0) {
      return state.wordOfDay.slice(0, 3);
    }
    return 'a';
  }, [params.q, state.wordOfDay]);

  const [query, setQuery] = useState(initialQuery);
  const [lastRun, setLastRun] = useState(() => runBenchmark(initialQuery));

  const verdict = useMemo(() => {
    const diff = lastRun.naiveMs - lastRun.trieMs;
    if (Math.abs(diff) < 0.001) {
      return 'Almost equal speed';
    }
    if (diff > 0) {
      return 'Trie is faster for this prefix';
    }
    return 'Naive is faster for this prefix';
  }, [lastRun.naiveMs, lastRun.trieMs]);

  const ratio = useMemo(() => {
    if (lastRun.trieMs <= 0 || lastRun.naiveMs <= 0) {
      return 'n/a';
    }
    const value = lastRun.naiveMs / lastRun.trieMs;
    return `${value.toFixed(2)}x`;
  }, [lastRun.naiveMs, lastRun.trieMs]);

  const run = (prefix: string) => {
    const safe = prefix.toLowerCase().trim();
    if (!safe) {
      return;
    }
    setQuery(safe);
    setLastRun(runBenchmark(safe));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ChromaticBackdrop palette={palette} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.titleRow}>
            <View style={styles.titleBlock}>
              <Text allowFontScaling={false} style={styles.kicker}>
                BENCHMARK GUIDE
              </Text>
              <Text allowFontScaling={false} style={styles.title}>
                Trie vs Naive Search
              </Text>
              <Text allowFontScaling={false} style={styles.caption}>
                Compare prefix lookup speed using the same query.
              </Text>
            </View>
            <ThemeToggleChip />
          </View>

          <View style={styles.card}>
            <Text allowFontScaling={false} style={styles.sectionTitle}>
              1) Choose a prefix
            </Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              style={styles.input}
              placeholder="Type prefix (example: do)"
              placeholderTextColor={palette.mutedText}
            />
            <View style={styles.quickRow}>
              {QUICK_PREFIXES.map((item) => (
                <Pressable key={item} style={styles.quickChip} onPress={() => run(item)}>
                  <Text allowFontScaling={false} style={styles.quickChipText}>
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable style={styles.button} onPress={() => run(query)}>
              <Text allowFontScaling={false} style={styles.buttonText}>
                2) Run Comparison
              </Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text allowFontScaling={false} style={styles.sectionTitle}>
              3) Read the result
            </Text>
            <Text allowFontScaling={false} style={styles.verdict}>
              {verdict}
            </Text>
            <View style={styles.metricRow}>
              <Text allowFontScaling={false} style={styles.metricLabel}>
                Trie time
              </Text>
              <Text allowFontScaling={false} style={styles.metricValue}>
                {lastRun.trieMs.toFixed(3)} ms
              </Text>
            </View>
            <View style={styles.metricRow}>
              <Text allowFontScaling={false} style={styles.metricLabel}>
                Naive time
              </Text>
              <Text allowFontScaling={false} style={styles.metricValue}>
                {lastRun.naiveMs.toFixed(3)} ms
              </Text>
            </View>
            <View style={styles.metricRow}>
              <Text allowFontScaling={false} style={styles.metricLabel}>
                Matches
              </Text>
              <Text allowFontScaling={false} style={styles.metricValue}>
                {lastRun.trieCount} / {lastRun.naiveCount}
              </Text>
            </View>
            <Text allowFontScaling={false} style={styles.ratio}>
              Speed Ratio (Naive / Trie): {ratio}
            </Text>
          </View>

          <View style={styles.helpCard}>
            <Text allowFontScaling={false} style={styles.helpTitle}>
              What it means
            </Text>
            <Text allowFontScaling={false} style={styles.helpText}>
              Trie follows letter paths, so prefix lookup is usually faster.
            </Text>
            <Text allowFontScaling={false} style={styles.helpText}>
              Naive checks every word one by one.
            </Text>
            <Text allowFontScaling={false} style={styles.helpText}>
              Lower milliseconds are better.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(palette: AppPalette) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: palette.background },
    scrollContent: { paddingBottom: 26 },
    container: { paddingHorizontal: 16, paddingTop: 14, gap: 10 },
    titleRow: {
      backgroundColor: palette.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: 14,
      paddingVertical: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
      ...cardShadow(palette),
    },
    titleBlock: { flex: 1 },
    kicker: { fontSize: 10, fontWeight: '900', letterSpacing: 1, color: palette.primary },
    title: { fontSize: 24, fontWeight: '900', color: palette.text, lineHeight: 30 },
    caption: { color: palette.mutedText, marginTop: 3, fontWeight: '700', fontSize: 12.5 },
    card: {
      backgroundColor: palette.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 12,
      gap: 8,
      ...cardShadow(palette),
    },
    sectionTitle: { color: palette.text, fontWeight: '900', fontSize: 13.5 },
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
    quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    quickChip: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.elevated,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    quickChipText: { color: palette.text, fontWeight: '800', fontSize: 12 },
    button: {
      marginTop: 2,
      backgroundColor: palette.primary,
      borderRadius: 12,
      paddingVertical: 11,
      alignItems: 'center',
    },
    buttonText: { color: palette.primaryText, fontWeight: '900', fontSize: 14 },
    verdict: {
      color: palette.accent,
      fontWeight: '900',
      fontSize: 14.5,
      marginBottom: 2,
    },
    metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    metricLabel: { color: palette.mutedText, fontWeight: '700', fontSize: 13 },
    metricValue: { color: palette.text, fontWeight: '900', fontSize: 13.5 },
    ratio: {
      marginTop: 4,
      color: palette.text,
      fontWeight: '900',
      borderTopWidth: 1,
      borderTopColor: palette.border,
      paddingTop: 8,
      fontSize: 13,
    },
    helpCard: {
      backgroundColor: palette.accentSoft,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 12,
      gap: 4,
    },
    helpTitle: { color: palette.text, fontWeight: '900', fontSize: 13.5 },
    helpText: { color: palette.text, fontSize: 12.5, lineHeight: 17.5 },
  });
}

function cardShadow(palette: AppPalette) {
  return Platform.select({
    ios: {
      shadowColor: palette.mode === 'night' ? '#000000' : '#0A1A36',
      shadowOpacity: palette.mode === 'night' ? 0.33 : 0.07,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 7 },
    },
    android: {
      elevation: palette.mode === 'night' ? 2 : 3,
    },
    default: {
      shadowColor: palette.mode === 'night' ? '#000000' : '#0A1A36',
      shadowOpacity: palette.mode === 'night' ? 0.28 : 0.06,
      shadowRadius: 11,
      shadowOffset: { width: 0, height: 6 },
    },
  });
}
