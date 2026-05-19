import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { buildImageKey } from '../image-key.ts';
import type { UploadTarget } from '../upload-target.ts';
import {
  getAwsRegion,
  getPresignExpiresInSeconds,
  getS3BucketName,
} from '../media-config.ts';

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({ region: getAwsRegion() });
  }

  return s3Client;
}

/**
 * Stateless S3 path: mints a presigned PUT URL only. No request bodies pass through Node.
 */
export async function createS3UploadTarget(
  userId: string,
  fileName: string,
  fileType: string,
): Promise<UploadTarget> {
  const imageKey = buildImageKey(userId, fileName);

  const command = new PutObjectCommand({
    Bucket: getS3BucketName(),
    Key: imageKey,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(getS3Client(), command, {
    expiresIn: getPresignExpiresInSeconds(),
  });

  return { uploadUrl, imageKey };
}
