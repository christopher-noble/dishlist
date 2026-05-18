import { DependencyContainer, container } from 'tsyringe';
import { CreateMealProviderAdapter } from '../../domain/providers/create-meal/create-meal.provider.adapter.ts';
import { UpdateMealProviderAdapter } from '../../domain/providers/update-meal/update-meal.provider.adapter.ts';
import { MealProviderAdapter } from '../../domain/providers/meal/meal.provider.adapter.ts';
import { ArchiveMealProviderAdapter } from '../../domain/providers/archive-meal/archive-meal.provider.adapter.ts';
import { ProviderTokens } from './tokens/provider-tokens.ts';

export function registerProviders(registry: DependencyContainer = container) {
  registry.registerSingleton(
    ProviderTokens.CreateMealProvider,
    CreateMealProviderAdapter,
  );
  registry.registerSingleton(
    ProviderTokens.UpdateMealProvider,
    UpdateMealProviderAdapter,
  );
  registry.registerSingleton(
    ProviderTokens.MealProvider,
    MealProviderAdapter,
  );
  registry.registerSingleton(
    ProviderTokens.ArchiveMealProvider,
    ArchiveMealProviderAdapter,
  );

  return registry;
}
