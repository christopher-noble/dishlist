import { container, DependencyContainer } from 'tsyringe';
import type { RecipeRepositoryPort } from '../../domain/repositories/recipe-repository.port.ts';
import { RecipeRepositoryAdapter } from '../../infrastructure/repositories/recipe/recipe-repository.adapter.ts';
import { RepositoryTokens } from './tokens/repository-tokens.ts';

export function registerRepositories(registry: DependencyContainer = container) {
  registry.register<RecipeRepositoryPort>(RepositoryTokens.RecipeRepository, {
    useClass: RecipeRepositoryAdapter,
  });

  return registry;
}
