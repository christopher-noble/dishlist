const dbUser = process.env.DB_USER ?? 'postgres';
const dbPassword = process.env.DB_PASSWORD ?? 'postgres';
const dbHost = process.env.DB_HOST ?? 'localhost';
const dbPort = process.env.DB_PORT ?? '5432';
const dbName = process.env.DB_NAME ?? 'user_service';

const serverPort = Number(process.env.PORT ?? 4001);

const publicBaseUrl =
  process.env.USER_SERVICE_PUBLIC_URL ?? `http://localhost:${serverPort}`;

const defaultTrustedOrigins = [
  'http://localhost:8081',
  'http://localhost:19006',
  'http://127.0.0.1:8081',
  'http://127.0.0.1:19006',
  'dishlist://',
  'dishlist://*',
  'exp://',
  'exp://*',
  'exp://**',
];

const trustedOriginsFromEnv = process.env.AUTH_TRUSTED_ORIGINS?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const config = {
  dbUrl: `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
  server: {
    port: serverPort,
    publicBaseUrl,
  },
  cors: {
    trustedOrigins:
      trustedOriginsFromEnv && trustedOriginsFromEnv.length > 0
        ? trustedOriginsFromEnv
        : defaultTrustedOrigins,
  },
  auth: {
    betterAuthBasePath: '/api/auth',
    accessTokenIssuePath: '/api/auth/access-token',
    jwksPath: '/.well-known/jwks.json',
    betterAuthSecret:
      process.env.BETTER_AUTH_SECRET ??
      'dev-only-secret-replace-in-production-32chars!!',
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
    publicBaseUrl:
      process.env.RECIPE_SERVICE_PUBLIC_URL ?? 'http://localhost:4002',
  },
} as const;
