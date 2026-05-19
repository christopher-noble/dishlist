import { betterAuth } from 'better-auth';
import { APIError } from 'better-auth/api';
import { bearer } from 'better-auth/plugins';

import { appConfig } from '../../../config/config.default.js';
import { authDatabasePool } from '../database/auth-database-pool.js';
import { createApplicationUserProfile } from './create-application-user-profile.js';

const isProduction = process.env.NODE_ENV === 'production';

export const auth = betterAuth({
  appName: 'dishlist',
  baseURL: appConfig.server.publicBaseUrl,
  basePath: appConfig.auth.betterAuthBasePath,
  secret: appConfig.auth.betterAuthSecret,
  database: authDatabasePool,
  trustedOrigins: [...appConfig.cors.trustedOrigins],
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
  plugins: [bearer()],
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
