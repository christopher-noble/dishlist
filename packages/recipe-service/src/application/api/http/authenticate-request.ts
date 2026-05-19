import type { AccessTokenVerifierPort } from '../../../domain/auth/ports/access-token-verifier.port.ts';
import type { AuthenticatedUser } from '../../../domain/auth/authenticated-user.ts';
import { accessTokenVerifier } from '../../../infrastructure/auth/jwt-access-token-verifier.adapter.ts';
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
