import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';

import { LOGIN_HREF } from '../constants/routes';
import { useAuth } from '../context/auth-context';

type UseLogoutActionOptions = {
  confirmBeforeLogout?: boolean;
};

export function useLogoutAction({
  confirmBeforeLogout = false,
}: UseLogoutActionOptions = {}) {
  const { signOut } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const performLogout = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await signOut();
      router.replace(LOGIN_HREF);
    } finally {
      setIsSubmitting(false);
    }
  }, [router, signOut]);

  const requestLogout = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    if (!confirmBeforeLogout) {
      void performLogout();
      return;
    }

    const title = 'Log out?';
    const message = 'You will need to sign in again to access your recipes.';

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.confirm(`${title}\n\n${message}`)) {
        void performLogout();
      }
      return;
    }

    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          void performLogout();
        },
      },
    ]);
  }, [confirmBeforeLogout, isSubmitting, performLogout]);

  return { requestLogout, isSubmitting };
}
