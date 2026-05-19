import type { Recipe, NutritionalInfo } from '../../entities/recipe.ts';
import type { RecipeIngredient } from '../../entities/recipe-ingredient.ts';

export interface UpdateRecipeInput {
  name?: string;
  description?: string;
  imageKey?: string | null;
  category?: string;
  ingredients?: RecipeIngredient[];
  steps?: string[];
  servesCount?: number | null;
  nutritionalInfo?: NutritionalInfo | null;
}

export interface UpdateRecipeProviderPort {
  updateRecipe(id: string, input: UpdateRecipeInput): Promise<Recipe>;
}
