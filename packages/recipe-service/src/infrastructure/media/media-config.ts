import { appConfig } from '../../../config/config.default.ts';

export type StorageStrategy = 's3' | 'local';

function isDevelopmentEnv(): boolean {
  return (process.env.NODE_ENV ?? 'development').toLowerCase() === 'development';
}

function hasCloudfrontConfigured(): boolean {
  return Boolean(process.env.CLOUDFRONT_DOMAIN?.trim());
}

/**
 * Resolves media storage for this process.
 * Development defaults to `local` so CloudFront/S3 credentials are not required.
 * Explicit `STORAGE_STRATEGY=s3` in development still falls back to `local` when
 * `CLOUDFRONT_DOMAIN` is unset.
 */
export function getStorageStrategy(): StorageStrategy {
  const explicit = process.env.STORAGE_STRATEGY?.trim().toLowerCase();

  if (explicit && explicit !== 's3' && explicit !== 'local') {
    throw new Error(
      `Invalid STORAGE_STRATEGY "${process.env.STORAGE_STRATEGY}". Expected "s3" or "local".`,
    );
  }

  if (explicit === 'local') {
    return 'local';
  }

  if (explicit === 's3') {
    if (isDevelopmentEnv() && !hasCloudfrontConfigured()) {
      return 'local';
    }
    return 's3';
  }

  return isDevelopmentEnv() ? 'local' : 's3';
}

export function isLocalMediaStrategy(): boolean {
  return getStorageStrategy() === 'local';
}

export function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export function trimLeadingSlash(value: string): string {
  return value.replace(/^\/+/, '');
}

export function joinUrl(base: string, key: string): string {
  return `${trimTrailingSlash(base)}/${trimLeadingSlash(key)}`;
}

export function getCloudfrontDomain(): string {
  const domain = process.env.CLOUDFRONT_DOMAIN?.trim();

  if (!domain) {
    throw new Error('CLOUDFRONT_DOMAIN is required when STORAGE_STRATEGY=s3');
  }

  return domain.startsWith('http://') || domain.startsWith('https://')
    ? trimTrailingSlash(domain)
    : `https://${trimTrailingSlash(domain)}`;
}

export function getLocalAssetServer(): string {
  const configured = process.env.LOCAL_ASSET_SERVER?.trim();

  if (configured) {
    return trimTrailingSlash(configured);
  }

  return joinUrl(appConfig.server.publicBaseUrl, 'uploads');
}

export function getS3BucketName(): string {
  const bucket = process.env.S3_BUCKET?.trim();

  if (!bucket) {
    throw new Error('S3_BUCKET is required when STORAGE_STRATEGY=s3');
  }

  return bucket;
}

export function getAwsRegion(): string {
  const region =
    process.env.AWS_REGION?.trim() ?? process.env.AWS_DEFAULT_REGION?.trim();

  if (!region) {
    throw new Error('AWS_REGION is required when STORAGE_STRATEGY=s3');
  }

  return region;
}

export function getPresignExpiresInSeconds(): number {
  const expiresIn = Number(process.env.S3_PRESIGN_EXPIRES_SECONDS ?? 900);

  if (!Number.isFinite(expiresIn) || expiresIn <= 0) {
    throw new Error('S3_PRESIGN_EXPIRES_SECONDS must be a positive number');
  }

  return expiresIn;
}
