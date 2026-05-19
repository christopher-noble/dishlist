import 'reflect-metadata';
import type { Recipe } from '../../entities/recipe.ts';
import { injectable, inject } from 'tsyringe';
import { RecipeProviderPort } from './recipe.provider.port.ts';
import { RepositoryTokens } from '../../../configuration/dependency-registry/tokens/repository-tokens.ts';
import { RecipeRepositoryPort } from '../../repositories/recipe-repository.port.ts';

@injectable()
export class RecipeProviderAdapter implements RecipeProviderPort {
  constructor(
    @inject(RepositoryTokens.RecipeRepository)
    private recipeRepository: RecipeRepositoryPort,
  ) {}

  public async getRecipeById(id: string): Promise<Recipe | null> {
    return this.recipeRepository.findById(id);
  }

  public async getActiveRecipesByUserId(userId: string): Promise<Recipe[]> {
    return this.recipeRepository.findActiveByUserId(userId);
  }

  public async getArchivedRecipesByUserId(userId: string): Promise<Recipe[]> {
    return this.recipeRepository.findArchivedByUserId(userId);
  }

  public async getRecipeStats(userId: string) {
    return this.recipeRepository.countStatsByUserId(userId);
  }
}
