import {
  DiscoverCategoryId,
  type DiscoverCategory,
} from '../entities/discover-category.js';

export const DISCOVER_CATEGORIES: DiscoverCategory[] = [
  { id: DiscoverCategoryId.ALL, label: 'All', emoji: '🍽️' },
  { id: DiscoverCategoryId.BREAKFAST, label: 'Breakfast', emoji: '🥞' },
  { id: DiscoverCategoryId.LUNCH, label: 'Lunch', emoji: '🍔' },
  { id: DiscoverCategoryId.DINNER, label: 'Dinner', emoji: '🍲' },
  { id: DiscoverCategoryId.SNACK, label: 'Snacks', emoji: '🍞' },
  { id: DiscoverCategoryId.DESSERT, label: 'Dessert', emoji: '🍰' },
  { id: DiscoverCategoryId.BEVERAGE, label: 'Coffee', emoji: '☕' },
];
