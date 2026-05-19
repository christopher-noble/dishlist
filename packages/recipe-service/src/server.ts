import { buildSubgraphSchema } from '@apollo/subgraph';
import { parse } from 'graphql';
import { createYoga } from 'graphql-yoga';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import 'reflect-metadata';

import { appConfig } from '../config/config.default.ts';
import { routeHttpRequest } from './application/api/http/request-router.ts';
import { createContext } from './application/api/recipes/customer-context.ts';
import { resolvers } from './application/api/recipes/resolvers/index.ts';
import { purgeExpiredArchivedRecipes } from './application/recipes/purge-expired-archived-recipes.ts';
import { registerDependencies } from './configuration/dependency-registry/index.ts';
import { getStorageStrategy } from './infrastructure/media/asset-storage.ts';

const typeDefs = parse(
  readFileSync(
    new URL(
      '../src/application/api/recipes/recipes-schema.graphql',
      import.meta.url,
    ),
    'utf8',
  ),
);

const schema = buildSubgraphSchema({ typeDefs, resolvers });

async function bootstrap() {
  registerDependencies();

  const purgedCount = await purgeExpiredArchivedRecipes();
  if (purgedCount > 0) {
    console.log(`🗑️  Purged ${purgedCount} archived recipe(s) older than 30 days`);
  }

  const yoga = createYoga({
    schema,
    context: createContext,
    graphqlEndpoint: '/graphql',
  });

  const server = createServer(async (req, res) => {
    await routeHttpRequest(req, res, async () => {
      yoga(req, res);
    });
  });
  const { port, publicBaseUrl } = appConfig.server;
  const storageStrategy = getStorageStrategy();

  server.listen(port, () => {
    console.log(`🚀 Subgraph "recipes" ready at ${publicBaseUrl}/graphql`);
    console.log(
      `🔐 JWT verification via JWKS ${appConfig.userService.jwksUrl}`,
    );
    console.log(`🖼️  Media storage strategy: ${storageStrategy}`);
    if (storageStrategy === 's3') {
      console.log('☁️  Uploads: client PUT → S3 presigned URL (no binary through Node)');
      console.log('🌐 Views: client GET → CloudFront CDN');
    } else {
      console.log(`📁 Local dev uploads: PUT ${publicBaseUrl}/api/uploads/<imageKey>`);
      console.log(`📂 Local dev assets: GET ${publicBaseUrl}/uploads/<imageKey>`);
    }
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error instanceof Error ? error.message : String(error));
  if (error instanceof Error && error.stack) {
    console.error(error.stack);
  }
  process.exitCode = 1;
});
