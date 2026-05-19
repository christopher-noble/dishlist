import { container } from 'tsyringe';
import { RepositoryTokens } from '../../configuration/dependency-registry/tokens/repository-tokens.ts';
import type { RecipeRepositoryPort } from '../../domain/repositories/recipe-repository.port.ts';

export async function purgeExpiredArchivedRecipes(): Promise<number> {
  const recipeRepository = container.resolve<RecipeRepositoryPort>(
    RepositoryTokens.RecipeRepository,
  );

  return recipeRepository.purgeExpiredArchivedRecipes();
}
