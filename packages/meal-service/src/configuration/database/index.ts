import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';
import { appConfig } from '../../../config/config.default.ts';

const pool = new Pool({ connectionString: appConfig.dbUrl });
export const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
