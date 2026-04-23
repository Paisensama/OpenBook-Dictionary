import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useUITheme } from '@/context/ui-theme-context';

export default function TabLayout() {
  const { palette, mode } = useUITheme();
  const insets = useSafeAreaInsets();
  const tabBottomPadding = Math.max(insets.bottom, 9);
  const tabEffects =
    mode === 'night'
      ? {
          activeTint: palette.primary,
          indicator: '#FFB73B',
          indicatorShadow: '#FF9E1B',
          coneColor: 'rgba(255, 182, 59, 0.22)',
          bloomColor: 'rgba(255, 173, 31, 0.2)',
          bloomShadow: '#FFB73B',
        }
      : {
          activeTint: '#D99000',
          indicator: '#F5A20F',
          indicatorShadow: '#E08A00',
          coneColor: 'rgba(245, 162, 15, 0.18)',
          bloomColor: 'rgba(245, 158, 11, 0.13)',
          bloomShadow: '#F5A20F',
        };
  const activeTint = tabEffects.activeTint;
  const inactiveTint = palette.tabInactive;
  const barBackground = palette.tabBar;
  const barBorder = palette.border;

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 10,
          backgroundColor: barBackground,
          borderColor: barBorder,
          borderWidth: 1,
          height: 58 + tabBottomPadding,
          paddingTop: 7,
          paddingBottom: tabBottomPadding,
          borderRadius: 24,
          overflow: 'hidden',
          elevation: 10,
          shadowColor: mode === 'night' ? '#000000' : '#0A1A36',
          shadowOpacity: mode === 'night' ? 0.3 : 0.08,
          shadowRadius: mode === 'night' ? 16 : 10,
          shadowOffset: { width: 0, height: mode === 'night' ? 7 : 5 },
        },
        tabBarItemStyle: {
          marginHorizontal: 2,
          marginTop: 0,
          borderRadius: 16,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '800',
          marginTop: -1,
          letterSpacing: 0.2,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="magnifyingglass" color={color} focused={focused} effects={tabEffects} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="star.fill" color={color} focused={focused} effects={tabEffects} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="clock.fill" color={color} focused={focused} effects={tabEffects} />
          ),
        }}
      />
      <Tabs.Screen
        name="word-play"
        options={{
          title: 'Word Play',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="gamecontroller.fill" color={color} focused={focused} effects={tabEffects} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabBarIcon({
  name,
  color,
  focused,
  effects,
}: {
  name: 'magnifyingglass' | 'star.fill' | 'clock.fill' | 'gamecontroller.fill';
  color: string;
  focused: boolean;
  effects: {
    indicator: string;
    indicatorShadow: string;
    coneColor: string;
    bloomColor: string;
    bloomShadow: string;
  };
}) {
  return (
    <View style={styles.iconWrap}>
      {focused ? (
        <>
          <View
            style={[styles.topIndicator, { backgroundColor: effects.indicator, shadowColor: effects.indicatorShadow }]}
          />
          <View style={[styles.glowCone, { borderBottomColor: effects.coneColor }]} />
          <View
            style={[styles.glowBloom, { backgroundColor: effects.bloomColor, shadowColor: effects.bloomShadow }]}
          />
        </>
      ) : null}
      <IconSymbol size={20} name={name} color={color} weight={focused ? 'semibold' : 'regular'} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 50,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  topIndicator: {
    position: 'absolute',
    top: -10,
    width: 32,
    height: 3,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    shadowOpacity: 0.72,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  glowCone: {
    position: 'absolute',
    top: -7,
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderTopWidth: 0,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  glowBloom: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    shadowOpacity: 0.48,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
});
