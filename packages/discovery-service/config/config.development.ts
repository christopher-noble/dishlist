const serverPort = Number(process.env.PORT ?? 4003);

const publicBaseUrl =
  process.env.DISCOVERY_SERVICE_PUBLIC_URL ?? `http://localhost:${serverPort}`;

const userServicePublicBaseUrl =
  process.env.USER_SERVICE_PUBLIC_URL ?? 'http://localhost:4001';

const userServiceJwksPath =
  process.env.USER_SERVICE_JWKS_PATH ?? '/.well-known/jwks.json';

export const config = {
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
