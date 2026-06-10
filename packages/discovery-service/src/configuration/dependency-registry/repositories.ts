import type { DependencyContainer } from 'tsyringe';
import { container } from 'tsyringe';

import { DiscoverFeedRepositoryAdapter } from '../../infrastructure/repositories/discover-feed/discover-feed-repository.adapter.js';
import { RepositoryTokens } from './tokens/repository-tokens.js';

export function registerRepositories(registry: DependencyContainer = container) {
  registry.registerSingleton(
    RepositoryTokens.DiscoverFeedRepository,
    DiscoverFeedRepositoryAdapter,
  );

  return registry;
}
