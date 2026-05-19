import { GraphQLError } from 'graphql';
import { container } from 'tsyringe';
import { ProviderTokens } from '../../../../configuration/dependency-registry/tokens/provider-tokens.ts';
import type { ArchiveRecipeProviderPort } from '../../../../domain/providers/archive-recipe/archive-recipe.provider.port.ts';
import type { RecipeProviderPort } from '../../../../domain/providers/recipe/recipe.provider.port.ts';
import { assertRecipeBelongsToUser } from '../assert-recipe-belongs-to-user.ts';
import { CustomerContext } from '../customer-context.ts';
import { requireAuthenticatedUser } from '../require-authenticated-user.ts';

export interface ArchiveRecipeResolverArgs {
  id: string;
}

export const archiveRecipeResolver = {
  async archiveRecipe(
    _: unknown,
    args: ArchiveRecipeResolverArgs,
    context: CustomerContext,
  ) {
    const { userId } = requireAuthenticatedUser(context);
    const recipeProvider = container.resolve<RecipeProviderPort>(
      ProviderTokens.RecipeProvider,
    );
    const existing = await recipeProvider.getRecipeById(args.id);
    const recipe = assertRecipeBelongsToUser(existing, userId);

    if (recipe.archivedAt) {
      throw new GraphQLError('Recipe is already archived', {
        extensions: { code: 'BAD_REQUEST' },
      });
    }

    const archiveRecipeProvider = container.resolve<ArchiveRecipeProviderPort>(
      ProviderTokens.ArchiveRecipeProvider,
    );

    return archiveRecipeProvider.archiveRecipe(args.id);
  },
};
