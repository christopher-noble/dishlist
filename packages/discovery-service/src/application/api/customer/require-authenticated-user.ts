import { GraphQLError } from 'graphql';

import type { DiscoverContext } from './discover-context.js';

export function requireAuthenticatedUser(context: DiscoverContext) {
  if (!context.authenticatedUser) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  return context.authenticatedUser;
}
