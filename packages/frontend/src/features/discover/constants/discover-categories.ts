import type { RecipeCategory } from '@/src/shared/api/generated/graphql';

export type DiscoverCategory = {
  id: RecipeCategory | 'ALL';
  label: string;
  emoji: string;
};

export const DISCOVER_CATEGORIES: DiscoverCategory[] = [
  { id: 'ALL', label: 'All', emoji: '🍽️' },
  { id: 'BREAKFAST', label: 'Breakfast', emoji: '🥞' },
  { id: 'LUNCH', label: 'Lunch', emoji: '🍔' },
  { id: 'DINNER', label: 'Dinner', emoji: '🍲' },
  { id: 'SNACK', label: 'Snacks', emoji: '🍞' },
  { id: 'DESSERT', label: 'Dessert', emoji: '🍰' },
  { id: 'BEVERAGE', label: 'Coffee', emoji: '☕' },
];
