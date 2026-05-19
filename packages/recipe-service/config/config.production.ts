const userServicePublicBaseUrl = process.env.USER_SERVICE_PUBLIC_URL ?? '';
const userServiceJwksPath =
  process.env.USER_SERVICE_JWKS_PATH ?? '/.well-known/jwks.json';

export const config = {
  dbUrl:
    process.env.DATABASE_URL ??
    'postgres://<username>:<password>@<host>:5432/<production_db_name>',
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
  media: {
    storageStrategy: 's3' as const,
  },
} as const;
