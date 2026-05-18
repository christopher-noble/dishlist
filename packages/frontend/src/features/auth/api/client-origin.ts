import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Better Auth validates the Origin header on POST requests (CSRF).
 * Browsers set this automatically; React Native does not.
 */
export function getClientOrigin(): string {
  if (Platform.OS === 'web') {
    if (typeof globalThis !== 'undefined' && 'location' in globalThis) {
      const location = (globalThis as { location?: { origin?: string } }).location;
      if (location?.origin) {
        return location.origin;
      }
    }
    return process.env.EXPO_PUBLIC_APP_ORIGIN ?? 'http://localhost:8081';
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return `exp://${hostUri}`;
  }

  return process.env.EXPO_PUBLIC_APP_ORIGIN ?? 'dishlist://';
}

export function applyClientOriginHeaders(headers: Headers): void {
  const origin = getClientOrigin();
  headers.set('Origin', origin);
  if (!headers.has('Referer')) {
    headers.set('Referer', origin);
  }
}
