import { mkdir, writeFile } from 'node:fs/promises';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';

import { authenticateRequest } from '../../authenticate-request.ts';
import { applyMediaCors } from '../../media-cors.ts';
import {
  assertImageKeyBelongsToUser,
} from '../../../../../infrastructure/media/asset-storage.ts';
import { resolveLocalUploadFilePath } from '../../../../../infrastructure/media/image-key.ts';

const LOCAL_UPLOAD_PATH_PREFIX = '/api/uploads/';

function readRequestBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    req.on('error', reject);
  });
}

function extractImageKeyFromPath(pathname: string): string | null {
  if (!pathname.startsWith(LOCAL_UPLOAD_PATH_PREFIX)) {
    return null;
  }

  const encodedKey = pathname.slice(LOCAL_UPLOAD_PATH_PREFIX.length);

  if (!encodedKey) {
    return null;
  }

  return encodedKey
    .split('/')
    .map((segment) => decodeURIComponent(segment))
    .join('/');
}

export async function handleLocalUpload(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  const imageKey = extractImageKeyFromPath(url.pathname);

  if (!imageKey) {
    return false;
  }

  const { isPreflight } = applyMediaCors(req, res);

  if (isPreflight) {
    return true;
  }

  if (req.method !== 'PUT') {
    res.statusCode = 405;
    res.setHeader('Allow', 'PUT, OPTIONS');
    res.end('Method Not Allowed');
    return true;
  }

  const authHeaders = new Headers();

  for (const [headerName, headerValue] of Object.entries(req.headers)) {
    if (headerValue === undefined) {
      continue;
    }

    authHeaders.set(
      headerName,
      Array.isArray(headerValue) ? headerValue.join(',') : headerValue,
    );
  }

  const authenticatedUser = await authenticateRequest(
    new Request(url.toString(), {
      method: req.method ?? 'PUT',
      headers: authHeaders,
    }),
  );

  if (!authenticatedUser) {
    res.statusCode = 401;
    res.end('Unauthorized');
    return true;
  }

  try {
    assertImageKeyBelongsToUser(imageKey, authenticatedUser.userId);
    const filePath = resolveLocalUploadFilePath(imageKey);
    const body = await readRequestBody(req);

    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, body);

    res.statusCode = 204;
    res.end();
    return true;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to store upload';

    res.statusCode = message.includes('does not belong') ? 403 : 400;
    res.end(message);
    return true;
  }
}
