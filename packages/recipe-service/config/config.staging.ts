const userServicePublicBaseUrl = process.env.USER_SERVICE_PUBLIC_URL ?? '';
const userServiceJwksPath =
  process.env.USER_SERVICE_JWKS_PATH ?? '/.well-known/jwks.json';

export const config = {
  dbUrl:
    process.env.DATABASE_URL ??
    'postgres://<username>:<password>@<host>:5432/<staging_db_name>',
  server: {
    port: Number(process.env.PORT ?? 4002),
    publicBaseUrl: process.env.RECIPE_SERVICE_PUBLIC_URL ?? '',
  },
  userService: {
    publicBaseUrl: userServicePublicBaseUrl,
    jwksPath: userServiceJwksPath,
    jwksUrl: `${userServicePublicBaseUrl}${userServiceJwksPath}`,
    jwksCacheTtlSeconds: Number(process.env.JWKS_CACHE_TTL_SECONDS ?? 3600),
  },
  jwt: {
    issuer: process.env.JWT_ISSUER ?? 'dishlist-user-service',
    audience: process.env.JWT_AUDIENCE ?? 'dishlist-api',
  },
  s3RecipeIngestion: {
    destinationStrategy: 's3' as const,
    batchSize: Number(process.env.S3_RECIPE_INGESTION_BATCH_SIZE ?? 500),
    shardSize: Number(process.env.S3_RECIPE_INGESTION_SHARD_SIZE ?? 1000),
    includeArchived: process.env.S3_RECIPE_INGESTION_INCLUDE_ARCHIVED === 'true',
    schemaVersion: process.env.S3_RECIPE_INGESTION_SCHEMA_VERSION ?? '1.0.0',
    localOutputDir:
      process.env.S3_RECIPE_INGESTION_LOCAL_OUTPUT_DIR ?? '.s3-recipe-ingestion',
    s3: {
      bucketArn: process.env.S3_RECIPE_INGESTION_S3_BUCKET_ARN ?? '',
      prefix: process.env.S3_RECIPE_INGESTION_S3_PREFIX ?? 'ml/recipe-ingestion',
      region:
        process.env.AWS_REGION?.trim() ??
        process.env.AWS_DEFAULT_REGION?.trim() ??
        '',
    },
  },
} as const;
