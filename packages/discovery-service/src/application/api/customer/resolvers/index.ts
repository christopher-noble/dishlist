import { discoverCategoriesResolver } from './discover-categories.js';
import { discoverFeedResolver } from './discover-feed.js';

export const resolvers = {
  Query: {
    discoverHealth: () => 'ok',
    discoverCategories: discoverCategoriesResolver.discoverCategories,
    discoverFeed: discoverFeedResolver.discoverFeed,
  },
};
