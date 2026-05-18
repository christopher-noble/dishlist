import type { Meal } from '../../entities/meal.ts';

export interface MealProviderPort {
  getMealById(id: string): Promise<Meal | null>;
  getActiveMealsByUserId(userId: string): Promise<Meal[]>;
  getArchivedMealsByUserId(userId: string): Promise<Meal[]>;
}
