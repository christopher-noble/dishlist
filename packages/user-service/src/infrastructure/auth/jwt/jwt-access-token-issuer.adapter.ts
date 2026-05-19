import { SignJWT } from 'jose';

import { appConfig } from '../../../../config/config.default.js';
import type {
  AccessTokenClaims,
  IssuedAccessToken,
} from '../../../domain/auth/access-token-claims.js';
import type { AccessTokenIssuerPort } from '../../../domain/auth/ports/access-token-issuer.port.js';
import { getJwtSigningKeyMaterial } from './jwt-signing-key-set.js';

export class JwtAccessTokenIssuerAdapter implements AccessTokenIssuerPort {
  async issueAccessToken(claims: AccessTokenClaims): Promise<IssuedAccessToken> {
    const { privateKey, kid } = await getJwtSigningKeyMaterial();
    const expiresAtDate = new Date(
      Date.now() + appConfig.jwt.accessTokenTtlSeconds * 1000,
    );

    const accessToken = await new SignJWT({
      auth_user_id: claims.authUserId,
    })
      .setProtectedHeader({ alg: 'RS256', kid })
      .setSubject(claims.sub)
      .setIssuer(appConfig.jwt.issuer)
      .setAudience(appConfig.jwt.audience)
      .setIssuedAt()
      .setExpirationTime(expiresAtDate)
      .sign(privateKey);

    return {
      accessToken,
      expiresAt: expiresAtDate.toISOString(),
    };
  }
}

export const accessTokenIssuer: AccessTokenIssuerPort =
  new JwtAccessTokenIssuerAdapter();
