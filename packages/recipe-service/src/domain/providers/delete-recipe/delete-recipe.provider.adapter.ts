import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { RepositoryTokens } from '../../../configuration/dependency-registry/tokens/repository-tokens.ts';
import { RecipeRepositoryPort } from '../../repositories/recipe-repository.port.ts';
import { DeleteRecipeProviderPort } from './delete-recipe.provider.port.ts';

@injectable()
export class DeleteRecipeProviderAdapter implements DeleteRecipeProviderPort {
  constructor(
    @inject(RepositoryTokens.RecipeRepository)
    private recipeRepository: RecipeRepositoryPort,
  ) {}

  async deleteRecipe(id: string): Promise<void> {
    const recipe = await this.recipeRepository.findById(id);

    if (!recipe?.archivedAt) {
      throw new Error('Only archived recipes can be permanently deleted');
    }

    await this.recipeRepository.softDelete(id);
  }

  async deleteAllArchivedRecipes(userId: string): Promise<number> {
    return this.recipeRepository.softDeleteAllArchivedByUserId(userId);
  }
}
