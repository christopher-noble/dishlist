const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '5432';
const dbName = process.env.DB_NAME || 'user_service';

export const config = {
  dbUrl: `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
};
