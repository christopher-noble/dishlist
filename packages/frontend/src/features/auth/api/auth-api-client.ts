import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { ApiError } from '@/src/shared/api/client';

import {
  authServiceConfig,
  buildBetterAuthUrl,
  buildUserServiceUrl,
} from '../config/auth-service-config';
import { applyClientOriginHeaders } from './client-origin';
import { sessionTokenStore } from '../storage/session-token-store';

const AUTH_COOKIE_STORAGE_KEY = 'dishlist.auth.cookies';
const SESSION_COOKIE_NAME = 'better-auth.session_token';

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

export type AuthSignInResponse = {
  redirect: false;
  token: string;
  user: AuthSessionUser;
  url?: string | null;
};

export type AuthSession = AuthSessionPayload | AuthSignInResponse;

export type IssuedAccessToken = {
  accessToken: string;
  expiresAt: string;
};

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
        'Could not reach the user service. Check EXPO_PUBLIC_USER_SERVICE_URL.',
        0,
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function readStoredValue(key: string): string | null {
  if (Platform.OS === 'web') {
    return globalThis.localStorage?.getItem(key) ?? null;
  }

  return null;
}

async function loadStoredCookieHeader(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return readStoredValue(AUTH_COOKIE_STORAGE_KEY);
  }

  return SecureStore.getItemAsync(AUTH_COOKIE_STORAGE_KEY);
}

async function writeStoredValue(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

async function deleteStoredValue(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

async function persistCookieHeader(setCookieValues: string[]): Promise<void> {
  if (setCookieValues.length === 0) {
    return;
  }

  const cookiePairs = setCookieValues.map((value) => value.split(';')[0]);
  await writeStoredValue(AUTH_COOKIE_STORAGE_KEY, cookiePairs.join('; '));
}

function extractSessionToken(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  if ('token' in data && typeof data.token === 'string') {
    return data.token;
  }

  if (
    'session' in data &&
    data.session &&
    typeof data.session === 'object' &&
    'token' in data.session &&
    typeof data.session.token === 'string'
  ) {
    return data.session.token;
  }

  return null;
}

async function persistAuthCredentials(
  data: unknown,
  response: Response,
): Promise<void> {
  const tokenFromBody = extractSessionToken(data);
  if (tokenFromBody) {
    await sessionTokenStore.save(tokenFromBody);
  }

  const setAuthToken = response.headers.get('set-auth-token');
  if (setAuthToken) {
    await sessionTokenStore.save(setAuthToken);

    const existingCookies = await loadStoredCookieHeader();
    const sessionCookie = `${SESSION_COOKIE_NAME}=${setAuthToken}`;
    await writeStoredValue(
      AUTH_COOKIE_STORAGE_KEY,
      existingCookies
        ? `${existingCookies}; ${sessionCookie}`
        : sessionCookie,
    );
  }

  await persistCookieHeader(extractSetCookieHeaders(response));
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

async function buildSessionAuthHeaders(): Promise<Headers> {
  const headers = new Headers();
  const storedCookies = await loadStoredCookieHeader();

  if (storedCookies) {
    headers.set('Cookie', storedCookies);
  }

  const sessionToken = await sessionTokenStore.get();
  if (sessionToken) {
    headers.set('Authorization', `Bearer ${sessionToken}`);
  }

  applyClientOriginHeaders(headers);
  return headers;
}

async function authFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = await buildSessionAuthHeaders();

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetchWithTimeout(buildBetterAuthUrl(path), {
    ...init,
    headers,
    credentials: Platform.OS === 'web' ? 'include' : 'omit',
  });

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

  await persistAuthCredentials(data, response);

  return data as T;
}

async function userServiceFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = await buildSessionAuthHeaders();

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetchWithTimeout(buildUserServiceUrl(path), {
    ...init,
    headers,
    credentials: Platform.OS === 'web' ? 'include' : 'omit',
  });

  const data: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : 'User service request failed';

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

    await deleteStoredValue(AUTH_COOKIE_STORAGE_KEY);
    await sessionTokenStore.clear();

    return result;
  },

  async getSession(): Promise<AuthSession | null> {
    return authFetch<AuthSession | null>('/get-session', {
      method: 'GET',
    });
  },

  async issueAccessToken(): Promise<IssuedAccessToken | null> {
    try {
      return await userServiceFetch<IssuedAccessToken>(
        authServiceConfig.accessTokenIssuePath,
        { method: 'POST' },
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return null;
      }
      throw error;
    }
  },

  async getCurrentUser(): Promise<{
    user: User;
    session: { id: string; expiresAt: string };
  } | null> {
    try {
      return await userServiceFetch<{
        user: User;
        session: { id: string; expiresAt: string };
      }>('/api/users/me', { method: 'GET' });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return null;
      }
      throw error;
    }
  },

  /** @deprecated Use `getCurrentUser` */
  getApplicationUser() {
    return this.getCurrentUser();
  },

  async clearStoredSession(): Promise<void> {
    await deleteStoredValue(AUTH_COOKIE_STORAGE_KEY);
    await sessionTokenStore.clear();
  },
};
