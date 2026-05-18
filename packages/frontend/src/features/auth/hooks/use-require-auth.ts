import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '../context/auth-context';

/**
 * Redirects unauthenticated users away from protected route groups.
 */
export function useRequireAuth(): {
  isLoading: boolean;
  userId: string | null;
} {
  const { isLoading, isAuthenticated, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
      return;
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router, segments]);

  return {
    isLoading,
    userId: user?.id ?? null,
  };
}
