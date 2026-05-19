import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { APP_HOME_HREF } from '../constants/routes';
import { useAuth } from '../context/auth-context';

/**
 * On auth screens, send authenticated users to the main app.
 */
export function useAuthRedirect(): void {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(APP_HOME_HREF);
    }
  }, [isAuthenticated, isLoading, router]);
}
