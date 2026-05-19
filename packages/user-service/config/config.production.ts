export const config = {
  dbUrl:
    process.env.DATABASE_URL ??
    'postgres://<username>:<password>@<host>:5432/<production_db_name>',
  server: {
    port: Number(process.env.PORT ?? 4001),
    publicBaseUrl: process.env.USER_SERVICE_PUBLIC_URL ?? '',
  },
  cors: {
    trustedOrigins: (process.env.AUTH_TRUSTED_ORIGINS ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  },
  auth: {
    betterAuthBasePath: '/api/auth',
    accessTokenIssuePath: '/api/auth/access-token',
    jwksPath: '/.well-known/jwks.json',
    betterAuthSecret: process.env.BETTER_AUTH_SECRET ?? '',
  },
  jwt: {
    issuer: process.env.JWT_ISSUER ?? 'dishlist-user-service',
    audience: process.env.JWT_AUDIENCE ?? 'dishlist-api',
    accessTokenTtlSeconds: Number(
      process.env.JWT_ACCESS_TOKEN_TTL_SECONDS ?? 600,
    ),
    privateKeyPem: process.env.JWT_PRIVATE_KEY_PEM,
    publicKeyPem: process.env.JWT_PUBLIC_KEY_PEM,
  },
  recipeService: {
    publicBaseUrl: process.env.RECIPE_SERVICE_PUBLIC_URL ?? '',
  },
} as const;
