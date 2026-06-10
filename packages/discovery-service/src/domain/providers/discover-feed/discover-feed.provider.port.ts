import type { DiscoverCategory } from '../../entities/discover-category.js';
import type { DiscoverFeed } from '../../entities/discover-feed.js';

export interface DiscoverFeedProviderPort {
  getCategories(): DiscoverCategory[];
  getFeedForUser(userId: string): Promise<DiscoverFeed>;
}
