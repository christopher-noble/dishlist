import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v7 as uuidv7 } from 'uuid';

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../..',
);

export const LOCAL_UPLOAD_ROOT = path.join(packageRoot, 'public', 'uploads');

export function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');

  if (lastDot === -1 || lastDot === fileName.length - 1) {
    return 'jpg';
  }

  const extension = fileName
    .slice(lastDot + 1)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  return extension.length > 0 ? extension : 'jpg';
}

export function buildImageKey(userId: string, fileName: string): string {
  const extension = getFileExtension(fileName);
  return `recipes/${userId}/${uuidv7()}.${extension}`;
}

export function assertRelativeImageKey(imageKey: string): void {
  if (imageKey.includes('://')) {
    throw new Error(
      'imageKey must be a relative object key, not a full URL',
    );
  }
}

/** Accepts a storage key or a resolved uploads URL and returns the storage key. */
export function normalizeStorageImageKey(imageKey: string): string {
  if (!imageKey.includes('://')) {
    assertRelativeImageKey(imageKey);
    return imageKey;
  }

  const uploadsMarker = '/uploads/';
  const markerIndex = imageKey.indexOf(uploadsMarker);

  if (markerIndex === -1) {
    throw new Error(
      'imageKey must be a relative object key, not a full URL',
    );
  }

  const relativeKey = decodeURIComponent(
    imageKey.slice(markerIndex + uploadsMarker.length),
  );
  assertRelativeImageKey(relativeKey);
  return relativeKey;
}

export function assertImageKeyBelongsToUser(
  imageKey: string,
  userId: string,
): void {
  const expectedPrefix = `recipes/${userId}/`;

  if (!imageKey.startsWith(expectedPrefix)) {
    throw new Error('Image key does not belong to the authenticated user');
  }
}

export function resolveLocalUploadFilePath(imageKey: string): string {
  const normalizedKey = imageKey.replace(/^\/+/, '');
  const resolvedPath = path.resolve(LOCAL_UPLOAD_ROOT, normalizedKey);
  const relativePath = path.relative(LOCAL_UPLOAD_ROOT, resolvedPath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error('Invalid image key path');
  }

  return resolvedPath;
}

export function buildLocalUploadApiUrl(imageKey: string, publicBaseUrl: string): string {
  const encodedKey = imageKey
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  const base = publicBaseUrl.replace(/\/+$/, '');
  return `${base}/api/uploads/${encodedKey}`;
}
