import type { IncomingMessage, ServerResponse } from 'node:http';

const DEFAULT_ALLOWED_HEADERS =
  'Content-Type, Authorization, Cookie, X-Requested-With';

function parseAllowedOrigins(): string[] {
  return (
    process.env.AUTH_TRUSTED_ORIGINS?.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean) ?? [
      'http://localhost:8081',
      'http://localhost:19006',
      'http://127.0.0.1:8081',
      'http://127.0.0.1:19006',
    ]
  );
}

export function applyCors(
  req: IncomingMessage,
  res: ServerResponse,
): { isPreflight: boolean } {
  const requestOrigin = req.headers.origin;
  const allowedOrigins = parseAllowedOrigins();
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

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return { isPreflight: true };
  }

  return { isPreflight: false };
}
