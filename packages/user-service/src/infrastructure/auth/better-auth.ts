import { betterAuth } from 'better-auth';
import { APIError } from 'better-auth/api';

import { appConfig } from '../../../config/config.default.js';
import { authDatabasePool } from '../database/auth-database-pool.js';
import { createApplicationUserProfile } from './create-application-user-profile.js';

const isProduction = process.env.NODE_ENV === 'production';

function parseTrustedOrigins(): string[] {
  const fromEnv = process.env.AUTH_TRUSTED_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (fromEnv?.length) {
    return fromEnv;
  }

  return [
    'http://localhost:8081',
    'http://localhost:19006',
    'http://localhost:4001',
    'http://127.0.0.1:8081',
    'http://127.0.0.1:19006',
    'dishlist://',
    'dishlist://*',
    'exp://',
    'exp://*',
    'exp://**',
  ];
}

export const auth = betterAuth({
  appName: 'dishlist',
  baseURL: process.env.BETTER_AUTH_URL ?? `http://localhost:${process.env.PORT ?? 4001}`,
  basePath: '/api/auth',
  secret:
    process.env.BETTER_AUTH_SECRET ??
    'dev-only-secret-replace-in-production-32chars!!',
  database: authDatabasePool,
  trustedOrigins: parseTrustedOrigins(),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    modelName: 'auth_user',
    additionalFields: {
      firstName: {
        type: 'string',
        required: true,
        input: true,
      },
      lastName: {
        type: 'string',
        required: true,
        input: true,
      },
    },
  },
  session: {
    modelName: 'session',
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  account: {
    modelName: 'account',
  },
  verification: {
    modelName: 'verification',
  },
  advanced: {
    useSecureCookies: isProduction,
    defaultCookieAttributes: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (authUser) => {
          try {
            await createApplicationUserProfile({
              id: authUser.id,
              name: authUser.name,
              email: authUser.email,
              firstName:
                'firstName' in authUser
                  ? (authUser.firstName as string | null | undefined)
                  : undefined,
              lastName:
                'lastName' in authUser
                  ? (authUser.lastName as string | null | undefined)
                  : undefined,
            });
          } catch (error) {
            throw new APIError('INTERNAL_SERVER_ERROR', {
              message: 'Failed to create application user profile',
              cause: error,
            });
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
