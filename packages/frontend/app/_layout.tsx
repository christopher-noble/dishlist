import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@react-navigation/native';
import { AppDarkTheme, AppLightTheme } from '@/constants/theme';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/src/features/auth';
import { apolloClient } from '@/src/shared/api/apollo-client';

export const unstable_settings = {
  anchor: '(app)/(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider value={colorScheme === 'dark' ? AppDarkTheme : AppLightTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(app)" />
            <Stack.Screen name="(auth)" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ApolloProvider>
    </AuthProvider>
  );
}
