# Dishlist

Monorepo for the Dishlist app: GraphQL subgraph services, Expo frontend, and local dev infrastructure.

## Packages

| Path | Description |
|------|-------------|
| `packages/frontend` | Expo / React Native app |
| `packages/user-service` | Users subgraph (GraphQL + Prisma) |
| `packages/recipe-service` | Recipes subgraph (GraphQL + Prisma) |
| `packages/dev-environment` | Docker Compose (Postgres) for local development |

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9 (`corepack enable` recommended)
- [Docker](https://www.docker.com/) (or Colima) for Postgres

## Quick start

```bash
git clone git@github.com:YOUR_ORG/dishlist.git
cd dishlist

# Install all workspace dependencies (each package keeps its own pnpm-lock.yaml)
pnpm install -r
# or: pnpm setup

# Start shared Postgres
pnpm dev:deps
# or in the background:
pnpm dev:deps:detached
```

In separate terminals:

```bash
pnpm user-service:dev
pnpm recipe-service:dev
pnpm frontend:start
```

## Common commands

| Command | Description |
|---------|-------------|
| `pnpm install -r` | Install dependencies for all packages (per-package lockfiles) |
| `pnpm dev:deps` | Start Postgres via Docker Compose |
| `pnpm user-service:dev` | Run user-service with watch |
| `pnpm recipe-service:dev` | Run recipe-service with watch |
| `pnpm frontend:start` | Start Expo dev server |
| `pnpm frontend:codegen` | Regenerate GraphQL types for the frontend |

Run any package script with filters:

```bash
pnpm --filter recipe-service test
pnpm --filter frontend ios
```

## Database

Postgres runs from `packages/backend/dev-environment/docker-compose.yml`:

- Host: `localhost`
- Port: `5432`
- User / password: `postgres` / `postgres`

Each service uses its own database name in its `.env` (see each service’s README or `.env.example`).

## Migrating from separate GitHub repos

This repo replaces multiple repositories. You do **not** need to delete old repos immediately:

1. Create a new GitHub repo named `dishlist` (empty, no README).
2. Remove nested `.git` folders inside each package (they came from the old multi-repo layout).
3. `git init`, commit, and push to the new remote.
4. Archive the old repos on GitHub (Settings → Archive) so links still work but the monorepo is canonical.
5. Update CI, deploy keys, and any hard-coded clone URLs to point at `dishlist`.

`web-client` is not part of this monorepo; you can delete that folder locally once you have confirmed nothing depends on it.
