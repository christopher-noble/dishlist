import { GraphQLError } from 'graphql';

import type { CustomerContext } from './customer-context.ts';

export function requireAuthenticatedUser(context: CustomerContext) {
  if (!context.authenticatedUser) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  return context.authenticatedUser;
}
