import { GraphQLError } from 'graphql';
import { container } from 'tsyringe';
import { ProviderTokens } from '../../../../configuration/dependency-registry/tokens/provider-tokens.ts';
import type {
  UpdateRecipeProviderPort,
  UpdateRecipeInput,
} from '../../../../domain/providers/update-recipe/update-recipe.provider.port.ts';
import type { RecipeProviderPort } from '../../../../domain/providers/recipe/recipe.provider.port.ts';
import { assertRecipeBelongsToUser } from '../assert-recipe-belongs-to-user.ts';
import { CustomerContext } from '../customer-context.ts';
import { requireAuthenticatedUser } from '../require-authenticated-user.ts';

export interface UpdateRecipeResolverArgs {
  id: string;
  input: UpdateRecipeInput;
}

export const updateRecipeResolver = {
  async updateRecipe(
    _: unknown,
    args: UpdateRecipeResolverArgs,
    context: CustomerContext,
  ) {
    const { userId } = requireAuthenticatedUser(context);
    const recipeProvider = container.resolve<RecipeProviderPort>(
      ProviderTokens.RecipeProvider,
    );
    const existing = await recipeProvider.getRecipeById(args.id);
    const recipe = assertRecipeBelongsToUser(existing, userId);

    if (recipe.archivedAt) {
      throw new GraphQLError('Archived recipes cannot be edited', {
        extensions: { code: 'BAD_REQUEST' },
      });
    }

    const updateRecipeProvider = container.resolve<UpdateRecipeProviderPort>(
      ProviderTokens.UpdateRecipeProvider,
    );

    return updateRecipeProvider.updateRecipe(args.id, args.input);
  },
};
