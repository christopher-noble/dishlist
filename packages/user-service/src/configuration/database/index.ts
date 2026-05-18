import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

import { authDatabasePool } from '../../infrastructure/database/auth-database-pool.js';

export const prisma = new PrismaClient({
  adapter: new PrismaPg(authDatabasePool),
});
