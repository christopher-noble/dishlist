import type { Meal, NutritionalInfo } from '../../entities/meal.ts';

export interface CreateMealInput {
  userId: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  category: string;
  ingredients: string[];
  nutritionalInfo?: NutritionalInfo | null;
}

export interface CreateMealProviderPort {
  createMeal(input: CreateMealInput): Promise<Meal>;
}
