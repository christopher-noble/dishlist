import { injectable } from 'tsyringe';

import type { DiscoverFeedRecipeRef } from '../../../domain/entities/discover-feed.js';
import type { DiscoverFeedRepositoryPort } from '../../../domain/repositories/discover-feed-repository.port.js';

@injectable()
export class DiscoverFeedRepositoryAdapter implements DiscoverFeedRepositoryPort {
  async findgeneratedRecipesByUserId(
    _userId: string,
  ): Promise<DiscoverFeedRecipeRef[]> {
    return [];
  }
}
