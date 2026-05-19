import type { Recipe, NutritionalInfo } from '../../entities/recipe.ts';
import type { RecipeIngredient } from '../../entities/recipe-ingredient.ts';

export interface CreateRecipeInput {
  userId: string;
  name: string;
  description: string;
  imageKey?: string | null;
  category: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  servesCount?: number | null;
  nutritionalInfo?: NutritionalInfo | null;
}

export interface CreateRecipeProviderPort {
  createRecipe(input: CreateRecipeInput): Promise<Recipe>;
}
