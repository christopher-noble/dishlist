type StoredAccessToken = {
  accessToken: string;
  expiresAtMs: number;
};

let stored: StoredAccessToken | null = null;

const REFRESH_BUFFER_MS = 30_000;

export const accessTokenStore = {
  getValidAccessToken(): string | null {
    if (!stored) {
      return null;
    }

    if (Date.now() >= stored.expiresAtMs - REFRESH_BUFFER_MS) {
      return null;
    }

    return stored.accessToken;
  },

  save(accessToken: string, expiresAt: string): void {
    stored = {
      accessToken,
      expiresAtMs: new Date(expiresAt).getTime(),
    };
  },

  clear(): void {
    stored = null;
  },
};
