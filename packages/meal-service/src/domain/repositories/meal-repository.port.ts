import type { Meal, MealCategory, NutritionalInfo } from '../entities/meal.ts';

export interface CreateMealInput {
  userId: string;
  name: string;
  description: string;
  imageUrl: string | null;
  category: MealCategory;
  ingredients: string[];
  nutritionalInfo: NutritionalInfo | null;
}

export interface UpdateMealInput {
  name?: string;
  description?: string;
  imageUrl?: string | null;
  category?: MealCategory;
  ingredients?: string[];
  nutritionalInfo?: NutritionalInfo | null;
}

export interface MealRepositoryPort {
  create(input: CreateMealInput): Promise<Meal>;
  findById(id: string): Promise<Meal | null>;
  findActiveByUserId(userId: string): Promise<Meal[]>;
  findArchivedByUserId(userId: string): Promise<Meal[]>;
  update(id: string, input: UpdateMealInput): Promise<Meal>;
  archive(id: string): Promise<Meal>;
}
