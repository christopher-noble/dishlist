import { container } from 'tsyringe';

import { ProviderTokens } from '../../../../configuration/dependency-registry/tokens/provider-tokens.js';
import type { DiscoverFeedProviderPort } from '../../../../domain/providers/discover-feed/discover-feed.provider.port.js';

export const discoverCategoriesResolver = {
  discoverCategories() {
    const discoverFeedProvider = container.resolve<DiscoverFeedProviderPort>(
      ProviderTokens.DiscoverFeedProvider,
    );

    return discoverFeedProvider.getCategories();
  },
};
