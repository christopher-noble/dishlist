import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '../context/auth-context';

/**
 * On auth screens, send authenticated users to the main app.
 */
export function useAuthRedirect(): void {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);
}
