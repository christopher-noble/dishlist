import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { ApiError } from '@/src/shared/api/client';

import { applyClientOriginHeaders } from './client-origin';

const AUTH_COOKIE_STORAGE_KEY = 'dishlist.auth.cookies';

export type AuthSessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthSessionPayload = {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
    token: string;
  };
  user: AuthSessionUser;
};

/** Sign-in/sign-up email responses (session token at top level). */
export type AuthSignInResponse = {
  redirect: false;
  token: string;
  user: AuthSessionUser;
  url?: string | null;
};

export type AuthSession = AuthSessionPayload | AuthSignInResponse;

export function isAuthenticatedSession(
  value: AuthSession | null,
): value is AuthSession {
  return Boolean(value && 'user' in value && value.user);
}

export function getSessionUser(
  value: AuthSession | null,
): AuthSessionUser | null {
  if (!value || !('user' in value)) {
    return null;
  }

  return value.user;
}

export type User = {
  id: string;
  authUserId: string | null;
  firstName: string;
  lastName: string;
  primaryEmail: string;
  secondaryEmail: string | null;
  accountStatus: string;
  createdAt: string;
  updatedAt: string;
};

/** @deprecated Use `User` */
export type ApplicationUser = User;

export type SignUpInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type SignInInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

function getUserServiceBaseUrl(): string {
  return (
    process.env.EXPO_PUBLIC_USER_SERVICE_URL?.replace(/\/$/, '') ??
    'http://localhost:4001'
  );
}

function buildAuthUrl(path: string): string {
  return `${getUserServiceBaseUrl()}/api/auth${path}`;
}

const AUTH_REQUEST_TIMEOUT_MS = 8_000;

async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    AUTH_REQUEST_TIMEOUT_MS,
  );

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(
        'Could not reach the user service. Is it running on port 4001?',
        0,
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function loadStoredCookieHeader(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return null;
  }

  return SecureStore.getItemAsync(AUTH_COOKIE_STORAGE_KEY);
}

async function persistCookieHeader(setCookieValues: string[]): Promise<void> {
  if (Platform.OS === 'web' || setCookieValues.length === 0) {
    return;
  }

  const cookiePairs = setCookieValues.map((value) => value.split(';')[0]);
  await SecureStore.setItemAsync(
    AUTH_COOKIE_STORAGE_KEY,
    cookiePairs.join('; '),
  );
}

function extractSetCookieHeaders(response: Response): string[] {
  const headersWithGetSetCookie = response.headers as Headers & {
    getSetCookie?: () => string[];
  };

  if (typeof headersWithGetSetCookie.getSetCookie === 'function') {
    return headersWithGetSetCookie.getSetCookie();
  }

  const single = response.headers.get('set-cookie');
  return single ? [single] : [];
}

async function authFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const storedCookies = await loadStoredCookieHeader();
  const headers = new Headers(init.headers);

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (storedCookies) {
    headers.set('Cookie', storedCookies);
  }

  applyClientOriginHeaders(headers);

  const response = await fetchWithTimeout(buildAuthUrl(path), {
    ...init,
    headers,
    credentials: Platform.OS === 'web' ? 'include' : 'omit',
  });

  const setCookieHeaders = extractSetCookieHeaders(response);
  await persistCookieHeader(setCookieHeaders);

  const data: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : 'Authentication request failed';

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export const authApiClient = {
  async signUp(input: SignUpInput): Promise<AuthSession> {
    return authFetch<AuthSession>('/sign-up/email', {
      method: 'POST',
      body: JSON.stringify({
        email: input.email,
        password: input.password,
        name: `${input.firstName} ${input.lastName}`.trim(),
        firstName: input.firstName,
        lastName: input.lastName,
      }),
    });
  },

  async signIn(input: SignInInput): Promise<AuthSession> {
    return authFetch<AuthSession>('/sign-in/email', {
      method: 'POST',
      body: JSON.stringify({
        email: input.email,
        password: input.password,
        rememberMe: input.rememberMe ?? true,
      }),
    });
  },

  async signOut(): Promise<{ success: boolean }> {
    const result = await authFetch<{ success: boolean }>('/sign-out', {
      method: 'POST',
    });

    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(AUTH_COOKIE_STORAGE_KEY);
    }

    return result;
  },

  async getSession(): Promise<AuthSession | null> {
    const data = await authFetch<AuthSession | null>('/get-session', {
      method: 'GET',
    });

    return data;
  },

  async getCurrentUser(): Promise<{
    user: User;
    session: { id: string; expiresAt: string };
  } | null> {
    const storedCookies = await loadStoredCookieHeader();
    const headers = new Headers();

    if (storedCookies) {
      headers.set('Cookie', storedCookies);
    }

    applyClientOriginHeaders(headers);

    const response = await fetchWithTimeout(
      `${getUserServiceBaseUrl()}/api/users/me`,
      {
        method: 'GET',
        headers,
        credentials: Platform.OS === 'web' ? 'include' : 'omit',
      },
    );

    if (response.status === 401) {
      return null;
    }

    const data: unknown = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof data.message === 'string'
          ? data.message
          : 'Failed to load profile';

      throw new ApiError(message, response.status, data);
    }

    return data as {
      user: User;
      session: { id: string; expiresAt: string };
    };
  },

  /** @deprecated Use `getCurrentUser` */
  getApplicationUser() {
    return this.getCurrentUser();
  },

  async clearStoredSession(): Promise<void> {
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(AUTH_COOKIE_STORAGE_KEY);
    }
  },
};
