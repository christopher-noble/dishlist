import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { DISCOVER_CATEGORIES } from '../../discover/discover-categories.js';
import type { DiscoverCategory } from '../../entities/discover-category.js';
import type { DiscoverFeed } from '../../entities/discover-feed.js';
import type { DiscoverFeedRepositoryPort } from '../../repositories/discover-feed-repository.port.js';
import { RepositoryTokens } from '../../../configuration/dependency-registry/tokens/repository-tokens.js';
import type { DiscoverFeedProviderPort } from './discover-feed.provider.port.js';

@injectable()
export class DiscoverFeedProviderAdapter implements DiscoverFeedProviderPort {
  constructor(
    @inject(RepositoryTokens.DiscoverFeedRepository)
    private discoverFeedRepository: DiscoverFeedRepositoryPort,
  ) {}

  getCategories(): DiscoverCategory[] {
    return DISCOVER_CATEGORIES;
  }

  async getFeedForUser(userId: string): Promise<DiscoverFeed> {
    const generatedRecipes =
      await this.discoverFeedRepository.findgeneratedRecipesByUserId(userId);

    return {
      categories: this.getCategories(),
      generatedRecipes,
    };
  }
}
