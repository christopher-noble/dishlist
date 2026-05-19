import type { AccessTokenIssuerPort } from '../../domain/auth/ports/access-token-issuer.port.js';
import type { IssuedAccessToken } from '../../domain/auth/access-token-claims.js';
import { resolveUserProfileForAuthUser } from '../../infrastructure/auth/resolve-user-profile.js';
import { accessTokenIssuer } from '../../infrastructure/auth/jwt/jwt-access-token-issuer.adapter.js';

export type AuthSessionUser = {
  id: string;
  name: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
};

export async function issueAccessTokenForSessionUser(
  sessionUser: AuthSessionUser,
  issuer: AccessTokenIssuerPort = accessTokenIssuer,
): Promise<IssuedAccessToken> {
  const profile = await resolveUserProfileForAuthUser({
    id: sessionUser.id,
    name: sessionUser.name,
    email: sessionUser.email,
    firstName: sessionUser.firstName,
    lastName: sessionUser.lastName,
  });

  if (!profile) {
    throw new Error('User profile not found');
  }

  return issuer.issueAccessToken({
    sub: profile.id,
    authUserId: sessionUser.id,
  });
}
