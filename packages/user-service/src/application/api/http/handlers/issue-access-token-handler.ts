import type { IncomingMessage, ServerResponse } from 'node:http';

import { issueAccessTokenForSessionUser } from '../../../auth/issue-access-token-for-session.js';
import { getSessionFromNodeRequest } from '../../../../infrastructure/auth/get-session-from-node-request.js';

export async function handleIssueAccessToken(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Method not allowed' }));
    return;
  }

  const session = await getSessionFromNodeRequest(req);

  if (!session?.user) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Unauthorized' }));
    return;
  }

  try {
    const token = await issueAccessTokenForSessionUser({
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

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(token));
  } catch {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'User profile not found' }));
  }
}
