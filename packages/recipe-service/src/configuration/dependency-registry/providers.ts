import { DependencyContainer, container } from 'tsyringe';
import { CreateRecipeProviderAdapter } from '../../domain/providers/create-recipe/create-recipe.provider.adapter.ts';
import { UpdateRecipeProviderAdapter } from '../../domain/providers/update-recipe/update-recipe.provider.adapter.ts';
import { RecipeProviderAdapter } from '../../domain/providers/recipe/recipe.provider.adapter.ts';
import { ArchiveRecipeProviderAdapter } from '../../domain/providers/archive-recipe/archive-recipe.provider.adapter.ts';
import { RecoverRecipeProviderAdapter } from '../../domain/providers/recover-recipe/recover-recipe.provider.adapter.ts';
import { DeleteRecipeProviderAdapter } from '../../domain/providers/delete-recipe/delete-recipe.provider.adapter.ts';
import { ProviderTokens } from './tokens/provider-tokens.ts';

export function registerProviders(registry: DependencyContainer = container) {
  registry.registerSingleton(
    ProviderTokens.CreateRecipeProvider,
    CreateRecipeProviderAdapter,
  );
  registry.registerSingleton(
    ProviderTokens.UpdateRecipeProvider,
    UpdateRecipeProviderAdapter,
  );
  registry.registerSingleton(
    ProviderTokens.RecipeProvider,
    RecipeProviderAdapter,
  );
  registry.registerSingleton(
    ProviderTokens.ArchiveRecipeProvider,
    ArchiveRecipeProviderAdapter,
  );
  registry.registerSingleton(
    ProviderTokens.RecoverRecipeProvider,
    RecoverRecipeProviderAdapter,
  );
  registry.registerSingleton(
    ProviderTokens.DeleteRecipeProvider,
    DeleteRecipeProviderAdapter,
  );

  return registry;
}
