import type { RecipeIngredient } from './recipe-ingredient.ts';

export enum RecipeCategory {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK',
  DESSERT = 'DESSERT',
  BEVERAGE = 'BEVERAGE',
}

export interface NutritionalInfo {
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  fiber?: number | null;
}

export interface Recipe {
  id: string;
  userId: string;
  name: string;
  description: string;
  imageKey: string | null;
  category: RecipeCategory;
  ingredients: RecipeIngredient[];
  steps: string[];
  servesCount: number | null;
  nutritionalInfo: NutritionalInfo | null;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
  deletedAt: Date | null;
}
