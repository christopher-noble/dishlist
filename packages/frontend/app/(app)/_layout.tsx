import { Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Theme } from '@/constants/theme';
import { useRequireAuth } from '@/src/features/auth';

const c = Theme.colors;

export default function AppLayout() {
  const { isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="meal/[id]"
        options={{
          headerShown: false,
          presentation: 'card',
          animation: 'fade_from_bottom',
        }}
      />
      <Stack.Screen
        name="meal/add"
        options={{
          headerShown: false,
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.background,
  },
});
