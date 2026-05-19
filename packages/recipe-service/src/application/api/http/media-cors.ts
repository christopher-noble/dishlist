import type { IncomingMessage, ServerResponse } from 'node:http';

const DEFAULT_ALLOWED_HEADERS = [
  'Authorization',
  'Content-Type',
  'X-Requested-With',
].join(', ');

function resolveAllowedOrigin(req: IncomingMessage): string {
  const configured = process.env.MEDIA_UPLOAD_CORS_ORIGIN?.trim();

  if (configured) {
    return configured;
  }

  const requestOrigin = req.headers.origin;

  if (requestOrigin) {
    return requestOrigin;
  }

  return '*';
}

export function applyMediaCors(
  req: IncomingMessage,
  res: ServerResponse,
): { isPreflight: boolean } {
  res.setHeader('Access-Control-Allow-Origin', resolveAllowedOrigin(req));
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', DEFAULT_ALLOWED_HEADERS);
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return { isPreflight: true };
  }

  return { isPreflight: false };
}
