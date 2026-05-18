import type { IncomingMessage, ServerResponse } from 'node:http';
import { toNodeHandler } from 'better-auth/node';

import { auth } from '../../../infrastructure/auth/better-auth.js';
import { applyCors } from './cors.js';
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
    pathname.startsWith('/api/auth') || pathname.startsWith('/api/users');

  if (needsCors) {
    const { isPreflight } = applyCors(req, res);
    if (isPreflight) {
      return;
    }
  }

  if (pathname.startsWith('/api/auth')) {
    await authHandler(req, res);
    return;
  }

  if (pathname === '/api/users/me') {
    await handleUsersMe(req, res);
    return;
  }

  await next();
}
