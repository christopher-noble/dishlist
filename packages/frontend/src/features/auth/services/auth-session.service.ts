import { authApiClient } from '../api/auth-api-client';
import { accessTokenStore } from '../storage/access-token-store';

export async function synchronizeAccessTokenWithSession(): Promise<boolean> {
  const issued = await authApiClient.issueAccessToken();

  if (!issued) {
    accessTokenStore.clear();
    return false;
  }

  accessTokenStore.save(issued.accessToken, issued.expiresAt);
  return true;
}

export function clearAccessToken(): void {
  accessTokenStore.clear();
}
