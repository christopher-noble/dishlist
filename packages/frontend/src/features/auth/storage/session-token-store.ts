import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const SESSION_TOKEN_STORAGE_KEY = 'dishlist.auth.session_token';

export const sessionTokenStore = {
  async get(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return globalThis.localStorage?.getItem(SESSION_TOKEN_STORAGE_KEY) ?? null;
    }

    return SecureStore.getItemAsync(SESSION_TOKEN_STORAGE_KEY);
  },

  async save(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.setItem(SESSION_TOKEN_STORAGE_KEY, token);
      return;
    }

    await SecureStore.setItemAsync(SESSION_TOKEN_STORAGE_KEY, token);
  },

  async clear(): Promise<void> {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.removeItem(SESSION_TOKEN_STORAGE_KEY);
      return;
    }

    await SecureStore.deleteItemAsync(SESSION_TOKEN_STORAGE_KEY);
  },
};
