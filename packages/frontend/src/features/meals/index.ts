export { MealCard } from './components/meal-card';
export { MealList } from './components/meal-list';

export { useMeals, useArchivedMeals, useMeal } from './hooks/use-meals';
export { useCreateMeal, useUpdateMeal, useArchiveMeal } from './hooks/use-meal-mutations';

export type {
  Meal,
  MealCategory,
  CreateMealInput,
  UpdateMealInput,
  NutritionalInfo,
  NutritionalInfoInput,
} from '@/src/shared/api/generated/graphql';
