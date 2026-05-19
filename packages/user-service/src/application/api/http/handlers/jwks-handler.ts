import type { IncomingMessage, ServerResponse } from 'node:http';

import { buildJwksDocument } from '../../../../infrastructure/auth/jwt/jwt-signing-key-set.js';

export async function handleJwks(
  _req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const jwks = await buildJwksDocument();

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.end(JSON.stringify(jwks));
}
