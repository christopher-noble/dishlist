import { readFileSync } from 'node:fs';
import { Pool } from 'pg';
import { appConfig } from '../config/config.default.ts';

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL ?? appConfig.dbUrl,
  });

  const client = await pool.connect();

  try {
    const { rows } = await client.query<{
      data_type: string;
      udt_name: string;
    }>(`
      SELECT data_type, udt_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'recipes'
        AND column_name = 'ingredients'
    `);

    const column = rows[0];
    if (!column) {
      throw new Error('recipes.ingredients column not found');
    }

    const isJsonb =
      column.data_type === 'jsonb' || column.udt_name === 'jsonb';

    if (isJsonb) {
      console.log('recipes.ingredients is already jsonb — nothing to do.');
      return;
    }

    const isTextArray =
      column.data_type === 'ARRAY' || column.udt_name === '_text';

    if (!isTextArray) {
      throw new Error(
        `Unexpected ingredients type: ${column.data_type} (${column.udt_name}). Migrate manually.`,
      );
    }

    const sqlPath = new URL('./migrate-ingredients-to-json.sql', import.meta.url);
    const sql = readFileSync(sqlPath, 'utf8');

    console.log('Converting recipes.ingredients from text[] to jsonb…');
    await client.query(sql);
    console.log('Done. Run: pnpm db:push');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(
    'Migration failed:',
    error instanceof Error ? error.message : String(error),
  );
  process.exitCode = 1;
});
