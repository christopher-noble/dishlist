import type { AccessTokenVerifierPort } from '../../../domain/auth/ports/access-token-verifier.port.js';
import type { AuthenticatedUser } from '../../../domain/auth/authenticated-user.js';
import { accessTokenVerifier } from '../../../infrastructure/auth/jwt-access-token-verifier.adapter.js';
import { extractBearerToken } from './extract-bearer-token.js';

export async function authenticateRequest(
  request: Request,
  verifier: AccessTokenVerifierPort = accessTokenVerifier,
): Promise<AuthenticatedUser | null> {
  const bearerToken = extractBearerToken(
    request.headers.get('authorization'),
  );

  if (!bearerToken) {
    return null;
  }

  return verifier.verifyAccessToken(bearerToken);
}
