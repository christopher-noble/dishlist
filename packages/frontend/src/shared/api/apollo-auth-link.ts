import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { fromPromise } from '@apollo/client/link/utils';

import {
  clearAccessToken,
  synchronizeAccessTokenWithSession,
} from '@/src/features/auth/services/auth-session.service';
import { accessTokenStore } from '@/src/features/auth/storage/access-token-store';

export const apolloAuthContextLink = setContext(async (_, { headers }) => {
  let accessToken = accessTokenStore.getValidAccessToken();

  if (!accessToken) {
    const refreshed = await synchronizeAccessTokenWithSession();
    accessToken = refreshed ? accessTokenStore.getValidAccessToken() : null;
  }

  return {
    headers: {
      ...headers,
      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
    },
  };
});

export const apolloAuthErrorLink = onError(({ graphQLErrors, operation, forward }) => {
  const isUnauthenticated = graphQLErrors?.some(
    (error) => error.extensions?.code === 'UNAUTHENTICATED',
  );

  if (!isUnauthenticated) {
    return;
  }

  return fromPromise(
    synchronizeAccessTokenWithSession().then((success) => {
      if (!success) {
        clearAccessToken();
        return false;
      }
      return true;
    }),
  ).flatMap((shouldRetry) => {
    if (!shouldRetry) {
      return forward(operation);
    }

    const accessToken = accessTokenStore.getValidAccessToken();
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
      },
    }));

    return forward(operation);
  });
});
