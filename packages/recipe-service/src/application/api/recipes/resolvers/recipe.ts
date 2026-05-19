import { container } from 'tsyringe';
import { ProviderTokens } from '../../../../configuration/dependency-registry/tokens/provider-tokens.ts';
import type { RecipeProviderPort } from '../../../../domain/providers/recipe/recipe.provider.port.ts';
import { assertRecipeBelongsToUser } from '../assert-recipe-belongs-to-user.ts';
import { CustomerContext } from '../customer-context.ts';
import { requireAuthenticatedUser } from '../require-authenticated-user.ts';

export interface RecipeQueryResolverArgs {
  id: string;
}

export const recipeResolver = {
  async recipe(
    _: unknown,
    args: RecipeQueryResolverArgs,
    context: CustomerContext,
  ) {
    const { userId } = requireAuthenticatedUser(context);
    const recipeProvider = container.resolve<RecipeProviderPort>(
      ProviderTokens.RecipeProvider,
    );

    const recipe = await recipeProvider.getRecipeById(args.id);
    return assertRecipeBelongsToUser(recipe, userId);
  },
};
