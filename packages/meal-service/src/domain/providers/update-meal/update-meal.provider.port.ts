import type { Meal, NutritionalInfo } from '../../entities/meal.ts';

export interface UpdateMealInput {
  name?: string;
  description?: string;
  imageUrl?: string | null;
  category?: string;
  ingredients?: string[];
  nutritionalInfo?: NutritionalInfo | null;
}

export interface UpdateMealProviderPort {
  updateMeal(id: string, input: UpdateMealInput): Promise<Meal>;
}
