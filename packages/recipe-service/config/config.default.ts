import { config as development } from './config.development.ts';
import { config as production } from './config.production.ts';
import { config as staging } from './config.staging.ts';

const env = (process.env.NODE_ENV ?? 'development').toLowerCase();

const configs = {
  development,
  staging,
  production,
} as const;

export const appConfig = configs[env as keyof typeof configs] ?? development;

export type AppConfig = typeof development;
