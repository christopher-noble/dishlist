import type { IncomingMessage } from 'node:http';
import { fromNodeHeaders } from 'better-auth/node';

import { auth } from './better-auth.js';

const BEARER_PREFIX = 'bearer ';
const SESSION_COOKIE_NAME = 'better-auth.session_token';

/**
 * Resolves the Better Auth session from a Node request, including `Authorization: Bearer`
 * session tokens sent by the mobile/web client when cookies are unavailable cross-origin.
 */
export async function getSessionFromNodeRequest(req: IncomingMessage) {
  const bearerToken = getBearerToken(req);

  if (bearerToken && !isLikelyAccessJwt(bearerToken)) {
    if (!bearerToken.includes('.')) {
      const ctx = await auth.$context;
      const found = await ctx.internalAdapter.findSession(bearerToken);

      if (
        found &&
        new Date(found.session.expiresAt).getTime() > Date.now()
      ) {
        return found;
      }

      return null;
    }

    const headers = new Headers(fromNodeHeaders(req.headers));
    const existingCookie = headers.get('cookie');
    const sessionCookie = `${SESSION_COOKIE_NAME}=${bearerToken}`;

    headers.set(
      'cookie',
      existingCookie ? `${existingCookie}; ${sessionCookie}` : sessionCookie,
    );

    return auth.api.getSession({ headers });
  }

  return auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
}

function getBearerToken(req: IncomingMessage): string | null {
  const authorization = req.headers.authorization;
  if (!authorization?.toLowerCase().startsWith(BEARER_PREFIX)) {
    return null;
  }

  return authorization.slice(BEARER_PREFIX.length).trim() || null;
}

/** Recipe-service access JWTs are RS256 JWS values; session tokens are not. */
function isLikelyAccessJwt(token: string): boolean {
  const parts = token.split('.');
  return parts.length === 3 && parts[0]?.startsWith('ey');
}
