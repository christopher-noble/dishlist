import { container } from 'tsyringe';
import { ProviderTokens } from '../../../../configuration/dependency-registry/tokens/provider-tokens.ts';
import type { RecipeProviderPort } from '../../../../domain/providers/recipe/recipe.provider.port.ts';
import { CustomerContext } from '../customer-context.ts';
import { requireAuthenticatedUser } from '../require-authenticated-user.ts';

export const recipesResolver = {
  async recipes(_: unknown, __args: unknown, context: CustomerContext) {
    const { userId } = requireAuthenticatedUser(context);
    const recipeProvider = container.resolve<RecipeProviderPort>(
      ProviderTokens.RecipeProvider,
    );

    return recipeProvider.getActiveRecipesByUserId(userId);
  },

  async archivedRecipes(_: unknown, __args: unknown, context: CustomerContext) {
    const { userId } = requireAuthenticatedUser(context);
    const recipeProvider = container.resolve<RecipeProviderPort>(
      ProviderTokens.RecipeProvider,
    );

    return recipeProvider.getArchivedRecipesByUserId(userId);
  },
};
