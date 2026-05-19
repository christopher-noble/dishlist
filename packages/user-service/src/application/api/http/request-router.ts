import type { IncomingMessage, ServerResponse } from 'node:http';
import { toNodeHandler } from 'better-auth/node';

import { appConfig } from '../../../../config/config.default.js';
import { auth } from '../../../infrastructure/auth/better-auth.js';
import { applyCors } from './cors.js';
import { handleIssueAccessToken } from './handlers/issue-access-token-handler.js';
import { handleJwks } from './handlers/jwks-handler.js';
import { handleUsersMe } from './users-me-handler.js';

const authHandler = toNodeHandler(auth);

export async function routeHttpRequest(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => Promise<void>,
): Promise<void> {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  const pathname = url.pathname;

  const needsCors =
    pathname.startsWith(appConfig.auth.betterAuthBasePath) ||
    pathname.startsWith('/api/users') ||
    pathname === appConfig.auth.jwksPath;

  if (needsCors) {
    const { isPreflight } = applyCors(req, res);
    if (isPreflight) {
      return;
    }
  }

  if (pathname === appConfig.auth.jwksPath) {
    await handleJwks(req, res);
    return;
  }

  if (pathname === appConfig.auth.accessTokenIssuePath) {
    await handleIssueAccessToken(req, res);
    return;
  }

  if (pathname.startsWith(appConfig.auth.betterAuthBasePath)) {
    await authHandler(req, res);
    return;
  }

  if (pathname === '/api/users/me') {
    await handleUsersMe(req, res);
    return;
  }

  await next();
}
