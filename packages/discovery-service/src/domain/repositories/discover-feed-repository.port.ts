import type { DiscoverFeedRecipeRef } from '../entities/discover-feed.js';

export interface DiscoverFeedRepositoryPort {
  findgeneratedRecipesByUserId(userId: string): Promise<DiscoverFeedRecipeRef[]>;
}
