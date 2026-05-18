import { buildSubgraphSchema } from '@apollo/subgraph';
import { parse } from 'graphql';
import { createYoga } from 'graphql-yoga';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import 'reflect-metadata';

import { createContext } from './application/api/meals/customer-context.ts';
import { resolvers } from './application/api/meals/resolvers/index.ts';
import { registerDependencies } from './configuration/dependency-registry/index.ts';

const typeDefs = parse(
  readFileSync(
    new URL(
      '../src/application/api/meals/meals-schema.graphql',
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

  const server = createServer(yoga);
  const PORT = process.env.PORT || 4002;

  server.listen(PORT, () => {
    console.log(
      `🚀 Subgraph "meals" ready at http://localhost:${PORT}/graphql`,
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
