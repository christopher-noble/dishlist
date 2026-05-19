import type { RecipeFieldsFragment } from '@/src/shared/api/generated/graphql';

export type {
  Recipe,
  RecipeCategory,
  CreateRecipeInput,
  UpdateRecipeInput,
  NutritionalInfo,
  NutritionalInfoInput,
  RecipeFieldsFragment,
} from '@/src/shared/api/generated/graphql';

/** Recipes in the local mock store include timestamps not on the API fragment. */
export type MockRecipe = RecipeFieldsFragment & {
  createdAt: string;
  updatedAt: string;
};
