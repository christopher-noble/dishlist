import type { IncomingMessage, ServerResponse } from 'node:http';

import { appConfig } from '../../../../config/config.default.js';

const DEFAULT_ALLOWED_HEADERS =
  'Content-Type, Authorization, Cookie, X-Requested-With';

export function applyCors(
  req: IncomingMessage,
  res: ServerResponse,
): { isPreflight: boolean } {
  const requestOrigin = req.headers.origin;
  const allowedOrigins = appConfig.cors.trustedOrigins;
  const isAllowedOrigin =
    requestOrigin &&
    allowedOrigins.some(
      (allowed) =>
        allowed === requestOrigin ||
        (allowed.endsWith('://') && requestOrigin.startsWith(allowed)),
    );

  if (isAllowedOrigin && requestOrigin) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    req.headers['access-control-request-headers'] ?? DEFAULT_ALLOWED_HEADERS,
  );
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Access-Control-Expose-Headers', 'set-auth-token');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return { isPreflight: true };
  }

  return { isPreflight: false };
}
