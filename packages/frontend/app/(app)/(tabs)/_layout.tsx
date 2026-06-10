import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  FLOATING_TAB_BAR_HEIGHT,
  FLOATING_TAB_BAR_HORIZONTAL_INSET,
  FloatingTabBar,
} from '@/components/floating-tab-bar';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const tabBarBottom = Math.max(insets.bottom, 8) + 8;
  const sceneBottomPadding = FLOATING_TAB_BAR_HEIGHT + tabBarBottom + FLOATING_TAB_BAR_HORIZONTAL_INSET;

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        tabBarShowLabel: false,
        sceneContainerStyle: {
          paddingBottom: sceneBottomPadding,
        },
        headerShown: false,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Recipes' }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
