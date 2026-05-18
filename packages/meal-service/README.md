# Meal Service

GraphQL Yoga subgraph service for managing meals.

## Prerequisites

1. Start the dev Postgres server from `../dev-environment`:
   ```bash
   cd ../dev-environment
   docker compose up -d
   ```

2. Create the database (if it doesn't exist):
   ```bash
   psql -h localhost -U postgres -c "CREATE DATABASE meal_service;"
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

## Database

Connects to shared Postgres in `../dev-environment` using database `meal_service`.

- Host: `localhost`
- Port: `5432`
- User: `postgres`
- Password: `postgres`
- Database: `meal_service`

## GraphQL Operations

### Queries
- `meals(userId: ID!)` - Get active meals for a user
- `archivedMeals(userId: ID!)` - Get archived meals for a user
- `meal(id: ID!)` - Get a single meal

### Mutations
- `createMeal(input: CreateMealInput!)` - Create a meal
- `updateMeal(id: ID!, input: UpdateMealInput!)` - Update a meal
- `archiveMeal(id: ID!)` - Archive a meal

## Tests

```bash
pnpm test
pnpm test:e2e
pnpm test:cov
```
