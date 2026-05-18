import { Pool } from 'pg';

import { appConfig } from '../../../config/config.default.js';

/**
 * Shared PostgreSQL pool for Better Auth (Kysely adapter) and Prisma driver adapter.
 */
export const authDatabasePool = new Pool({ connectionString: appConfig.dbUrl });
