import { router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChromaticBackdrop } from '@/components/chromatic-backdrop';
import { ThemeToggleChip } from '@/components/theme-toggle-chip';
import type { AppPalette } from '@/constants/app-theme';
import { useUITheme } from '@/context/ui-theme-context';
import { useDictionary } from '@/context/dictionary-context';

export default function FavoritesScreen() {
  const { palette } = useUITheme();
  const { getFavoritesEntries, toggleFavorite } = useDictionary();
  const favorites = getFavoritesEntries();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ChromaticBackdrop palette={palette} />
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.kicker}>SAVED COLLECTION</Text>
            <Text style={styles.title}>Favorites</Text>
            <Text style={styles.caption}>{favorites.length} saved words</Text>
          </View>
          <ThemeToggleChip />
        </View>

        <FlatList
          data={favorites}
          keyExtractor={(item) => item.word}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No favorites yet.</Text>}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Pressable style={styles.wordButton} onPress={() => router.push(`/word/${item.word}`)}>
                <Text style={styles.word}>{item.word}</Text>
                <Text style={styles.definition} numberOfLines={2}>
                  {item.definition}
                </Text>
              </Pressable>
              <Pressable style={styles.remove} onPress={() => void toggleFavorite(item.word)}>
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(palette: AppPalette) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: palette.background },
    container: { flex: 1, paddingHorizontal: 16, paddingTop: 14 },
    topBar: {
      backgroundColor: palette.mode === 'night' ? '#1A2233F2' : '#FFFFFFF0',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: 18,
      paddingVertical: 16,
      marginTop: 2,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      transform: [{ translateY: -1 }],
      ...cardShadow(palette),
    },
    kicker: { fontSize: 11, fontWeight: '900', letterSpacing: 1.2, color: palette.primary },
    title: { fontSize: 34, fontWeight: '900', color: palette.text, lineHeight: 38 },
    caption: { color: palette.mutedText, marginTop: 4, fontWeight: '700', fontSize: 15 },
    list: { marginTop: 14, paddingBottom: 108 },
    empty: { color: palette.mutedText, marginTop: 8, fontSize: 16 },
    row: {
      backgroundColor: palette.mode === 'night' ? '#1A2233F4' : '#FFFFFFF5',
      borderRadius: 20,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: palette.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      transform: [{ translateY: -1 }],
      ...cardShadow(palette),
    },
    wordButton: { flex: 1 },
    word: { fontSize: 20, fontWeight: '900', color: palette.text },
    definition: { marginTop: 6, color: palette.mutedText, lineHeight: 21, fontSize: 15 },
    remove: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: palette.danger,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: palette.surface,
    },
    removeText: { color: palette.danger, fontWeight: '800', fontSize: 13 },
  });
}

function cardShadow(palette: AppPalette) {
  return Platform.select({
    ios: {
      shadowColor: palette.mode === 'night' ? '#000000' : '#0A1A36',
      shadowOpacity: palette.mode === 'night' ? 0.38 : 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
    },
    android: {
      elevation: palette.mode === 'night' ? 6 : 8,
    },
    default: {
      shadowColor: palette.mode === 'night' ? '#000000' : '#0A1A36',
      shadowOpacity: palette.mode === 'night' ? 0.34 : 0.1,
      shadowRadius: 15,
      shadowOffset: { width: 0, height: 8 },
    },
  });
}
