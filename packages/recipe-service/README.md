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

## Tests

```bash
pnpm test
pnpm test:e2e
pnpm test:cov
```
