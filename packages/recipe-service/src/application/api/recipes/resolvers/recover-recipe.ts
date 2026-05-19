import { GraphQLError } from 'graphql';
import { container } from 'tsyringe';
import { ProviderTokens } from '../../../../configuration/dependency-registry/tokens/provider-tokens.ts';
import type { RecoverRecipeProviderPort } from '../../../../domain/providers/recover-recipe/recover-recipe.provider.port.ts';
import type { RecipeProviderPort } from '../../../../domain/providers/recipe/recipe.provider.port.ts';
import { assertRecipeBelongsToUser } from '../assert-recipe-belongs-to-user.ts';
import { CustomerContext } from '../customer-context.ts';
import { requireAuthenticatedUser } from '../require-authenticated-user.ts';

export interface RecoverRecipeResolverArgs {
  id: string;
}

export const recoverRecipeResolver = {
  async recoverRecipe(
    _: unknown,
    args: RecoverRecipeResolverArgs,
    context: CustomerContext,
  ) {
    const { userId } = requireAuthenticatedUser(context);
    const recipeProvider = container.resolve<RecipeProviderPort>(
      ProviderTokens.RecipeProvider,
    );
    const existing = await recipeProvider.getRecipeById(args.id);
    const recipe = assertRecipeBelongsToUser(existing, userId);

    if (!recipe.archivedAt) {
      throw new GraphQLError('Recipe is not archived', {
        extensions: { code: 'BAD_REQUEST' },
      });
    }

    const recoverRecipeProvider = container.resolve<RecoverRecipeProviderPort>(
      ProviderTokens.RecoverRecipeProvider,
    );

    return recoverRecipeProvider.recoverRecipe(args.id);
  },
};
