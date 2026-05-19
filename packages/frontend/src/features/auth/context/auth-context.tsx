import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  authApiClient,
  type AuthSession,
  type SignInInput,
  type SignUpInput,
  type User,
} from '../api/auth-api-client';
import {
  clearAccessToken,
  synchronizeAccessTokenWithSession,
} from '../services/auth-session.service';

type AuthContextValue = {
  session: AuthSession | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const nextSession = await authApiClient.getSession();
      setSession(nextSession);
    } catch {
      setSession(null);
    }

    try {
      const profile = await authApiClient.getCurrentUser();
      setUser(profile?.user ?? null);

      if (profile?.user) {
        await synchronizeAccessTokenWithSession();
      } else {
        clearAccessToken();
      }
    } catch {
      setUser(null);
      clearAccessToken();
    }
  }, []);

  const establishSession = useCallback(async (initialSession: AuthSession) => {
    setSession(initialSession);

    const profile = await authApiClient.getCurrentUser();
    if (!profile?.user) {
      throw new Error('Unable to load your profile');
    }

    setUser(profile.user);

    const hasAccessToken = await synchronizeAccessTokenWithSession();
    if (!hasAccessToken) {
      throw new Error('Unable to issue access token');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await refreshSession();
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshSession]);

  const signIn = useCallback(
    async (input: SignInInput) => {
      const nextSession = await authApiClient.signIn(input);
      await establishSession(nextSession);
    },
    [establishSession],
  );

  const signUp = useCallback(
    async (input: SignUpInput) => {
      const nextSession = await authApiClient.signUp(input);
      await establishSession(nextSession);
    },
    [establishSession],
  );

  const signOut = useCallback(async () => {
    await authApiClient.signOut();
    clearAccessToken();
    setSession(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      signOut,
      refreshSession,
    }),
    [session, user, isLoading, signIn, signUp, signOut, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
