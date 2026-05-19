import { ApolloClient, InMemoryCache, from, HttpLink } from '@apollo/client';

import { authServiceConfig } from '@/src/features/auth/config/auth-service-config';
import {
  apolloAuthContextLink,
  apolloAuthErrorLink,
} from './apollo-auth-link';

const httpLink = new HttpLink({
  uri: authServiceConfig.recipeServiceGraphqlUrl,
});

export const apolloClient = new ApolloClient({
  link: from([apolloAuthErrorLink, apolloAuthContextLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
    query: { fetchPolicy: 'network-only' },
  },
});
