import { container } from 'tsyringe';
import { ProviderTokens } from '../../../../configuration/dependency-registry/tokens/provider-tokens.ts';
import type {
  CreateRecipeProviderPort,
  CreateRecipeInput,
} from '../../../../domain/providers/create-recipe/create-recipe.provider.port.ts';
import { CustomerContext } from '../customer-context.ts';
import { requireAuthenticatedUser } from '../require-authenticated-user.ts';

export interface CreateRecipeResolverArgs {
  input: Omit<CreateRecipeInput, 'userId'>;
}

export const createRecipeResolver = {
  async createRecipe(
    _: unknown,
    args: CreateRecipeResolverArgs,
    context: CustomerContext,
  ) {
    const { userId } = requireAuthenticatedUser(context);
    const createRecipeProvider = container.resolve<CreateRecipeProviderPort>(
      ProviderTokens.CreateRecipeProvider,
    );

    return createRecipeProvider.createRecipe({
      ...args.input,
      userId,
    });
  },
};
