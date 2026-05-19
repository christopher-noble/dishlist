#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "→ Installing dependencies (per-package lockfiles)..."
CI=true pnpm install -r

echo ""
echo "Done. Next steps:"
echo "  pnpm dev:deps:detached     # start Postgres"
echo "  pnpm user-service:dev      # syncs DB + starts user-service (no manual db:auth:push)"
echo "  pnpm recipe-service:dev      # recipe subgraph"
echo "  pnpm frontend:start        # Expo app"
