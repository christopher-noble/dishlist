import 'reflect-metadata';
import { readFileSync } from 'node:fs';

import { buildSubgraphSchema } from '@apollo/subgraph';
import { parse } from 'graphql';
import { createYoga } from 'graphql-yoga';
import { describe, expect, it } from 'vitest';

import { createContext } from '../src/application/api/customer/discover-context.js';
import { resolvers } from '../src/application/api/customer/resolvers/index.js';
import { registerDependencies } from '../src/configuration/dependency-registry/index.js';

function createTestYoga() {
  registerDependencies();

  const typeDefs = parse(
    readFileSync(
      new URL(
        '../src/application/api/discover/discover-schema.graphql',
        import.meta.url,
      ),
      'utf8',
    ),
  );
  const schema = buildSubgraphSchema({ typeDefs, resolvers });

  return createYoga({
    schema,
    context: createContext,
    graphqlEndpoint: '/graphql',
  });
}

async function gql<TData>(
  yoga: ReturnType<typeof createTestYoga>,
  query: string,
  variables?: Record<string, unknown>,
): Promise<TData> {
  const res = await yoga.fetch('http://localhost/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as { data?: TData; errors?: unknown };
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data as TData;
}

describe('Discover GraphQL e2e', () => {
  it('discoverHealth returns ok', async () => {
    const yoga = createTestYoga();
    const data = await gql<{ discoverHealth: string }>(
      yoga,
      `query { discoverHealth }`,
    );
    expect(data.discoverHealth).toBe('ok');
  });

  it('discoverCategories returns static category metadata', async () => {
    const yoga = createTestYoga();
    const data = await gql<{
      discoverCategories: Array<{ id: string; label: string; emoji: string }>;
    }>(
      yoga,
      `query {
        discoverCategories {
          id
          label
          emoji
        }
      }`,
    );

    expect(data.discoverCategories).toHaveLength(7);
    expect(data.discoverCategories[0]).toEqual({
      id: 'ALL',
      label: 'All',
      emoji: '🍽️',
    });
  });

  it('discoverFeed requires authentication', async () => {
    const yoga = createTestYoga();
    const res = await yoga.fetch('http://localhost/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        query: `query { discoverFeed { generatedRecipes { recipeId rank } } }`,
      }),
    });
    const json = (await res.json()) as { errors?: unknown[] };
    expect(json.errors?.length).toBeGreaterThan(0);
  });
});
