import { Pool } from 'pg';
import { appConfig } from './config/config.default.js';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

export default {
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || appConfig.dbUrl,
  },
};
