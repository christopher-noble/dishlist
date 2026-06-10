# Discovery Service

Apollo Federation subgraph that will power the mobile Discover experience.

## Architecture

Hexagonal layout, consistent with `user-service` and `recipe-service`:

```
src/
├── application/          # GraphQL API, HTTP routing, auth middleware
├── configuration/        # Dependency injection (tsyringe)
├── domain/                 # Entities, ports, provider adapters
└── infrastructure/         # JWT verification, repository adapters
```

| Layer | Responsibility |
| --- | --- |
| **Application** | GraphQL schema, resolvers, request context |
| **Domain** | `DiscoverFeedProviderPort`, entities, business rules |
| **Infrastructure** | JWT verification via user-service JWKS, stub repository |

Data is not wired to the frontend yet. The repository adapter returns an empty `generatedRecipes` list until curation/personalization is implemented.

## Prerequisites

`user-service` should be running so JWT verification can reach its JWKS endpoint during authenticated queries.

## Project setup

```bash
pnpm install
```

## Run

```bash
# one-off
pnpm start

# watch mode
pnpm start:dev
```

GraphQL endpoint: `http://localhost:4003/graphql`

## Queries

| Query | Auth | Status |
| --- | --- | --- |
| `discoverHealth` | No | Ready |
| `discoverCategories` | No | Returns static category metadata |
| `discoverFeed` | Yes | Scaffolded; `generatedRecipes` is empty |

### Example

```graphql
query {
  discoverHealth
  discoverCategories {
    id
    label
    emoji
  }
}
```

## Tests

```bash
pnpm test
pnpm test:e2e
```

## Next steps

- Add persistence (Prisma) for curated/trending feeds
- Integrate with `recipe-service` for recipe hydration
- Register subgraph in the API gateway / frontend codegen
- Point the Discover screen at `discoverFeed` instead of local filtering
