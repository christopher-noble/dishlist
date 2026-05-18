/**
 * Applies Better Auth sidecar tables (auth_user, session, account, verification).
 *
 * Idempotent (IF NOT EXISTS) — safe in dev startup and as a one-time deploy step.
 * Do not run on every production app instance boot; run `pnpm db:deploy` once per
 * release in CI/CD before rolling out new servers.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

import { appConfig } from '../config/config.default.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(__dirname, '../prisma/migrations/better-auth-sidecar.sql');

async function main() {
  const sql = readFileSync(sqlPath, 'utf8');
  const client = new pg.Client({ connectionString: appConfig.dbUrl });

  await client.connect();

  try {
    await client.query(sql);
    console.log('Better Auth schema applied (auth_user, session, account, verification).');
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Failed to apply Better Auth schema:', error);
  process.exitCode = 1;
});
