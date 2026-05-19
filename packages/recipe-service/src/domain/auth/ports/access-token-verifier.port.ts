import type { AuthenticatedUser } from '../authenticated-user.js';

export interface AccessTokenVerifierPort {
  verifyAccessToken(accessToken: string): Promise<AuthenticatedUser | null>;
}
