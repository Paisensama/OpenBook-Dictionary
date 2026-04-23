import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChromaticBackdrop } from '@/components/chromatic-backdrop';
import { ThemeToggleChip } from '@/components/theme-toggle-chip';
import type { AppPalette } from '@/constants/app-theme';
import { useUITheme } from '@/context/ui-theme-context';
import { useDictionary } from '@/context/dictionary-context';

export default function WordDetailScreen() {
  const { palette } = useUITheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const params = useLocalSearchParams<{ word?: string }>();
  const word = (params.word ?? '').toLowerCase();
  const { getEntry, hydrateOnlineEntry, getRelatedWords, openWord, isFavorite, toggleFavorite } = useDictionary();
  const [checkingOnline, setCheckingOnline] = useState(false);
  const entry = getEntry(word);
  const relatedWords = useMemo(() => (entry ? getRelatedWords(entry.word, 8) : []), [entry, getRelatedWords]);
  const facts = useMemo(() => {
    if (!entry) {
      return [];
    }
    const letters = entry.word.length;
    const vowels = (entry.word.match(/[aeiou]/gi) ?? []).length;
    const consonants = letters - vowels;
    return [
      `${letters} letters`,
      `${vowels} vowels`,
      `${consonants} consonants`,
      `starts with "${entry.word[0]}"`,
      `ends with "${entry.word[entry.word.length - 1]}"`,
    ];
  }, [entry]);

  useEffect(() => {
    if (word) {
      void openWord(word);
    }
  }, [openWord, word]);

  useEffect(() => {
    if (!word) {
      return;
    }
    let mounted = true;
    setCheckingOnline(true);
    void hydrateOnlineEntry(word).finally(() => {
      if (mounted) {
        setCheckingOnline(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [hydrateOnlineEntry, word]);

  if (!entry) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ChromaticBackdrop palette={palette} />
        <View style={styles.container}>
          <View style={styles.rowBetween}>
            <Text style={styles.title}>Word not found</Text>
            <ThemeToggleChip />
          </View>
          {checkingOnline ? <Text style={styles.kicker}>Checking online dictionary...</Text> : null}
          <Text style={styles.text}>{`The word "${word}" is not in the dictionary.`}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ChromaticBackdrop palette={palette} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.kicker}>ENTRY DETAIL</Text>
              <Text style={styles.title}>{entry.word}</Text>
            </View>
            <ThemeToggleChip />
          </View>
          {checkingOnline ? <Text style={styles.onlineBadge}>Syncing online details...</Text> : null}

          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.badge}>{entry.partOfSpeech}</Text>
              <Pressable style={styles.favoriteButton} onPress={() => void toggleFavorite(entry.word)}>
                <Text style={styles.favoriteText}>{isFavorite(entry.word) ? '★ Favorite' : '☆ Add Favorite'}</Text>
              </Pressable>
            </View>
            <Text style={styles.sectionTitle}>Meaning</Text>
            <Text style={styles.text}>{entry.definition}</Text>
            {entry.details ? (
              <>
                <Text style={styles.sectionTitle}>Details</Text>
                <Text style={styles.subText}>{entry.details}</Text>
              </>
            ) : null}
            {entry.example ? (
              <>
                <Text style={styles.sectionTitle}>Example</Text>
                <Text style={styles.subText}>{entry.example}</Text>
              </>
            ) : null}
            {entry.usageTip ? (
              <>
                <Text style={styles.sectionTitle}>Usage Tip</Text>
                <Text style={styles.subText}>{entry.usageTip}</Text>
              </>
            ) : null}
            {entry.pronunciation ? (
              <>
                <Text style={styles.sectionTitle}>Pronunciation</Text>
                <Text style={styles.pronounceText}>{entry.pronunciation}</Text>
              </>
            ) : null}
            {entry.syllables && entry.syllables.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>Syllable Breakdown</Text>
                <View style={styles.factWrap}>
                  {entry.syllables.map((syllable, index) => (
                    <View key={`${syllable}-${index}`} style={styles.factChip}>
                      <Text style={styles.factText}>{syllable}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : null}
            <Text style={styles.sectionTitle}>Word Facts</Text>
            <View style={styles.factWrap}>
              {facts.map((fact) => (
                <View key={fact} style={styles.factChip}>
                  <Text style={styles.factText}>{fact}</Text>
                </View>
              ))}
            </View>
            {relatedWords.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>Related Words</Text>
                <View style={styles.factWrap}>
                  {relatedWords.map((item) => (
                    <Pressable
                      key={item.word}
                      style={styles.relatedChip}
                      onPress={() => router.push(`/word/${item.word}`)}>
                      <Text style={styles.relatedChipText}>{item.word}</Text>
                    </Pressable>
                  ))}
                </View>
              </>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(palette: AppPalette) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: palette.background },
    scrollContent: { paddingBottom: 28 },
    container: { paddingHorizontal: 16, paddingTop: 14, gap: 14 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    kicker: { fontSize: 11, fontWeight: '900', letterSpacing: 1.2, color: palette.primary },
    title: { fontSize: 40, fontWeight: '900', color: palette.text, textTransform: 'lowercase', lineHeight: 44 },
    onlineBadge: {
      alignSelf: 'flex-start',
      fontSize: 11.5,
      fontWeight: '800',
      color: palette.accent,
      backgroundColor: palette.accentSoft,
      borderWidth: 1,
      borderColor: palette.border,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 5,
      overflow: 'hidden',
    },
    card: {
      backgroundColor: palette.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 16,
      gap: 14,
      ...cardShadow(palette),
    },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
    badge: {
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: palette.elevated,
      color: palette.primary,
      textTransform: 'capitalize',
      fontWeight: '900',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: palette.border,
      fontSize: 13,
    },
    text: { marginTop: 2, fontSize: 19, lineHeight: 27, color: palette.text },
    sectionTitle: {
      marginTop: 2,
      color: palette.primary,
      fontWeight: '900',
      fontSize: 13,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    subText: {
      color: palette.mutedText,
      lineHeight: 22,
      fontSize: 15.5,
    },
    pronounceText: {
      color: palette.accent,
      fontWeight: '800',
      fontSize: 16,
      letterSpacing: 0.6,
    },
    factWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    factChip: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.elevated,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    factText: {
      color: palette.text,
      fontWeight: '700',
      fontSize: 12,
    },
    relatedChip: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: palette.primary,
      backgroundColor: palette.accentSoft,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    relatedChipText: {
      color: palette.primary,
      fontWeight: '800',
      fontSize: 12,
    },
    favoriteButton: {
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: palette.accentSoft,
      borderWidth: 1,
      borderColor: palette.border,
    },
    favoriteText: { color: palette.accent, fontWeight: '900', fontSize: 13 },
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
