import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';

import { resolveLocalUploadFilePath } from '../../../../../infrastructure/media/image-key.ts';

const LOCAL_STATIC_PATH_PREFIX = '/uploads/';

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
};

function extractImageKeyFromStaticPath(pathname: string): string | null {
  if (!pathname.startsWith(LOCAL_STATIC_PATH_PREFIX)) {
    return null;
  }

  const encodedKey = pathname.slice(LOCAL_STATIC_PATH_PREFIX.length);

  if (!encodedKey) {
    return null;
  }

  return encodedKey
    .split('/')
    .map((segment) => decodeURIComponent(segment))
    .join('/');
}

function resolveContentType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();

  return CONTENT_TYPE_BY_EXTENSION[extension] ?? 'application/octet-stream';
}

/**
 * Dev-only static file serving from public/uploads. Not mounted when STORAGE_STRATEGY=s3.
 */
export async function handleServeLocalUpload(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  const imageKey = extractImageKeyFromStaticPath(url.pathname);

  if (!imageKey) {
    return false;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, HEAD');
    res.end('Method Not Allowed');
    return true;
  }

  try {
    const filePath = resolveLocalUploadFilePath(imageKey);
    const fileStats = await stat(filePath);

    if (!fileStats.isFile()) {
      res.statusCode = 404;
      res.end('Not Found');
      return true;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', resolveContentType(filePath));
    res.setHeader('Content-Length', fileStats.size);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    if (req.method === 'HEAD') {
      res.end();
      return true;
    }

    await new Promise<void>((resolve, reject) => {
      const stream = createReadStream(filePath);

      stream.on('error', reject);
      res.on('finish', resolve);
      res.on('close', resolve);
      stream.pipe(res);
    });

    return true;
  } catch {
    res.statusCode = 404;
    res.end('Not Found');
    return true;
  }
}
