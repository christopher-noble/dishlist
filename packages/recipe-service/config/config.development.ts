const dbUser = process.env.DB_USER ?? 'postgres';
const dbPassword = process.env.DB_PASSWORD ?? 'postgres';
const dbHost = process.env.DB_HOST ?? 'localhost';
const dbPort = process.env.DB_PORT ?? '5432';
const dbName = process.env.DB_NAME ?? 'recipe_service';

const serverPort = Number(process.env.PORT ?? 4002);

const publicBaseUrl =
  process.env.RECIPE_SERVICE_PUBLIC_URL ?? `http://localhost:${serverPort}`;

const userServicePublicBaseUrl =
  process.env.USER_SERVICE_PUBLIC_URL ?? 'http://localhost:4001';

const userServiceJwksPath =
  process.env.USER_SERVICE_JWKS_PATH ?? '/.well-known/jwks.json';

export const config = {
  dbUrl: `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
  server: {
    port: serverPort,
    publicBaseUrl,
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
} as const;
