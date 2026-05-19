import type { Recipe } from '../../entities/recipe.ts';

export interface RecoverRecipeProviderPort {
  recoverRecipe(id: string): Promise<Recipe>;
}
