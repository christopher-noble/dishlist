import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
});

try {
  const result = await pool.query(`
    SELECT datname 
    FROM pg_database 
    WHERE datistemplate = false
    ORDER BY datname;
  `);
  
  console.log('Databases on server:');
  result.rows.forEach((row) => {
    console.log(`  - ${row.datname}`);
  });
  
  await pool.end();
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
