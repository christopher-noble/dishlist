# Recipe Service

GraphQL Yoga subgraph service for managing recipes.

## Prerequisites

1. Start the dev Postgres server from `../dev-environment`:
   ```bash
   cd ../dev-environment
   docker compose up -d
   ```

2. Create the database (if it doesn't exist):
   ```bash
   psql -h localhost -U postgres -c "CREATE DATABASE recipe_service;"
   ```

## Setup

```bash
pnpm install
pnpm db:generate
pnpm db:push
```

## Run

```bash
pnpm start
pnpm start:dev
```

GraphQL endpoint: `http://localhost:4002/graphql`

## Ingredients JSON migration

If `pnpm db:push` fails when changing `ingredients` from `text[]` to `jsonb`, run this from **this package directory** (`packages/recipe-service`):

```bash
pnpm db:migrate-ingredients
pnpm db:push
```

No `psql` required — the script uses the same Postgres connection as the app. Existing string ingredients become `{ item, amount: 0, unit: "" }`.

## Database

Connects to shared Postgres in `../dev-environment` using database `recipe_service`.

- Host: `localhost`
- Port: `5432`
- User: `postgres`
- Password: `postgres`
- Database: `recipe_service`

## GraphQL Operations

### Queries
- `recipes` - Get active recipes for the authenticated user (JWT required)
- `archivedRecipes(userId: ID!)` - Get archived recipes for a user
- `recipe(id: ID!)` - Get a single recipe

### Mutations
- `createRecipe(input: CreateRecipeInput!)` - Create a recipe
- `updateRecipe(id: ID!, input: UpdateRecipeInput!)` - Update a recipe
- `archiveRecipe(id: ID!)` - Archive a recipe

## S3 recipe ingestion

Batch job that exports SageMaker-ready JSONL shards plus a manifest from the `recipes` table to local disk (development) or S3 (staging/production). Lives in `jobs/s3-recipe-ingestion.ts`.

| Environment | Destination | Output |
| --- | --- | --- |
| development | local files | `.s3-recipe-ingestion/{runId}/` |
| staging / production | S3 | `s3://{bucket}/{prefix}/{runId}/` |

```bash
pnpm s3-recipe:ingest
```

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres URL (staging/production; dev uses `DB_*`) |
| `S3_RECIPE_INGESTION_BATCH_SIZE` | Keyset page size (default `500`) |
| `S3_RECIPE_INGESTION_SHARD_SIZE` | Records per JSONL shard (default `1000`) |
| `S3_RECIPE_INGESTION_INCLUDE_ARCHIVED` | Include archived recipes when `true` |
| `S3_RECIPE_INGESTION_LOCAL_OUTPUT_DIR` | Local output root (default `.s3-recipe-ingestion`) |
| `S3_RECIPE_INGESTION_S3_BUCKET_ARN` | e.g. `arn:aws:s3:::dishlist-ml-staging` |
| `S3_RECIPE_INGESTION_S3_PREFIX` | Object prefix (default `ml/recipe-ingestion`) |
| `AWS_REGION` | Required for S3 uploads in staging/production |

## Tests

```bash
pnpm test
pnpm test:e2e
pnpm test:cov
```
