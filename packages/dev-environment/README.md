## Dishlist - Development Environment

Local development dependencies for the Dishlist monorepo (Docker Compose).

## Local Development Setup

From the **repository root** (`dishlist/`):

1. **Install dependencies** (once per clone)

   ```bash
   pnpm install
   ```

2. **Make sure Colima or Docker is running**

   ```bash
   colima start   # if you use Colima
   ```

3. **Start Postgres**

   ```bash
   pnpm dev:deps
   ```

4. **Start services** (separate terminals)

   ```bash
   pnpm user-service:dev
   pnpm meal-service:dev
   pnpm frontend:start
   ```

The Docker Compose setup provides shared development dependencies (like Postgres) that Dishlist services can connect to.

### Start Postgres

From this folder:

```bash
# Docker Compose v2 (Docker Desktop)
docker compose up

# Docker Compose v1
docker-compose up
```

Or in the background:

```bash
# Docker Compose v2 (Docker Desktop)
docker compose up -d

# Docker Compose v1
docker-compose up -d
```

### Connection details (defaults)

- Host: `localhost`
- Port: `5432`
- User: `postgres`
- Password: `postgres`

**Note:** This is a shared Postgres server. Each Dishlist service should connect to this server and create its own database (e.g., `dishlist_api_development`, `dishlist_auth_development`).

Connection string template:

`postgres://postgres:postgres@localhost:5432/<your_dishlist_service_database>`

### Stop / reset

```bash
# Docker Compose v2 (Docker Desktop)
docker compose down

# Docker Compose v1
docker-compose down
```

Delete data volume too:

```bash
# Docker Compose v2 (Docker Desktop)
docker compose down -v

# Docker Compose v1
docker-compose down -v
```
