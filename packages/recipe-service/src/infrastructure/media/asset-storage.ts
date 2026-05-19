import { assertRelativeImageKey } from './image-key.ts';
import {
  getCloudfrontDomain,
  getLocalAssetServer,
  getStorageStrategy,
  joinUrl,
} from './media-config.ts';
import { createLocalUploadTarget } from './strategies/local-media.strategy.ts';
import { createS3UploadTarget } from './strategies/s3-media.strategy.ts';
import type { UploadTarget } from './upload-target.ts';

export type { StorageStrategy } from './media-config.ts';
export type { UploadTarget } from './upload-target.ts';

export { assertImageKeyBelongsToUser } from './image-key.ts';
export { getStorageStrategy, isLocalMediaStrategy } from './media-config.ts';

/**
 * Maps a Postgres object key to a client-renderable URL.
 * S3 mode: CloudFront edge URL only (no bytes through recipe-service).
 * Local mode: static asset base URL for offline development.
 */
export function resolveImageUrl(imageKey: string | null): string | null {
  if (!imageKey) {
    return null;
  }

  if (imageKey.includes('://')) {
    return imageKey;
  }

  assertRelativeImageKey(imageKey);

  if (getStorageStrategy() === 's3') {
    return joinUrl(getCloudfrontDomain(), imageKey);
  }

  return joinUrl(getLocalAssetServer(), imageKey);
}

/**
 * Returns a direct-upload target for the client. S3 mode issues a presigned PUT URL.
 * Local mode returns a dev-only API route (see local-dev-media router).
 */
export async function createUploadTarget(
  userId: string,
  fileName: string,
  fileType: string,
): Promise<UploadTarget> {
  if (!userId.trim()) {
    throw new Error('userId is required to create an upload target');
  }

  if (!fileName.trim()) {
    throw new Error('fileName is required to create an upload target');
  }

  if (!fileType.trim()) {
    throw new Error('fileType is required to create an upload target');
  }

  if (getStorageStrategy() === 's3') {
    return createS3UploadTarget(userId, fileName, fileType);
  }

  return createLocalUploadTarget(userId, fileName);
}
