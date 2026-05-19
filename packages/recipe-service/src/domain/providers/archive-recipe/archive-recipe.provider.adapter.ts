import 'reflect-metadata';
import type { Recipe } from '../../entities/recipe.ts';
import { injectable, inject } from 'tsyringe';
import { ArchiveRecipeProviderPort } from './archive-recipe.provider.port.ts';
import { RepositoryTokens } from '../../../configuration/dependency-registry/tokens/repository-tokens.ts';
import { RecipeRepositoryPort } from '../../repositories/recipe-repository.port.ts';

@injectable()
export class ArchiveRecipeProviderAdapter implements ArchiveRecipeProviderPort {
  constructor(
    @inject(RepositoryTokens.RecipeRepository)
    private recipeRepository: RecipeRepositoryPort,
  ) {}

  public async archiveRecipe(id: string): Promise<Recipe> {
    return this.recipeRepository.archive(id);
  }
}
