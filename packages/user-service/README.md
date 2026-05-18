# User Service

GraphQL Yoga + Apollo Federation subgraph service (TypeScript).

## Prerequisites

1. Start the dev Postgres server from `../dev-environment`:
   ```bash
   cd ../dev-environment
   docker compose up -d
   ```

2. Create the database (if it doesn't exist):
   ```bash
   # Connect to Postgres and create the database
   psql -h localhost -U postgres -c "CREATE DATABASE user_service_development;"
   # Or use the default 'postgres' database and let TypeORM create it
   ```

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# start (ts-node)
$ pnpm run start

# dev (ts-node)
$ pnpm run start:dev
```

GraphQL endpoint: `http://localhost:4001/graphql`

## Database

This service connects to the shared Postgres server in `../dev-environment` and uses the database `user_service_development`. Tables are automatically created via TypeORM when the service starts (synchronize mode enabled in development).

Connection details:
- Host: `localhost`
- Port: `5432`
- User: `postgres`
- Password: `postgres`
- Database: `user_service_development`

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Stay in touch

- Author - [Chris Noble](https://linkedin.com/in/christopher-noble)

## License

This app is MIT Licensed.
