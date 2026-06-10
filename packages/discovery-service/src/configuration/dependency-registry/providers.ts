import type { DependencyContainer } from 'tsyringe';
import { container } from 'tsyringe';

import { DiscoverFeedProviderAdapter } from '../../domain/providers/discover-feed/discover-feed.provider.adapter.js';
import { ProviderTokens } from './tokens/provider-tokens.js';

export function registerProviders(registry: DependencyContainer = container) {
  registry.registerSingleton(
    ProviderTokens.DiscoverFeedProvider,
    DiscoverFeedProviderAdapter,
  );

  return registry;
}
