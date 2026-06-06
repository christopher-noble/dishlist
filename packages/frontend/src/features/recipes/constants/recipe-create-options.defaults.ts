import type { RecipeCategory } from '@/src/shared/api/generated/graphql';
import type { IngredientUnitLabels } from '../utils/ingredient-display';

export const DEFAULT_RECIPE_CATEGORIES: RecipeCategory[] = [
  'BREAKFAST',
  'LUNCH',
  'DINNER',
  'SNACK',
  'DESSERT',
  'BEVERAGE',
];

export const DEFAULT_INGREDIENT_UNITS: IngredientUnitLabels[] = [
  { value: 'ML', singularLabel: 'ml', pluralLabel: 'ml' },
  { value: 'L', singularLabel: 'L', pluralLabel: 'L' },
  { value: 'G', singularLabel: 'g', pluralLabel: 'g' },
  { value: 'KG', singularLabel: 'kg', pluralLabel: 'kg' },
  { value: 'CUP', singularLabel: 'cup', pluralLabel: 'cups' },
  { value: 'LB', singularLabel: 'lb', pluralLabel: 'lb' },
  { value: 'TBSP', singularLabel: 'tbsp', pluralLabel: 'tbsp' },
  { value: 'TSP', singularLabel: 'tsp', pluralLabel: 'tsp' },
];

export const DEFAULT_RECIPE_CREATE_OPTIONS = {
  maxServes: 100,
  categories: DEFAULT_RECIPE_CATEGORIES,
  ingredientUnits: DEFAULT_INGREDIENT_UNITS,
} as const;
