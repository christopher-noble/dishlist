const userServiceBaseUrl =
  process.env.EXPO_PUBLIC_USER_SERVICE_URL?.replace(/\/$/, '') ??
  'http://localhost:4001';

const recipeServiceGraphqlUrl =
  process.env.EXPO_PUBLIC_API_URL ??
  'http://localhost:4002/graphql';

export const authServiceConfig = {
  userServiceBaseUrl,
  betterAuthBasePath:
    process.env.EXPO_PUBLIC_USER_SERVICE_AUTH_PATH ?? '/api/auth',
  accessTokenIssuePath:
    process.env.EXPO_PUBLIC_USER_SERVICE_ACCESS_TOKEN_PATH ??
    '/api/auth/access-token',
  recipeServiceGraphqlUrl,
} as const;

export function buildUserServiceUrl(path: string): string {
  return `${authServiceConfig.userServiceBaseUrl}${path}`;
}

export function buildBetterAuthUrl(path: string): string {
  return `${authServiceConfig.userServiceBaseUrl}${authServiceConfig.betterAuthBasePath}${path}`;
}
