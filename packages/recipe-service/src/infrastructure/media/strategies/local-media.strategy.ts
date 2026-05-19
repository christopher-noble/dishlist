import { appConfig } from '../../../../config/config.default.ts';
import {
  buildImageKey,
  buildLocalUploadApiUrl,
} from '../image-key.ts';
import type { UploadTarget } from '../upload-target.ts';

/**
 * Local-dev path: returns a recipe-service upload route. Binary is handled only by
 * the local-dev media HTTP handlers (never used when STORAGE_STRATEGY=s3).
 */
export function createLocalUploadTarget(
  userId: string,
  fileName: string,
): UploadTarget {
  const imageKey = buildImageKey(userId, fileName);

  return {
    imageKey,
    uploadUrl: buildLocalUploadApiUrl(
      imageKey,
      appConfig.server.publicBaseUrl,
    ),
  };
}
