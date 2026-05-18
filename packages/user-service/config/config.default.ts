import { config as development } from './config.development.js';
import { config as production } from './config.production.js';
import { config as staging } from './config.staging.js';

const env = (process.env.NODE_ENV ?? 'development').toLowerCase();

const configs: Record<string, { dbUrl: string }> = {
  development,
  staging,
  production,
};

export const appConfig = configs[env] ?? development;
