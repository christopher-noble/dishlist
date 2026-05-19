import { getRecipeCreateOptions } from '../../../../domain/recipes/recipe-create-options.ts';
import { requireAuthenticatedUser } from '../require-authenticated-user.ts';
import type { CustomerContext } from '../customer-context.ts';

export const recipeCreateOptionsResolver = {
  async recipeCreateOptions(_: unknown, __args: unknown, context: CustomerContext) {
    requireAuthenticatedUser(context);
    return getRecipeCreateOptions();
  },
};
