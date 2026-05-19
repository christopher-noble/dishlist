import type {
  AccessTokenClaims,
  IssuedAccessToken,
} from '../access-token-claims.js';

export interface AccessTokenIssuerPort {
  issueAccessToken(claims: AccessTokenClaims): Promise<IssuedAccessToken>;
}
