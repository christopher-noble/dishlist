import { Stack } from 'expo-router';

import { useAuthRedirect } from '@/src/features/auth';

export default function AuthLayout() {
  useAuthRedirect();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    />
  );
}
