import { getRecipeCreateOptions } from '../../../../domain/recipes/recipe-create-options.ts';

export const recipeCreateOptionsResolver = {
  recipeCreateOptions() {
    return getRecipeCreateOptions();
  },
};
