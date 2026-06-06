import {
  useRecipeCreateOptionsQuery,
  type RecipeCreateOptionsQuery,
} from '@/src/shared/api/generated/graphql';

import { DEFAULT_RECIPE_CREATE_OPTIONS } from '../constants/recipe-create-options.defaults';

function withDefaults(
  data: RecipeCreateOptionsQuery | undefined,
): RecipeCreateOptionsQuery {
  const options = data?.recipeCreateOptions;

  return {
    recipeCreateOptions: {
      maxServes: options?.maxServes ?? DEFAULT_RECIPE_CREATE_OPTIONS.maxServes,
      categories:
        options?.categories?.length
          ? options.categories
          : [...DEFAULT_RECIPE_CREATE_OPTIONS.categories],
      ingredientUnits:
        options?.ingredientUnits?.length
          ? options.ingredientUnits
          : [...DEFAULT_RECIPE_CREATE_OPTIONS.ingredientUnits],
    },
  };
}

export function useRecipeCreateOptions() {
  const result = useRecipeCreateOptionsQuery();

  return {
    ...result,
    data: withDefaults(result.data),
  };
}
