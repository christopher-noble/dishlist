import type { Recipe } from '../../entities/recipe.ts';

export interface ArchiveRecipeProviderPort {
  archiveRecipe(id: string): Promise<Recipe>;
}
