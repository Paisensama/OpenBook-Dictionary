import { Pressable, StyleSheet, Text } from 'react-native';

import { useUITheme } from '@/context/ui-theme-context';

export function ThemeToggleChip() {
  const { mode, palette, toggleMode } = useUITheme();

  return (
    <Pressable
      style={[styles.chip, { backgroundColor: palette.accentSoft, borderColor: palette.border }]}
      onPress={() => void toggleMode()}>
      <Text allowFontScaling={false} style={[styles.icon, { color: palette.accent }]}>
        {mode === 'sunny' ? 'DAY' : 'NGT'}
      </Text>
      <Text allowFontScaling={false} style={[styles.label, { color: palette.text }]}>
        {mode === 'sunny' ? 'Day' : 'Night'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1.2,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: { fontSize: 11, fontWeight: '900', letterSpacing: 0.6 },
  label: { fontWeight: '800', fontSize: 12.5 },
});
