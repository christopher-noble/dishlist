import type { DiscoverCategory } from './discover-category.js';

export interface DiscoverFeedRecipeRef {
  recipeId: string;
  rank: number;
}

export interface DiscoverFeed {
  categories: DiscoverCategory[];
  generatedRecipes: DiscoverFeedRecipeRef[];
}
