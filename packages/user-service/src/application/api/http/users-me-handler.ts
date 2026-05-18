import type { IncomingMessage, ServerResponse } from 'node:http';
import { fromNodeHeaders } from 'better-auth/node';

import { auth } from '../../../infrastructure/auth/better-auth.js';
import { resolveUserProfileForAuthUser } from '../../../infrastructure/auth/resolve-user-profile.js';

export async function handleUsersMe(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Method not allowed' }));
    return;
  }

  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.user) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Unauthorized' }));
    return;
  }

  const user = await resolveUserProfileForAuthUser({
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    firstName:
      'firstName' in session.user
        ? (session.user.firstName as string | null | undefined)
        : undefined,
    lastName:
      'lastName' in session.user
        ? (session.user.lastName as string | null | undefined)
        : undefined,
  });

  if (!user) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'User profile not found' }));
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      user: {
        id: user.id,
        authUserId: user.authUserId,
        firstName: user.firstName,
        lastName: user.lastName,
        primaryEmail: user.primaryEmail,
        secondaryEmail: user.secondaryEmail,
        accountStatus: user.accountStatus,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      session: {
        id: session.session.id,
        expiresAt: session.session.expiresAt,
      },
    }),
  );
}
