import { container } from 'tsyringe';

import { ProviderTokens } from '../../../../configuration/dependency-registry/tokens/provider-tokens.js';
import type { DiscoverFeedProviderPort } from '../../../../domain/providers/discover-feed/discover-feed.provider.port.js';
import type { DiscoverContext } from '../discover-context.js';
import { requireAuthenticatedUser } from '../require-authenticated-user.js';

export const discoverFeedResolver = {
  async discoverFeed(_: unknown, __args: unknown, context: DiscoverContext) {
    const { userId } = requireAuthenticatedUser(context);
    const discoverFeedProvider = container.resolve<DiscoverFeedProviderPort>(
      ProviderTokens.DiscoverFeedProvider,
    );

    return discoverFeedProvider.getFeedForUser(userId);
  },
};
