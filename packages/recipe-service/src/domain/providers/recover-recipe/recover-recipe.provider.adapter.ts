import 'reflect-metadata';
import type { Recipe } from '../../entities/recipe.ts';
import { injectable, inject } from 'tsyringe';
import { RecoverRecipeProviderPort } from './recover-recipe.provider.port.ts';
import { RepositoryTokens } from '../../../configuration/dependency-registry/tokens/repository-tokens.ts';
import { RecipeRepositoryPort } from '../../repositories/recipe-repository.port.ts';

@injectable()
export class RecoverRecipeProviderAdapter implements RecoverRecipeProviderPort {
  constructor(
    @inject(RepositoryTokens.RecipeRepository)
    private recipeRepository: RecipeRepositoryPort,
  ) {}

  public async recoverRecipe(id: string): Promise<Recipe> {
    return this.recipeRepository.recover(id);
  }
}
