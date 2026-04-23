import { DarkTheme, DefaultTheme, ThemeProvider, type Theme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DictionaryProvider } from '@/context/dictionary-context';
import { UIThemeProvider, useUITheme } from '@/context/ui-theme-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <UIThemeProvider>
        <RootLayoutContent />
      </UIThemeProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutContent() {
  const { palette, mode } = useUITheme();
  const navigationTheme = useMemo<Theme>(
    () => ({
      ...(mode === 'night' ? DarkTheme : DefaultTheme),
      dark: mode === 'night',
      colors: {
        primary: palette.primary,
        background: palette.background,
        card: palette.surface,
        text: palette.text,
        border: palette.border,
        notification: palette.accent,
      },
    }),
    [mode, palette]
  );

  return (
    <DictionaryProvider>
      <ThemeProvider value={navigationTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="word/[word]"
            options={{
              title: 'Word Detail',
              headerStyle: { backgroundColor: palette.surface },
              headerTitleStyle: { color: palette.text },
              headerTintColor: palette.primary,
            }}
          />
          <Stack.Screen
            name="benchmark-modal"
            options={{
              presentation: 'modal',
              title: 'Trie Benchmark',
              headerStyle: { backgroundColor: palette.surface },
              headerTitleStyle: { color: palette.text },
              headerTintColor: palette.primary,
            }}
          />
        </Stack>
        <StatusBar style={palette.statusBar} translucent={false} />
      </ThemeProvider>
    </DictionaryProvider>
  );
}
