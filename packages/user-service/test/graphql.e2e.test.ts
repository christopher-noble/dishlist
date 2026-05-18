import { readFileSync } from 'node:fs';

import { buildSubgraphSchema } from '@apollo/subgraph';
import { parse } from 'graphql';
import { createYoga } from 'graphql-yoga';
import { describe, expect, it } from 'vitest';

import { createContext } from '../src/application/api/customer/customer-context.js';
import { resolvers } from '../src/application/api/customer/resolvers/index.js';

function createTestYoga() {
  const typeDefs = parse(
    readFileSync(new URL('../src/application/api/customer/customer-schema.graphql', import.meta.url), 'utf8'),
  );
  const schema = buildSubgraphSchema({ typeDefs, resolvers });
  return createYoga({ schema, context: createContext, graphqlEndpoint: '/graphql' });
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

describe('GraphQL e2e', () => {
  it('logout returns true', async () => {
    const yoga = createTestYoga();
    const data = await gql<{ logout: boolean }>(yoga, `mutation { logout }`);
    expect(data.logout).toBe(true);
  });

  it('login returns token', async () => {
    const yoga = createTestYoga();
    const data = await gql<{ login: { token: string } }>(
      yoga,
      `mutation ($input: LoginInput!) { login(input: $input) { token } }`,
      { input: { email: 'you@example.com', password: 'secret' } },
    );
    expect(data.login.token).toContain('token-for:you@example.com');
  });
});

