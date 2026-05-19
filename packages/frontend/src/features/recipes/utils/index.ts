/**
 * Recipes Feature Utilities
 * 
 * Utility functions specific to the recipes feature
 */

import type { Recipe, RecipeCategory } from '../types';

/** Trim and capitalize only the first character; preserve all other casing. */
export function normalizeRecipeName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    return trimmed;
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Get category display name
 */
export const getCategoryDisplayName = (category: RecipeCategory): string => {
  const displayNames: Record<RecipeCategory, string> = {
    BREAKFAST: 'Breakfast',
    LUNCH: 'Lunch',
    DINNER: 'Dinner',
    SNACK: 'Snacks',
    DESSERT: 'Desserts',
    BEVERAGE: 'Beverages',
  };
  return displayNames[category] || category;
};

/**
 * Filter recipes by search query
 */
export const filterRecipesBySearch = (recipes: Recipe[], searchQuery: string): Recipe[] => {
  if (!searchQuery.trim()) return recipes;

  const query = searchQuery.toLowerCase();
  return recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(query) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.item.toLowerCase().includes(query),
      ) ||
      (recipe.steps ?? []).some((step) => step.toLowerCase().includes(query))
  );
};

/**
 * Sort recipes by various criteria
 */
type RecipeSortable = Recipe & { createdAt?: string };

export const sortRecipes = (
  recipes: RecipeSortable[],
  sortBy: 'name' | 'createdAt' = 'name',
  sortOrder: 'asc' | 'desc' = 'asc',
): RecipeSortable[] => {
  const sorted = [...recipes].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'createdAt':
        comparison =
          new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime();
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
};
