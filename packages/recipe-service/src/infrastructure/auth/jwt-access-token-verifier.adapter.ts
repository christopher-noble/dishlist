import { createRemoteJWKSet, jwtVerify } from 'jose';

import { appConfig } from '../../../config/config.default.ts';
import type { AuthenticatedUser } from '../../domain/auth/authenticated-user.ts';
import type { AccessTokenVerifierPort } from '../../domain/auth/ports/access-token-verifier.port.ts';

export class JwtAccessTokenVerifierAdapter implements AccessTokenVerifierPort {
  private readonly jwks = createRemoteJWKSet(
    new URL(appConfig.userService.jwksUrl),
    {
      cooldownDuration: appConfig.userService.jwksCacheTtlSeconds * 1000,
    },
  );

  async verifyAccessToken(
    accessToken: string,
  ): Promise<AuthenticatedUser | null> {
    try {
      const { payload } = await jwtVerify(accessToken, this.jwks, {
        issuer: appConfig.jwt.issuer,
        audience: appConfig.jwt.audience,
      });

      const userId = payload.sub;
      const authUserId =
        typeof payload.auth_user_id === 'string'
          ? payload.auth_user_id
          : null;

      if (!userId || !authUserId) {
        return null;
      }

      return { userId, authUserId };
    } catch {
      return null;
    }
  }
}

export const accessTokenVerifier: AccessTokenVerifierPort =
  new JwtAccessTokenVerifierAdapter();
