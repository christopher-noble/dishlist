import { GraphQLError } from 'graphql';
import { container } from 'tsyringe';
import { ProviderTokens } from '../../../../configuration/dependency-registry/tokens/provider-tokens.ts';
import type { DeleteRecipeProviderPort } from '../../../../domain/providers/delete-recipe/delete-recipe.provider.port.ts';
import type { RecipeProviderPort } from '../../../../domain/providers/recipe/recipe.provider.port.ts';
import { assertRecipeBelongsToUser } from '../assert-recipe-belongs-to-user.ts';
import { CustomerContext } from '../customer-context.ts';
import { requireAuthenticatedUser } from '../require-authenticated-user.ts';

export interface DeleteRecipeResolverArgs {
  id: string;
}

export const deleteRecipeResolver = {
  async deleteRecipe(
    _: unknown,
    args: DeleteRecipeResolverArgs,
    context: CustomerContext,
  ) {
    const { userId } = requireAuthenticatedUser(context);
    const recipeProvider = container.resolve<RecipeProviderPort>(
      ProviderTokens.RecipeProvider,
    );
    const existing = await recipeProvider.getRecipeById(args.id);
    const recipe = assertRecipeBelongsToUser(existing, userId);

    if (!recipe.archivedAt) {
      throw new GraphQLError('Only archived recipes can be permanently deleted', {
        extensions: { code: 'BAD_REQUEST' },
      });
    }

    const deleteRecipeProvider = container.resolve<DeleteRecipeProviderPort>(
      ProviderTokens.DeleteRecipeProvider,
    );

    await deleteRecipeProvider.deleteRecipe(args.id);
    return true;
  },

  async deleteAllArchivedRecipes(_: unknown, __args: unknown, context: CustomerContext) {
    const { userId } = requireAuthenticatedUser(context);
    const deleteRecipeProvider = container.resolve<DeleteRecipeProviderPort>(
      ProviderTokens.DeleteRecipeProvider,
    );

    return deleteRecipeProvider.deleteAllArchivedRecipes(userId);
  },
};
