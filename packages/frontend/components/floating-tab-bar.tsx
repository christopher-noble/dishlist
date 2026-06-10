import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FloatingTabIcon } from '@/components/floating-tab-icon';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Theme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
const TAB_BAR_HEIGHT = 56;
const HORIZONTAL_INSET = 16;

type TabRouteName = 'index' | 'discover' | 'profile';

function getTabIcon(routeName: TabRouteName, color: string) {
  switch (routeName) {
    case 'index':
      return <IconSymbol size={24} name="house.fill" color={color} />;
    case 'discover':
      return <IconSymbol size={24} name="magnifyingglass" color={color} />;
    case 'profile':
      return <IconSymbol size={24} name="person.fill" color={color} />;
  }
}

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';
  const activeColor = Colors[colorScheme ?? 'light'].tint;
  const inactiveColor = Colors[colorScheme ?? 'light'].tabIconDefault;
  const backgroundColor = isDark ? Theme.colors.stoneDark : Theme.colors.surface;

  return (
    <View
      style={[
        styles.outer,
        { paddingBottom: Math.max(insets.bottom, 8) },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.pill,
          { backgroundColor },
          Platform.OS === 'web'
            ? { boxShadow: '0 8px 28px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.05)' }
            : styles.pillShadow,
        ]}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const color = focused ? activeColor : inactiveColor;
          const routeName = route.name as TabRouteName;

          return (
            <PlatformPressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              }}
              onPressIn={() => {
                if (process.env.EXPO_OS === 'ios') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              style={styles.tabSlot}
            >
              <FloatingTabIcon focused={focused} activeColor={activeColor}>
                {getTabIcon(routeName, color)}
              </FloatingTabIcon>
            </PlatformPressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: HORIZONTAL_INSET,
    alignItems: 'stretch',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: TAB_BAR_HEIGHT,
    borderRadius: TAB_BAR_HEIGHT / 2,
    paddingHorizontal: 4,
  },
  pillShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  tabSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: TAB_BAR_HEIGHT,
  },
});

export const FLOATING_TAB_BAR_HEIGHT = TAB_BAR_HEIGHT;
export const FLOATING_TAB_BAR_HORIZONTAL_INSET = HORIZONTAL_INSET;
