import { container, DependencyContainer } from 'tsyringe';
import type { MealRepositoryPort } from '../../domain/repositories/meal-repository.port.ts';
import { MealRepositoryAdapter } from '../../infrastructure/repositories/meal/meal-repository.adapter.ts';
import { RepositoryTokens } from './tokens/repository-tokens.ts';

export function registerRepositories(registry: DependencyContainer = container) {
  registry.register<MealRepositoryPort>(RepositoryTokens.MealRepository, {
    useClass: MealRepositoryAdapter,
  });

  return registry;
}
