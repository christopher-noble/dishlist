/**
 * Meals Feature Utilities
 * 
 * Utility functions specific to the meals feature
 */

import type { Meal, MealCategory } from '../types';

/**
 * Get category display name
 */
export const getCategoryDisplayName = (category: MealCategory): string => {
  const displayNames: Record<MealCategory, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snacks',
    dessert: 'Desserts',
    beverage: 'Beverages',
  };
  return displayNames[category] || category;
};

/**
 * Filter meals by search query
 */
export const filterMealsBySearch = (meals: Meal[], searchQuery: string): Meal[] => {
  if (!searchQuery.trim()) return meals;

  const query = searchQuery.toLowerCase();
  return meals.filter(
    (meal) =>
      meal.name.toLowerCase().includes(query) ||
      meal.description.toLowerCase().includes(query) ||
      meal.ingredients.some((ingredient) => ingredient.toLowerCase().includes(query))
  );
};

/**
 * Sort meals by various criteria
 */
export const sortMeals = (
  meals: Meal[],
  sortBy: 'name' | 'createdAt' = 'name',
  sortOrder: 'asc' | 'desc' = 'asc'
): Meal[] => {
  const sorted = [...meals].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
};
