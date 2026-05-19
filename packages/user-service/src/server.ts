import { buildSubgraphSchema } from '@apollo/subgraph';
import { parse } from 'graphql';
import { createYoga } from 'graphql-yoga';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import 'reflect-metadata';

import { appConfig } from '../config/config.default.js';
import { routeHttpRequest } from './application/api/http/request-router.js';
import { createContext } from './application/api/customer/customer-context.js';
import { resolvers } from './application/api/customer/resolvers/index.js';
import { registerDependencies } from './configuration/dependency-registry/index.js';

const typeDefs = parse(
  readFileSync(
    new URL(
      '../src/application/api/customer/customer-schema.graphql',
      import.meta.url,
    ),
    'utf8',
  ),
);

const schema = buildSubgraphSchema({ typeDefs, resolvers });

async function bootstrap() {
  registerDependencies();

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
  const authBasePath = appConfig.auth.betterAuthBasePath;

  server.listen(port, () => {
    console.log(
      `🚀 Subgraph "customer" ready at ${publicBaseUrl}/graphql`,
    );
    console.log(
      `🔐 Better Auth ready at ${publicBaseUrl}${authBasePath}/*`,
    );
    console.log(`🔑 JWKS ready at ${publicBaseUrl}${appConfig.auth.jwksPath}`);
    console.log(
      `🎫 Access tokens: POST ${publicBaseUrl}${appConfig.auth.accessTokenIssuePath}`,
    );
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error instanceof Error ? error.message : String(error));
  if (error instanceof Error && error.stack) {
    console.error(error.stack);
  }
  process.exitCode = 1;
});
