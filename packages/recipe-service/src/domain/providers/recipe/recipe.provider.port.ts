import type { Recipe } from '../../entities/recipe.ts';
import type { RecipeStats } from '../../repositories/recipe-repository.port.ts';

export interface RecipeProviderPort {
  getRecipeById(id: string): Promise<Recipe | null>;
  getActiveRecipesByUserId(userId: string): Promise<Recipe[]>;
  getArchivedRecipesByUserId(userId: string): Promise<Recipe[]>;
  getRecipeStats(userId: string): Promise<RecipeStats>;
}
